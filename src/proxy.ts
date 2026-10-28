import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { sanitizeAdminRedirect } from "@/lib/auth/utils";

/**
 * Next.js 16 Session Proxy for Asther Portfolio Admin Routes.
 *
 * Replaces deprecated middleware.js as specified in Next.js 16 file conventions.
 *
 * Responsibilities:
 * 1. Refreshes Supabase Auth session cookies on every admin request before rendering.
 * 2. Enforces authentication boundaries: unauthenticated users are redirected to /admin/login.
 * 3. Enforces authorization boundaries: authenticated non-admins cannot access admin routes.
 * 4. Prevents authenticated admins from unnecessarily seeing the login screen.
 * 5. Sanitizes redirect parameters against open-redirect vulnerabilities.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Propagate the pathname to server components via custom request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-pathname", pathname);

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not available or are placeholders, allow the request
  // so development/fallback states can render without crash.
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("your-project-ref")
  ) {
    return response;
  }

  // Create an SSR Supabase client that manages session cookies via request/response
  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Verify auth session securely on the Supabase Auth server (never trust cookies alone)
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const isLoginPage = pathname === "/admin/login";

  // --- Scenario 1: Unauthenticated Visitor ---
  if (!user) {
    if (!isLoginPage) {
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

    // Accessing /admin/login while unauthenticated -> allow
    return applyAdminCacheHeaders(response);
  }

  // --- Scenario 2: Authenticated User (Verify Admin Authorization) ---
  // A successful Supabase login does NOT automatically grant admin access.
  const { data: adminRecord } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  const isAuthorizedAdmin = Boolean(adminRecord?.id);

  // Authenticated Admin visiting /admin/login -> redirect to dashboard or safe return target
  if (isLoginPage && isAuthorizedAdmin) {
    const rawNext = request.nextUrl.searchParams.get("next");
    const safeTarget = sanitizeAdminRedirect(rawNext);
    const redirectUrl = new URL(safeTarget, request.url);

    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return applyAdminCacheHeaders(redirectResponse);
  }

  // Authenticated non-admin attempting to access protected admin routes -> deny access
  if (!isLoginPage && !isAuthorizedAdmin) {
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
