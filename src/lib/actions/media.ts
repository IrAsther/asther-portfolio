"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Delete a media asset from Supabase Storage AND the media_assets DB record.
 * The storagePath is the path inside the bucket (e.g. "general/1234-file.jpg"),
 * NOT the full public URL.
 */
export async function deleteMediaAssetAction(
  id: string,
  storagePath: string
): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated || !authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Administrator access required.",
      };
    }

    if (!id || !storagePath) {
      return { success: false, error: "Invalid asset id or storage path." };
    }

    const supabase = await createClient();

    // 0. Look up the asset to get its public URL for reference checking
    const { data: assetRow, error: lookupErr } = await supabase
      .from("media_assets")
      .select("url")
      .eq("id", id)
      .maybeSingle();

    if (lookupErr || !assetRow) {
      return { success: false, error: "Asset not found in the catalog." };
    }

    const assetUrl = assetRow.url;

    // 1. Check if this asset URL is referenced by any project, application, or design
    const references: string[] = [];
    try {
      const { data: projRef } = await supabase
        .from("projects")
        .select("title")
        .or(`image.eq.${assetUrl},secondary_image.eq.${assetUrl}`)
        .limit(3);
      if (projRef && projRef.length > 0) {
        references.push(...projRef.map((p: { title: string }) => `Project: ${p.title}`));
      }

      const { data: appRef } = await supabase
        .from("applications")
        .select("name")
        .or(`image.eq.${assetUrl},secondary_image.eq.${assetUrl}`)
        .limit(3);
      if (appRef && appRef.length > 0) {
        references.push(...appRef.map((a: { name: string }) => `Application: ${a.name}`));
      }

      const { data: designRef } = await supabase
        .from("designs")
        .select("title")
        .eq("cover_image", assetUrl)
        .limit(3);
      if (designRef && designRef.length > 0) {
        references.push(...designRef.map((d: { title: string }) => `Design: ${d.title}`));
      }
    } catch {
      // Reference check is best-effort; don't block deletion on query failure
    }

    if (references.length > 0) {
      return {
        success: false,
        error: `This asset is referenced by: ${references.join(", ")}. Remove those references first, then delete the asset.`,
      };
    }

    // 3. Delete from Storage first
    const { error: storageError } = await supabase.storage
      .from("portfolio-media")
      .remove([storagePath]);

    if (storageError) {
      console.error("[deleteMediaAssetAction] Storage error:", storageError.message);
      return {
        success: false,
        error: `Failed to delete from storage: ${storageError.message}. The database record was preserved.`,
      };
    }

    // 4. Storage succeeded — now delete DB record
    const { error: dbError } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("[deleteMediaAssetAction] DB error:", dbError.message);
      return {
        success: false,
        error: `Failed to remove asset record: ${dbError.message}`,
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[deleteMediaAssetAction] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the asset.",
    };
  }
}

/**
 * Update alt text for a media asset.
 */
export async function updateMediaAltTextAction(
  id: string,
  altText: string
): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated || !authStatus.isAuthorizedAdmin) {
      return { success: false, error: "Administrator access required." };
    }

    if (!id) {
      return { success: false, error: "Invalid asset ID." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("media_assets")
      .update({ alt_text: altText.trim() || null })
      .eq("id", id);

    if (error) {
      return { success: false, error: `Failed to update alt text: ${error.message}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[updateMediaAltTextAction] Unexpected error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

