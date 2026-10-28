import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Privileged Admin Supabase Client — Strictly Server-Only
 *
 * Uses the SUPABASE_SERVICE_ROLE_KEY to bypass Row Level Security (RLS).
 * MUST ONLY be used for authorized background tasks, system seeds, or verified
 * administrative actions that cannot be performed under normal authenticated roles.
 *
 * NEVER import this file into client components or expose it via client props.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in server environment. Admin operations cannot proceed."
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
