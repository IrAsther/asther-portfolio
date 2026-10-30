import React from "react";
import { MediaLibrary } from "@/components/admin/media/MediaLibrary";
import { getAllMediaAssetsAdmin } from "@/lib/data/media";
import { AdminMediaAsset } from "@/types/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Library — Admin",
};

/** Derive the storage path from the public URL. */
function extractStoragePath(publicUrl: string): string {
  // Public URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const marker = "/object/public/portfolio-media/";
  const idx = publicUrl.indexOf(marker);
  if (idx !== -1) {
    return publicUrl.slice(idx + marker.length);
  }
  // Fallback: return the full URL if pattern doesn't match
  return publicUrl;
}

export default async function AdminMediaPage() {
  const rows = await getAllMediaAssetsAdmin();

  const assets: AdminMediaAsset[] = rows.map((row) => ({
    id: row.id,
    filename: row.filename,
    url: row.url,
    storagePath: extractStoragePath(row.url),
    sizeBytes: row.size_bytes,
    mimeType: row.mime_type,
    category: row.category,
    altText: row.alt_text,
    createdAt: row.created_at,
  }));

  return <MediaLibrary initialAssets={assets} />;
}
