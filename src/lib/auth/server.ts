import "server-only";
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
 * 1. Valid Supabase Auth session via getUser() (validates cryptographic JWT on Supabase Auth server).
 * 2. Active administrator record in public.admin_users (RLS-enforced source of truth).
 *
 * Never trusts client state or assumption of role.
 */
export async function getAuthenticatedAdmin(): Promise<AdminAuthResult> {
  try {
    const supabase = await createClient();

    // 1. Verify authenticated user identity with Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        isAuthenticated: false,
        isAuthorizedAdmin: false,
        user: null,
      };
    }

    // 2. Query public.admin_users table for administrator mapping
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
