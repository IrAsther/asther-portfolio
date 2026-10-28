"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sanitizeAdminRedirect } from "./utils";

export interface AuthActionState {
  success?: boolean;
  error?: string | null;
  message?: string | null;
}

/**
 * Server Action for administrator authentication.
 *
 * Enforces:
 * 1. Supabase Auth email/password validation.
 * 2. Explicit authorization against public.admin_users table.
 * 3. Immediate session cleanup if an authenticated user lacks admin rights.
 * 4. Safe relative redirect destination.
 * 5. Generic error responses that prevent email enumeration.
 */
export async function loginAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const nextTarget = String(formData.get("next") || "");

  if (!email || !password) {
    return {
      error: "Please enter both your email address and password.",
    };
  }

  // Basic email syntax check
  if (!email.includes("@") || !email.includes(".")) {
    return {
      error: "Please enter a valid email address.",
    };
  }

  let safeDestination = "/admin";

  try {
    const supabase = await createClient();

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      // Do not reveal whether email exists or password was incorrect
      return {
        error: "Invalid email or password. Please verify your credentials.",
      };
    }

    // 2. Authorize against public.admin_users
    // A successful login MUST NOT automatically grant admin access.
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (adminError || !adminRecord) {
      // User is authenticated in Supabase Auth, but NOT in public.admin_users.
      // Immediately revoke/clear the session cookie so they cannot retain an active session.
      await supabase.auth.signOut();
      return {
        error:
          "Access denied. Your account is not authorized to access the administrator panel.",
      };
    }

    // 3. Resolve sanitized destination
    safeDestination = sanitizeAdminRedirect(nextTarget);
  } catch (err: unknown) {
    // If Next.js redirect was triggered, rethrow it
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }

    console.error("[Login Action] Unexpected error during authentication:", err);
    return {
      error: "An unexpected error occurred while signing in. Please try again.",
    };
  }

  // Perform redirect outside of try/catch
  redirect(safeDestination);
}

/**
 * Server Action for administrator logout.
 * Clears the Supabase Auth session cookies and redirects to the login screen.
 */
export async function logoutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("[Logout Action] Error signing out:", error);
  }

  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (c.name.startsWith("sb-") && c.name.includes("-auth-token")) {
        cookieStore.delete(c.name);
      }
    }
  } catch (cookieError) {
    console.error("[Logout Action] Error purging cookie store:", cookieError);
  }

  redirect("/admin/login?status=logged-out");
}
