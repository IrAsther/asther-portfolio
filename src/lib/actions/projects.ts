"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import type { AdminProject, ProjectStatusType } from "@/types/admin";

export interface ProjectInput {
  title: string;
  slug: string;
  category: string;
  summary: string;
  problem?: string;
  direction?: string;
  technologies?: string[];
  status: string;
  statusType: ProjectStatusType;
  published?: boolean;
  featured?: boolean;
  isPlaceholder?: boolean;
  href?: string;
  image?: string;
  secondaryImage?: string;
  sortOrder?: number;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const VALID_STATUS_TYPES: ProjectStatusType[] = [
  "showcase",
  "active",
  "architecture",
  "planned",
];

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates project input data on the server.
 */
function validateProjectInput(input: Partial<ProjectInput>): {
  valid: boolean;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const title = input.title?.trim() || "";
  if (!title) {
    fieldErrors.title = "Project title is required.";
  } else if (title.length < 2) {
    fieldErrors.title = "Project title must be at least 2 characters.";
  } else if (title.length > 200) {
    fieldErrors.title = "Project title cannot exceed 200 characters.";
  }

  const slug = input.slug?.trim().toLowerCase() || "";
  if (!slug) {
    fieldErrors.slug = "URL slug is required.";
  } else if (!SLUG_REGEX.test(slug)) {
    fieldErrors.slug =
      "Slug must contain only lowercase alphanumeric characters and hyphens (e.g. 'my-cool-project').";
  } else if (slug.length > 100) {
    fieldErrors.slug = "Slug cannot exceed 100 characters.";
  }

  const category = input.category?.trim() || "";
  if (!category) {
    fieldErrors.category = "Category is required.";
  } else if (category.length > 100) {
    fieldErrors.category = "Category cannot exceed 100 characters.";
  }

  const summary = input.summary?.trim() || "";
  if (!summary) {
    fieldErrors.summary = "Executive summary is required.";
  } else if (summary.length < 10) {
    fieldErrors.summary = "Summary must be at least 10 characters.";
  }

  const status = input.status?.trim() || "";
  if (!status) {
    fieldErrors.status = "Status label is required.";
  }

  if (!input.statusType || !VALID_STATUS_TYPES.includes(input.statusType)) {
    fieldErrors.statusType = `Status type must be one of: ${VALID_STATUS_TYPES.join(", ")}.`;
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

/**
 * Revalidates all relevant cached paths when project data changes.
 */
function revalidateProjectPaths() {
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}

/**
 * Server Action: Create a new project in Supabase.
 */
export async function createProjectAction(
  input: ProjectInput
): Promise<ActionResponse<AdminProject>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may create projects.",
      };
    }

    // 2. Server-Side Validation
    const validation = validateProjectInput(input);
    if (!validation.valid) {
      return {
        success: false,
        error: "Please correct the highlighted validation errors.",
        fieldErrors: validation.fieldErrors,
      };
    }

    const supabase = await createClient();

    // 3. Normalize Payload matching database schema
    const payload = {
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      category: input.category.trim(),
      summary: input.summary.trim(),
      problem: input.problem?.trim() || null,
      direction: input.direction?.trim() || null,
      technologies: Array.isArray(input.technologies)
        ? input.technologies.filter(Boolean)
        : [],
      status: input.status.trim(),
      status_type: input.statusType,
      published: Boolean(input.published),
      featured: Boolean(input.featured),
      is_placeholder: Boolean(input.isPlaceholder),
      href: input.href?.trim() || null,
      image: input.image?.trim() || null,
      secondary_image: input.secondaryImage?.trim() || null,
      sort_order:
        typeof input.sortOrder === "number" && !isNaN(input.sortOrder)
          ? Math.max(0, Math.floor(input.sortOrder))
          : 0,
    };

    // 4. Insert into Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select()
      .single();

    if (error) {
      // Postgres error code 23505: unique_violation
      if (error.code === "23505" || error.message.includes("unique")) {
        return {
          success: false,
          error: `A project with the slug "${payload.slug}" already exists. Please choose a unique slug.`,
          fieldErrors: {
            slug: "This slug is already in use by another project.",
          },
        };
      }

      console.error("[Create Project Action] Database error:", error);
      return {
        success: false,
        error: "Database error occurred while saving the project.",
      };
    }

    // 5. Revalidate Cache
    revalidateProjectPaths();

    return {
      success: true,
      data: {
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        summary: data.summary,
        problem: data.problem ?? "",
        direction: data.direction ?? "",
        technologies: data.technologies ?? [],
        status: data.status,
        statusType: data.status_type as ProjectStatusType,
        published: data.published,
        featured: data.featured,
        isPlaceholder: data.is_placeholder,
        href: data.href ?? "/projects",
        image: data.image ?? "",
        secondaryImage: data.secondary_image ?? undefined,
        sortOrder: data.sort_order,
        updatedAt: data.updated_at,
      },
    };
  } catch (err) {
    console.error("[Create Project Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while creating the project.",
    };
  }
}

/**
 * Server Action: Update an existing project in Supabase.
 */
export async function updateProjectAction(
  id: string,
  input: ProjectInput
): Promise<ActionResponse<AdminProject>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may update projects.",
      };
    }

    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid project ID provided.",
      };
    }

    // 2. Server-Side Validation
    const validation = validateProjectInput(input);
    if (!validation.valid) {
      return {
        success: false,
        error: "Please correct the highlighted validation errors.",
        fieldErrors: validation.fieldErrors,
      };
    }

    const supabase = await createClient();

    // 3. Normalize Payload
    const payload = {
      slug: input.slug.trim().toLowerCase(),
      title: input.title.trim(),
      category: input.category.trim(),
      summary: input.summary.trim(),
      problem: input.problem?.trim() || null,
      direction: input.direction?.trim() || null,
      technologies: Array.isArray(input.technologies)
        ? input.technologies.filter(Boolean)
        : [],
      status: input.status.trim(),
      status_type: input.statusType,
      published: Boolean(input.published),
      featured: Boolean(input.featured),
      is_placeholder: Boolean(input.isPlaceholder),
      href: input.href?.trim() || null,
      image: input.image?.trim() || null,
      secondary_image: input.secondaryImage?.trim() || null,
      sort_order:
        typeof input.sortOrder === "number" && !isNaN(input.sortOrder)
          ? Math.max(0, Math.floor(input.sortOrder))
          : 0,
    };

    // 4. Update in Supabase
    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505" || error.message.includes("unique")) {
        return {
          success: false,
          error: `A project with the slug "${payload.slug}" already exists. Please choose a unique slug.`,
          fieldErrors: {
            slug: "This slug is already in use by another project.",
          },
        };
      }

      console.error("[Update Project Action] Database error:", error);
      return {
        success: false,
        error: "Database error occurred while updating the project.",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Project record not found or could not be updated.",
      };
    }

    // 5. Revalidate Cache
    revalidateProjectPaths();

    return {
      success: true,
      data: {
        id: data.id,
        slug: data.slug,
        title: data.title,
        category: data.category,
        summary: data.summary,
        problem: data.problem ?? "",
        direction: data.direction ?? "",
        technologies: data.technologies ?? [],
        status: data.status,
        statusType: data.status_type as ProjectStatusType,
        published: data.published,
        featured: data.featured,
        isPlaceholder: data.is_placeholder,
        href: data.href ?? "/projects",
        image: data.image ?? "",
        secondaryImage: data.secondary_image ?? undefined,
        sortOrder: data.sort_order,
        updatedAt: data.updated_at,
      },
    };
  } catch (err) {
    console.error("[Update Project Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while updating the project.",
    };
  }
}

/**
 * Server Action: Delete a project from Supabase by its primary key.
 */
export async function deleteProjectAction(id: string): Promise<ActionResponse<void>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may delete projects.",
      };
    }

    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid project identifier provided.",
      };
    }

    const supabase = await createClient();

    // 2. Verify existence before deletion
    const { data: existing, error: checkError } = await supabase
      .from("projects")
      .select("id, title")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("[Delete Project Action] Check error:", checkError);
      return {
        success: false,
        error: "Error verifying project existence before deletion.",
      };
    }

    if (!existing) {
      return {
        success: false,
        error: "Project not found or already deleted.",
      };
    }

    // 3. Execute Deletion
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Delete Project Action] Delete error:", deleteError);
      return {
        success: false,
        error: "Failed to delete project due to a database constraint or error.",
      };
    }

    // 4. Revalidate Cache
    revalidateProjectPaths();

    return {
      success: true,
    };
  } catch (err) {
    console.error("[Delete Project Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the project.",
    };
  }
}

/**
 * Server Action: Quick-toggle publication visibility for a project.
 */
export async function toggleProjectPublishedAction(
  id: string,
  published: boolean
): Promise<ActionResponse<boolean>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({ published })
      .eq("id", id);

    if (error) {
      console.error("[Toggle Project Published] Database error:", error);
      return {
        success: false,
        error: "Could not update publication status.",
      };
    }

    revalidateProjectPaths();

    return {
      success: true,
      data: published,
    };
  } catch (err) {
    console.error("[Toggle Project Published] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

/**
 * Server Action: Quick-toggle featured highlight for a project.
 */
export async function toggleProjectFeaturedAction(
  id: string,
  featured: boolean
): Promise<ActionResponse<boolean>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("projects")
      .update({ featured })
      .eq("id", id);

    if (error) {
      console.error("[Toggle Project Featured] Database error:", error);
      return {
        success: false,
        error: "Could not update featured status.",
      };
    }

    revalidateProjectPaths();

    return {
      success: true,
      data: featured,
    };
  } catch (err) {
    console.error("[Toggle Project Featured] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

