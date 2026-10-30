import "server-only";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string | null;
  role: string;
}

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAuthorizedAdmin: boolean;
  user: AdminUser | null;
  error?: string;
}

/**
 * Server-side verification of administrator authorization.
 *
 * Checks:
 * 1. Fast path: Verifies if proxy.ts already cryptographically authenticated the user
 *    and verified public.admin_users for this request. This eliminates competing token
 *    refresh attempts that trigger 'refresh_token_already_used' errors.
 * 2. Fallback: Full verification via Supabase Auth server and public.admin_users query
 *    for requests originating outside proxy coverage (e.g. background tasks or direct APIs).
 *
 * Never trusts client state or assumption of role.
 */
export async function getAuthenticatedAdmin(): Promise<AdminAuthResult> {
  try {
    // 1. Fast path: Read verified context propagated securely by proxy.ts
    try {
      const headerList = await headers();
      const isVerified = headerList.get("x-admin-auth-verified") === "1";
      const userId = headerList.get("x-admin-user-id");
      const userEmail = headerList.get("x-admin-user-email");
      const userRole = headerList.get("x-admin-user-role");

      if (isVerified && userId) {
        return {
          isAuthenticated: true,
          isAuthorizedAdmin: true,
          user: {
            id: userId,
            email: userEmail || null,
            role: userRole || "admin",
          },
        };
      }
    } catch {
      // In non-request contexts where headers() throws, proceed to fallback
    }

    // 2. Fallback verification: Authenticate with Supabase Auth server
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        isAuthenticated: false,
        isAuthorizedAdmin: false,
        user: null,
        error: userError?.message || "Not authenticated",
      };
    }

    // 3. Query public.admin_users table for administrator mapping
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      // Authenticated with Supabase Auth, but NOT listed in admin_users
      return {
        isAuthenticated: true,
        isAuthorizedAdmin: false,
        user: {
          id: user.id,
          email: user.email ?? null,
          role: "user",
        },
        error: "User is authenticated but does not have administrator privileges.",
      };
    }

    // Fully authenticated and authorized
    return {
      isAuthenticated: true,
      isAuthorizedAdmin: true,
      user: {
        id: user.id,
        email: user.email ?? null,
        role: adminRecord.role,
      },
    };
  } catch (error) {
    console.error("[Auth Server] Unexpected error verifying admin access:", error);
    return {
      isAuthenticated: false,
      isAuthorizedAdmin: false,
      user: null,
      error: "Authentication service encountered an unexpected error.",
    };
  }
}
