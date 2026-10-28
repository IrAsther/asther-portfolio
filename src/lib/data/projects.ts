/**
 * Data Access Layer — Projects
 *
 * Server-only module.
 * Queries Supabase when configured, with seamless fallback to static verified
 * data in `src/data/projects.ts` when database is not yet connected or configured.
 */

import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { featuredProjects, type Project } from "@/data/projects";
import { initialProjects } from "@/data/adminMockData";
import type { AdminProject, ProjectStatusType } from "@/types/admin";

export interface ProjectDTO {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem?: string;
  direction?: string;
  technologies: string[];
  status: string;
  statusType?: "showcase" | "active" | "architecture" | "planned";
  featured?: boolean;
  isPlaceholder?: boolean;
  href?: string;
  image?: string;
  secondaryImage?: string;
}

function staticToDTO(item: Project): ProjectDTO {
  return {
    id: item.id,
    slug: item.id,
    title: item.title,
    category: item.category,
    summary: item.summary,
    problem: item.problem,
    direction: item.direction,
    technologies: item.technologies,
    status: item.status,
    statusType: item.statusType,
    featured: item.featured,
    isPlaceholder: item.isPlaceholder,
    href: item.href,
    image: item.image,
    secondaryImage: item.secondaryImage,
  };
}

/**
 * Public query: Fetch all published projects.
 * Falls back to static projects if Supabase is unconfigured or unreachable.
 */
export async function getPublishedProjects(): Promise<ProjectDTO[]> {
  if (!isSupabaseConfigured()) {
    return featuredProjects.map(staticToDTO);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return featuredProjects.map(staticToDTO);
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      summary: row.summary,
      problem: row.problem ?? undefined,
      direction: row.direction ?? undefined,
      technologies: row.technologies,
      status: row.status,
      statusType: row.status_type as ProjectDTO["statusType"],
      featured: row.featured,
      isPlaceholder: row.is_placeholder,
      href: row.href ?? undefined,
      image: row.image ?? undefined,
      secondaryImage: row.secondary_image ?? undefined,
    }));
  } catch {
    return featuredProjects.map(staticToDTO);
  }
}

/**
 * Public query: Fetch featured published projects for the homepage.
 */
export async function getFeaturedProjects(): Promise<ProjectDTO[]> {
  const all = await getPublishedProjects();
  return all.filter((p) => p.featured);
}

/**
 * Public query: Fetch a single published project by its slug.
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDTO | null> {
  const all = await getPublishedProjects();
  return all.find((p) => p.slug === slug || p.id === slug) ?? null;
}

/**
 * Admin query: Fetch all projects (both published and drafts) for the admin dashboard.
 */
export async function getAllProjectsAdmin(): Promise<AdminProject[]> {
  if (!isSupabaseConfigured()) {
    return initialProjects;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) {
        console.error("[DAL Projects Admin] Error fetching admin projects:", error);
      }
      return initialProjects;
    }

    return data.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      summary: row.summary,
      problem: row.problem ?? "",
      direction: row.direction ?? "",
      technologies: row.technologies ?? [],
      status: row.status,
      statusType: (row.status_type as ProjectStatusType) || "planned",
      published: row.published,
      featured: row.featured,
      isPlaceholder: row.is_placeholder,
      href: row.href ?? "/projects",
      image: row.image ?? "",
      secondaryImage: row.secondary_image ?? undefined,
      sortOrder: row.sort_order,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("[DAL Projects Admin] Unexpected error:", err);
    return initialProjects;
  }
}

/**
 * Admin query: Fetch a single project by ID or slug for the admin edit form.
 */
export async function getProjectByIdAdmin(idOrSlug: string): Promise<AdminProject | null> {
  if (!isSupabaseConfigured()) {
    return initialProjects.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
  }

  try {
    const supabase = await createClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    let query = supabase.from("projects").select("*");
    if (isUuid) {
      query = query.eq("id", idOrSlug);
    } else {
      query = query.eq("slug", idOrSlug);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      if (error) {
        console.error("[DAL Projects Admin] Error fetching project by ID:", error);
      }
      return initialProjects.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      category: data.category,
      summary: data.summary,
      problem: data.problem ?? "",
      direction: data.direction ?? "",
      technologies: data.technologies ?? [],
      status: data.status,
      statusType: (data.status_type as ProjectStatusType) || "planned",
      published: data.published,
      featured: data.featured,
      isPlaceholder: data.is_placeholder,
      href: data.href ?? "/projects",
      image: data.image ?? "",
      secondaryImage: data.secondary_image ?? undefined,
      sortOrder: data.sort_order,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error("[DAL Projects Admin] Unexpected error in getProjectByIdAdmin:", err);
    return initialProjects.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
  }
}
