import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Creates a Supabase client for browser-side components.
 * Uses public environment variables (safe for client bundles).
 * Operates under Row Level Security (RLS) as an unauthenticated or authenticated user.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a dummy client or throw in development to alert misconfiguration
    return createBrowserClient<Database>(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder-anon-key"
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
