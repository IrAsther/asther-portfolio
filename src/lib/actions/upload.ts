"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";

export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  sizeBytes: number;
  /** The media_assets database record ID (null if DB insert failed) */
  assetId: string | null;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates the file buffer against known image magic numbers
 * to guard against extension or MIME spoofing.
 */
function isValidImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WEBP: "RIFF" .... "WEBP"
  if (mimeType === "image/webp") {
    const isRiff = buffer.toString("ascii", 0, 4) === "RIFF";
    const isWebp = buffer.toString("ascii", 8, 12) === "WEBP";
    return isRiff && isWebp;
  }

  return false;
}

/**
 * Server Action: Upload media asset to Supabase Storage.
 * Strictly restricted to authenticated administrators.
 */
export async function uploadMediaAction(
  formData: FormData,
  folderArg?: "projects" | "applications" | "designs/covers" | "designs/gallery" | "general"
): Promise<ActionResponse<UploadResult>> {
  console.log("[upload_action_started]", {
    timestamp: new Date().toISOString(),
    hasFormData: Boolean(formData),
    folderArg: folderArg || null,
  });

  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated) {
      console.warn("[upload_auth_failed]", { reason: "unauthenticated" });
      return {
        success: false,
        error: "Authentication required. Please sign in to upload files.",
      };
    }

    if (!authStatus.isAuthorizedAdmin) {
      console.warn("[upload_auth_failed]", { reason: "unauthorized_non_admin" });
      return {
        success: false,
        error: "Administrator access required. Only authorized administrators may upload files.",
      };
    }

    console.log("[admin_authorization_passed]", {
      userId: authStatus.user?.id ? `${authStatus.user.id.slice(0, 8)}...` : null,
    });

    // 2. Resolve Target Folder
    const rawFolder = (formData.get("folder") as string) || folderArg || "general";
    const validFolders = ["projects", "applications", "designs/covers", "designs/gallery", "general"];
    const folder = validFolders.includes(rawFolder)
      ? (rawFolder as "projects" | "applications" | "designs/covers" | "designs/gallery" | "general")
      : "general";

    // 3. Extract and Validate File Object
    const file = formData.get("file");
    if (!file || typeof file === "string" || typeof (file as Blob).arrayBuffer !== "function") {
      console.warn("[file_validation_failed]", { reason: "invalid_file_object" });
      return {
        success: false,
        error: "No valid file provided for upload.",
      };
    }

    const uploadedFile = file as File;
    const mimeType = (uploadedFile.type || "").toLowerCase();
    const originalName = uploadedFile.name || "image.jpg";

    // 4. File Type Check
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      console.warn("[file_validation_failed]", { reason: "invalid_mime_type", mimeType });
      return {
        success: false,
        error: `Invalid image format (${mimeType || "unknown"}). Allowed formats: JPG, JPEG, PNG, WEBP.`,
      };
    }

    // 5. File Size Check
    if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (uploadedFile.size / (1024 * 1024)).toFixed(1);
      console.warn("[file_validation_failed]", { reason: "file_too_large", sizeBytes: uploadedFile.size });
      return {
        success: false,
        error: `Image exceeds 5 MB limit (current: ${sizeMb} MB). Please choose a smaller file.`,
      };
    }

    // 6. Convert to Buffer and Inspect Magic Bytes
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isValidImageMagicBytes(buffer, mimeType)) {
      console.warn("[file_validation_failed]", { reason: "magic_bytes_mismatch", mimeType });
      return {
        success: false,
        error: "Invalid image content. The uploaded file does not match a valid JPEG, PNG, or WEBP signature.",
      };
    }

    console.log("[file_validation_passed]", {
      filename: originalName,
      mimeType,
      sizeBytes: uploadedFile.size,
      folder,
    });

    const supabase = await createClient();

    // 7. Generate Sanitized Unique Storage Path
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_");
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `${folder}/${uniquePrefix}-${sanitizedName}`;

    console.log("[storage_upload_started]", { storagePath, bucket: "portfolio-media" });

    // 8. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("[storage_upload_failed]", { error: uploadError.message });

      const msg = uploadError.message?.toLowerCase() || "";
      let userFriendlyError = `Upload failed: ${uploadError.message}.`;

      if (
        msg.includes("bucket not found") ||
        msg.includes("does not exist") ||
        (uploadError as { statusCode?: string }).statusCode === "404"
      ) {
        userFriendlyError = "Storage bucket not configured. The 'portfolio-media' bucket does not exist in Supabase yet.";
      } else if (
        msg.includes("row-level security") ||
        msg.includes("violates row-level") ||
        msg.includes("unauthorized") ||
        (uploadError as { statusCode?: string }).statusCode === "403"
      ) {
        userFriendlyError = "Storage permission denied. Ensure you are signed in as an administrator with storage policies applied.";
      } else if (msg.includes("payload too large") || msg.includes("entity too large")) {
        userFriendlyError = "File exceeds the storage bucket size limit (5 MB).";
      }

      return {
        success: false,
        error: userFriendlyError,
      };
    }

    console.log("[storage_upload_completed]", { storagePath });

    // 9. Get Public URL
    const { data: urlData } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 10. Record in media_assets catalog (non-blocking)
    let assetId: string | null = null;
    console.log("[metadata_insert_started]", { filename: sanitizedName });
    try {
      const { data: insertedRow, error: assetDbError } = await supabase.from("media_assets").insert({
        filename: sanitizedName,
        url: publicUrl,
        size_bytes: uploadedFile.size,
        mime_type: mimeType,
        category: folder.startsWith("designs") ? "design" : folder === "applications" ? "projects" : folder,
        created_by: authStatus.user?.id || null,
      }).select("id").single();

      if (assetDbError) {
        console.warn("[metadata_insert_warn]", { error: assetDbError.message });
      } else if (insertedRow) {
        assetId = insertedRow.id;
        console.log("[metadata_insert_completed]", { assetId });
      }
    } catch (dbErr) {
      console.warn("[metadata_insert_failed]", { error: String(dbErr) });
    }

    console.log("[upload_action_completed]", {
      success: true,
      assetId,
      filename: sanitizedName,
    });

    return {
      success: true,
      data: {
        url: publicUrl,
        path: storagePath,
        filename: sanitizedName,
        sizeBytes: uploadedFile.size,
        assetId,
      },
    };
  } catch (err) {
    console.error("[upload_action_unexpected_error]", err);
    return {
      success: false,
      error: "Upload failed due to an unexpected server error. Please try again or paste a direct image URL.",
    };
  }
}

/**
 * Server Action: Delete a media asset from Supabase Storage.
 * Strictly restricted to authorized administrators.
 */
export async function deleteMediaAction(storagePath: string): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may delete storage media.",
      };
    }

    if (!storagePath || typeof storagePath !== "string" || !storagePath.trim()) {
      return {
        success: false,
        error: "Invalid storage path provided.",
      };
    }

    const cleanPath = storagePath.trim();
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from("portfolio-media")
      .remove([cleanPath]);

    if (error) {
      console.error("[Delete Media Action] Storage error:", error);
      return {
        success: false,
        error: `Failed to delete media from storage: ${error.message}`,
      };
    }

    // Clean up record from media_assets catalog if present
    try {
      await supabase.from("media_assets").delete().eq("url", cleanPath);
    } catch {
      // non-blocking
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error("[Delete Media Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the media file.",
    };
  }
}
