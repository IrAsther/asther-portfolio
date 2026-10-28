/**
 * Data Access Layer — Applications
 *
 * Server-only module.
 * Queries Supabase when configured, with seamless fallback to static verified
 * data in `src/data/apps.ts` when database is not yet connected or configured.
 */

import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { appsData, type AppItem } from "@/data/apps";
import { initialApps } from "@/data/adminMockData";
import type { AdminApp, AppStatusType } from "@/types/admin";

export interface ApplicationDTO {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  problem: string;
  direction: string;
  technologies: string[];
  status: string;
  statusType: "showcase" | "in-development" | "prototype" | "architecture" | "concept";
  featured?: boolean;
  highlights: string[];
  image?: string;
  secondaryImage?: string;
  href?: string;
  demoUrl?: string;
  downloadUrl?: string;
  githubUrl?: string;
}

function staticToDTO(item: AppItem): ApplicationDTO {
  return {
    id: item.id,
    slug: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    problem: item.problem,
    direction: item.direction,
    technologies: item.technologies,
    status: item.status,
    statusType: item.statusType,
    featured: item.featured,
    highlights: item.highlights,
    image: item.image,
    secondaryImage: item.secondaryImage,
    href: item.href,
    demoUrl: item.href,
  };
}

/**
 * Public query: Fetch all published applications.
 */
export async function getPublishedApplications(): Promise<ApplicationDTO[]> {
  if (!isSupabaseConfigured()) {
    return appsData.map(staticToDTO);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return appsData.map(staticToDTO);
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      description: row.description,
      problem: row.problem ?? "",
      direction: row.direction ?? "",
      technologies: row.technologies,
      status: row.status,
      statusType: (row.status_type as ApplicationDTO["statusType"]) || "concept",
      featured: row.featured,
      highlights: row.highlights,
      image: row.image ?? undefined,
      secondaryImage: row.secondary_image ?? undefined,
      href: row.demo_url ?? undefined,
      demoUrl: row.demo_url ?? undefined,
      downloadUrl: row.download_url ?? undefined,
      githubUrl: row.github_url ?? undefined,
    }));
  } catch {
    return appsData.map(staticToDTO);
  }
}

/**
 * Public query: Fetch featured published applications.
 */
export async function getFeaturedApplications(): Promise<ApplicationDTO[]> {
  const all = await getPublishedApplications();
  return all.filter((a) => a.featured);
}

/**
 * Public query: Fetch a single application by slug.
 */
export async function getApplicationBySlug(slug: string): Promise<ApplicationDTO | null> {
  const all = await getPublishedApplications();
  return all.find((a) => a.slug === slug || a.id === slug) ?? null;
}

/**
 * Admin query: Fetch all applications (both published and drafts) for the admin dashboard.
 */
export async function getAllApplicationsAdmin(): Promise<AdminApp[]> {
  if (!isSupabaseConfigured()) {
    return initialApps;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("[DAL Apps Admin] Error fetching admin applications:", error);
      }
      return initialApps;
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      description: row.description,
      problem: row.problem ?? "",
      direction: row.direction ?? "",
      technologies: row.technologies ?? [],
      status: row.status,
      statusType: (row.status_type as AppStatusType) || "concept",
      published: row.published,
      featured: row.featured,
      highlights: row.highlights ?? [],
      image: row.image ?? "",
      secondaryImage: row.secondary_image ?? undefined,
      demoUrl: row.demo_url ?? undefined,
      downloadUrl: row.download_url ?? undefined,
      githubUrl: row.github_url ?? undefined,
      sortOrder: row.sort_order,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[DAL Apps Admin] Unexpected error:", err);
    return initialApps;
  }
}

/**
 * Admin query: Fetch a single application by ID or slug for the admin edit form.
 */
export async function getApplicationByIdAdmin(idOrSlug: string): Promise<AdminApp | null> {
  if (!isSupabaseConfigured()) {
    return initialApps.find((a) => a.id === idOrSlug || a.slug === idOrSlug) ?? null;
  }

  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase.from("applications").select("*");
    if (isUuid) {
      query = query.eq("id", idOrSlug);
    } else {
      query = query.eq("slug", idOrSlug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      if (error) {
        console.error("[DAL Apps Admin] Error fetching application by ID:", error);
      }
      return initialApps.find((a) => a.id === idOrSlug || a.slug === idOrSlug) ?? null;
    }

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      category: data.category,
      description: data.description,
      problem: data.problem ?? "",
      direction: data.direction ?? "",
      technologies: data.technologies ?? [],
      status: data.status,
      statusType: (data.status_type as AppStatusType) || "concept",
      published: data.published,
      featured: data.featured,
      highlights: data.highlights ?? [],
      image: data.image ?? "",
      secondaryImage: data.secondary_image ?? undefined,
      demoUrl: data.demo_url ?? undefined,
      downloadUrl: data.download_url ?? undefined,
      githubUrl: data.github_url ?? undefined,
      sortOrder: data.sort_order,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("[DAL Apps Admin] Unexpected error in getApplicationByIdAdmin:", err);
    return initialApps.find((a) => a.id === idOrSlug || a.slug === idOrSlug) ?? null;
  }
}
