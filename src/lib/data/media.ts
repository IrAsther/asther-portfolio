import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export interface MediaAssetRow {
  id: string;
  filename: string;
  url: string;
  size_bytes: number;
  mime_type: string;
  category: string;
  alt_text: string | null;
  created_at: string;
  created_by: string | null;
}

/**
 * Fetch all media assets ordered by newest first.
 * Admin-only: caller must already be authenticated (action layer handles auth).
 */
export async function getAllMediaAssetsAdmin(): Promise<MediaAssetRow[]> {
  if (!isSupabaseConfigured()) {
    console.warn("[Media DAL] Supabase is not configured.");
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, filename, url, size_bytes, mime_type, category, alt_text, created_at, created_by")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Media DAL] getAllMediaAssetsAdmin error:", error.message);
    return [];
  }

  return (data ?? []) as MediaAssetRow[];
}

/**
 * Get a single asset by its storage_path (url in the DB).
 * Returns null if not found.
 */
export async function getMediaAssetByUrl(url: string): Promise<MediaAssetRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, filename, url, size_bytes, mime_type, category, alt_text, created_at, created_by")
    .eq("url", url)
    .maybeSingle();

  if (error) {
    console.error("[Media DAL] getMediaAssetByUrl error:", error.message);
    return null;
  }

  return data as MediaAssetRow | null;
}

/**
 * Get a single asset by ID.
 */
export async function getMediaAssetById(id: string): Promise<MediaAssetRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, filename, url, size_bytes, mime_type, category, alt_text, created_at, created_by")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[Media DAL] getMediaAssetById error:", error.message);
    return null;
  }

  return data as MediaAssetRow | null;
}

