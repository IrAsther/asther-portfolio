/**
 * Data Access Layer — Designs
 * Server-only module.
 */
import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AdminDesign, DesignGalleryItem } from "@/types/admin";

export interface DesignDTO {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  tools: string[];
  coverImage: string | null;
  gallery: DesignGalleryItem[];
  externalUrl: string | null;
  projectDate: string | null;
  featured: boolean;
}

// Helper to safely parse gallery JSONB
function parseGallery(raw: unknown): DesignGalleryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is DesignGalleryItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).url === "string"
  );
}

/**
 * Public query: Fetch all published designs, ordered by sort_order then created_at desc.
 */
export async function getPublishedDesigns(): Promise<DesignDTO[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[DAL Designs Public] Error fetching published designs:", error.message);
      return [];
    }
    if (!data) return [];
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      description: row.description ?? null,
      tools: row.tools ?? [],
      coverImage: row.cover_image ?? null,
      gallery: parseGallery(row.gallery),
      externalUrl: row.external_url ?? null,
      projectDate: row.project_date ?? null,
      featured: row.featured,
    }));
  } catch {
    return [];
  }
}

/**
 * Public query: Fetch a single published design by slug.
 */
export async function getDesignBySlug(slug: string): Promise<DesignDTO | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      description: data.description ?? null,
      tools: data.tools ?? [],
      coverImage: data.cover_image ?? null,
      gallery: parseGallery(data.gallery),
      externalUrl: data.external_url ?? null,
      projectDate: data.project_date ?? null,
      featured: data.featured,
    };
  } catch {
    return null;
  }
}

/**
 * Admin query: Fetch all designs (published and drafts).
 */
export async function getAllDesignsAdmin(): Promise<AdminDesign[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) {
      if (error) console.error("[DAL Designs Admin] Error:", error);
      return [];
    }
    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      description: row.description ?? "",
      tools: row.tools ?? [],
      coverImage: row.cover_image ?? null,
      gallery: parseGallery(row.gallery),
      externalUrl: row.external_url ?? null,
      projectDate: row.project_date ?? null,
      published: row.published,
      featured: row.featured,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[DAL Designs Admin] Unexpected error:", err);
    return [];
  }
}

/**
 * Admin query: Fetch a single design by ID for the admin edit form.
 */
export async function getDesignByIdAdmin(id: string): Promise<AdminDesign | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      description: data.description ?? "",
      tools: data.tools ?? [],
      coverImage: data.cover_image ?? null,
      gallery: parseGallery(data.gallery),
      externalUrl: data.external_url ?? null,
      projectDate: data.project_date ?? null,
      published: data.published,
      featured: data.featured,
      sortOrder: data.sort_order,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("[DAL Designs Admin] Error in getDesignByIdAdmin:", err);
    return null;
  }
}
