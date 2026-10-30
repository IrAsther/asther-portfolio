import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { sanitizeAdminRedirect } from "@/lib/auth/utils";

/**
 * Next.js 16 Session Proxy for Asther Portfolio Admin Routes.
 *
 * Responsibilities:
 * 1. Single source of session refresh: Refreshes Supabase Auth session cookies once per request.
 * 2. Propagates fresh cookies and verified admin context into request headers so downstream
 *    Server Components and Server Actions read valid tokens without competing refresh attempts.
 * 3. Enforces authentication boundaries: unauthenticated users are redirected to /admin/login.
 * 4. Enforces authorization boundaries: authenticated non-admins cannot access admin routes.
 * 5. Prevents infinite redirect loops on /admin/login.
 * 6. Avoids session refresh races on prefetch requests.
 * 7. Sanitizes redirect parameters against open-redirect vulnerabilities.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Defensively strip any spoofable internal authentication headers from incoming request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-admin-auth-verified");
  requestHeaders.delete("x-admin-user-id");
  requestHeaders.delete("x-admin-user-email");
  requestHeaders.delete("x-admin-user-role");

  // Propagate pathname to server components
  requestHeaders.set("x-admin-pathname", pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not available or are placeholders, allow request
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("your-project-ref")
  ) {
    return response;
  }

  const isLoginPage = pathname === "/admin/login";
  const isServerAction = request.headers.has("next-action");

  // Helper to ensure sensitive admin responses are never cached by browsers or intermediaries
  const applyAdminCacheHeaders = (res: NextResponse): NextResponse => {
    res.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  };

  // 2. Prevent Next.js link prefetching from competing for single-use refresh tokens.
  // Next.js Link prefetching sends multiple simultaneous requests that would otherwise
  // consume single-use refresh tokens concurrently and trigger 'refresh_token_already_used'.
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    const hasAuthCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

    if (!hasAuthCookie && !isLoginPage) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      return applyAdminCacheHeaders(NextResponse.redirect(redirectUrl));
    }

    return applyAdminCacheHeaders(response);
  }

  // 3. Create an SSR Supabase client that manages session cookies via request/response
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // a. Update request cookies (properly removing deleted tokens)
        cookiesToSet.forEach(({ name, value, options }) => {
          if (
            options &&
            (options.maxAge === 0 ||
              (options.expires && options.expires.getTime() <= Date.now()))
          ) {
            request.cookies.delete(name);
          } else {
            request.cookies.set(name, value);
          }
        });

        // b. Synchronize the updated cookies into requestHeaders so downstream
        // Server Components and Server Actions receive fresh tokens
        requestHeaders.set(
          "cookie",
          request.cookies
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; ")
        );

        // c. Re-create the NextResponse with updated requestHeaders
        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });

        // d. Set updated cookies on the response so the browser receives them
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // 4. Verify auth session securely on the Supabase Auth server (never trust cookies alone)
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    } else if (error) {
      // Safe logging for debugging
      if (error.code !== "refresh_token_already_used") {
        console.warn("[Proxy Auth] getUser notice:", error.message);
      }
    }
  } catch (err) {
    console.warn("[Proxy Auth] Unexpected error verifying user:", err);
  }

  // --- Scenario 1: Unauthenticated Visitor ---
  if (!user) {
    if (isLoginPage) {
      // Accessing /admin/login while unauthenticated -> allow
      return applyAdminCacheHeaders(response);
    }

    // For Server Actions, do NOT issue a raw HTTP 307 redirect:
    // In Next.js App Router, returning a raw 307 redirect for a Server Action
    // causes fetchServerAction to follow the redirect to /admin/login (HTML)
    // and throw: "Error: An unexpected response was received from the server."
    // Instead, allow the action to execute its own getAuthenticatedAdmin() check
    // and return a safe, serializable { success: false, error: "Authentication required" } payload.
    if (isServerAction) {
      return applyAdminCacheHeaders(response);
    }

    // Attempting to access protected admin route -> redirect to login with safe next param
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    if (pathname !== "/admin") {
      redirectUrl.searchParams.set("next", sanitizeAdminRedirect(pathname));
    }

    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Transfer any updated cookies to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return applyAdminCacheHeaders(redirectResponse);
  }

  // --- Scenario 2: Authenticated User (Verify Admin Authorization) ---
  let isAuthorizedAdmin = false;
  let adminRole = "admin";

  try {
    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminRecord?.id) {
      isAuthorizedAdmin = true;
      adminRole = adminRecord.role || "admin";
    }
  } catch (adminErr) {
    console.warn("[Proxy Auth] Error querying admin_users:", adminErr);
  }

  // Propagate verified identity headers to Server Components and Server Actions
  if (isAuthorizedAdmin) {
    requestHeaders.set("x-admin-auth-verified", "1");
    requestHeaders.set("x-admin-user-id", user.id);
    requestHeaders.set("x-admin-user-email", user.email || "");
    requestHeaders.set("x-admin-user-role", adminRole);

    const prevCookies = response.cookies.getAll();
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    prevCookies.forEach((c) => response.cookies.set(c));
  }

  // Authenticated Admin visiting /admin/login -> redirect to dashboard or safe return target
  if (isLoginPage && isAuthorizedAdmin) {
    const statusParam = request.nextUrl.searchParams.get("status");
    const errorParam = request.nextUrl.searchParams.get("error");

    // Do NOT auto-redirect away if user explicitly logged out or has an error message
    if (!statusParam && !errorParam) {
      const rawNext = request.nextUrl.searchParams.get("next");
      const safeTarget = sanitizeAdminRedirect(rawNext);
      const redirectUrl = new URL(safeTarget, request.url);

      const redirectResponse = NextResponse.redirect(redirectUrl);
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return applyAdminCacheHeaders(redirectResponse);
    }

    return applyAdminCacheHeaders(response);
  }

  // Authenticated non-admin attempting to access protected admin routes -> deny access
  if (!isLoginPage && !isAuthorizedAdmin) {
    if (isServerAction) {
      return applyAdminCacheHeaders(response);
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("error", "unauthorized");

    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return applyAdminCacheHeaders(redirectResponse);
  }

  return applyAdminCacheHeaders(response);
}

export const config = {
  matcher: ["/admin/:path*"],
};
