"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import type { AdminApp, AppStatusType } from "@/types/admin";

export interface AppInput {
  name: string;
  slug: string;
  category: string;
  description: string;
  problem?: string;
  direction?: string;
  technologies?: string[];
  status: string;
  statusType: AppStatusType;
  published?: boolean;
  featured?: boolean;
  highlights?: string[];
  image?: string;
  secondaryImage?: string;
  demoUrl?: string;
  downloadUrl?: string;
  githubUrl?: string;
  sortOrder?: number;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const VALID_APP_STATUS_TYPES: AppStatusType[] = [
  "showcase",
  "in-development",
  "prototype",
  "architecture",
  "concept",
];

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates application input data on the server.
 */
function validateAppInput(input: Partial<AppInput>): {
  valid: boolean;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const name = input.name?.trim() || "";
  if (!name) {
    fieldErrors.name = "Application name is required.";
  } else if (name.length < 2) {
    fieldErrors.name = "Application name must be at least 2 characters.";
  } else if (name.length > 200) {
    fieldErrors.name = "Application name cannot exceed 200 characters.";
  }

  const slug = input.slug?.trim().toLowerCase() || "";
  if (!slug) {
    fieldErrors.slug = "URL slug is required.";
  } else if (!SLUG_REGEX.test(slug)) {
    fieldErrors.slug =
      "Slug must contain only lowercase alphanumeric characters and hyphens (e.g. 'my-app-name').";
  } else if (slug.length > 100) {
    fieldErrors.slug = "Slug cannot exceed 100 characters.";
  }

  const category = input.category?.trim() || "";
  if (!category) {
    fieldErrors.category = "Category is required.";
  } else if (category.length > 100) {
    fieldErrors.category = "Category cannot exceed 100 characters.";
  }

  const description = input.description?.trim() || "";
  if (!description) {
    fieldErrors.description = "Application description is required.";
  } else if (description.length < 10) {
    fieldErrors.description = "Description must be at least 10 characters.";
  }

  const status = input.status?.trim() || "";
  if (!status) {
    fieldErrors.status = "Status label is required.";
  }

  if (!input.statusType || !VALID_APP_STATUS_TYPES.includes(input.statusType)) {
    fieldErrors.statusType = `Status type must be one of: ${VALID_APP_STATUS_TYPES.join(", ")}.`;
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

/**
 * Revalidates all relevant cached paths when application data changes.
 */
function revalidateAppPaths() {
  revalidatePath("/admin/apps");
  revalidatePath("/admin");
  revalidatePath("/apps");
  revalidatePath("/");
}

/**
 * Server Action: Create a new application in Supabase.
 */
export async function createAppAction(
  input: AppInput
): Promise<ActionResponse<AdminApp>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may create applications.",
      };
    }

    // 2. Server-Side Validation
    const validation = validateAppInput(input);
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
      name: input.name.trim(),
      category: input.category.trim(),
      description: input.description.trim(),
      problem: input.problem?.trim() || null,
      direction: input.direction?.trim() || null,
      technologies: Array.isArray(input.technologies)
        ? input.technologies.filter(Boolean)
        : [],
      status: input.status.trim(),
      status_type: input.statusType,
      published: Boolean(input.published),
      featured: Boolean(input.featured),
      highlights: Array.isArray(input.highlights)
        ? input.highlights.filter(Boolean)
        : [],
      image: input.image?.trim() || null,
      secondary_image: input.secondaryImage?.trim() || null,
      demo_url: input.demoUrl?.trim() || null,
      download_url: input.downloadUrl?.trim() || null,
      github_url: input.githubUrl?.trim() || null,
      sort_order:
        typeof input.sortOrder === "number" && !isNaN(input.sortOrder)
          ? Math.max(0, Math.floor(input.sortOrder))
          : 0,
    };

    // 4. Insert into Supabase
    const { data, error } = await supabase
      .from("applications")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === "23505" || error.message.includes("unique")) {
        return {
          success: false,
          error: `An application with the slug "${payload.slug}" already exists. Please choose a unique slug.`,
          fieldErrors: {
            slug: "This slug is already in use by another application.",
          },
        };
      }

      console.error("[Create App Action] Database error:", error);
      return {
        success: false,
        error: "Database error occurred while saving the application.",
      };
    }

    // 5. Revalidate Cache
    revalidateAppPaths();

    return {
      success: true,
      data: {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        description: data.description,
        problem: data.problem ?? "",
        direction: data.direction ?? "",
        technologies: data.technologies ?? [],
        status: data.status,
        statusType: data.status_type as AppStatusType,
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
      },
    };
  } catch (err) {
    console.error("[Create App Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while creating the application.",
    };
  }
}

/**
 * Server Action: Update an existing application in Supabase.
 */
export async function updateAppAction(
  id: string,
  input: AppInput
): Promise<ActionResponse<AdminApp>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may update applications.",
      };
    }

    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid application ID provided.",
      };
    }

    // 2. Server-Side Validation
    const validation = validateAppInput(input);
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
      name: input.name.trim(),
      category: input.category.trim(),
      description: input.description.trim(),
      problem: input.problem?.trim() || null,
      direction: input.direction?.trim() || null,
      technologies: Array.isArray(input.technologies)
        ? input.technologies.filter(Boolean)
        : [],
      status: input.status.trim(),
      status_type: input.statusType,
      published: Boolean(input.published),
      featured: Boolean(input.featured),
      highlights: Array.isArray(input.highlights)
        ? input.highlights.filter(Boolean)
        : [],
      image: input.image?.trim() || null,
      secondary_image: input.secondaryImage?.trim() || null,
      demo_url: input.demoUrl?.trim() || null,
      download_url: input.downloadUrl?.trim() || null,
      github_url: input.githubUrl?.trim() || null,
      sort_order:
        typeof input.sortOrder === "number" && !isNaN(input.sortOrder)
          ? Math.max(0, Math.floor(input.sortOrder))
          : 0,
    };

    // 4. Update in Supabase
    const { data, error } = await supabase
      .from("applications")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505" || error.message.includes("unique")) {
        return {
          success: false,
          error: `An application with the slug "${payload.slug}" already exists. Please choose a unique slug.`,
          fieldErrors: {
            slug: "This slug is already in use by another application.",
          },
        };
      }

      console.error("[Update App Action] Database error:", error);
      return {
        success: false,
        error: "Database error occurred while updating the application.",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Application record not found or could not be updated.",
      };
    }

    // 5. Revalidate Cache
    revalidateAppPaths();

    return {
      success: true,
      data: {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category,
        description: data.description,
        problem: data.problem ?? "",
        direction: data.direction ?? "",
        technologies: data.technologies ?? [],
        status: data.status,
        statusType: data.status_type as AppStatusType,
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
      },
    };
  } catch (err) {
    console.error("[Update App Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while updating the application.",
    };
  }
}

/**
 * Server Action: Delete an application from Supabase by its primary key.
 */
export async function deleteAppAction(id: string): Promise<ActionResponse<void>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may delete applications.",
      };
    }

    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid application identifier provided.",
      };
    }

    const supabase = await createClient();

    // 2. Verify existence before deletion
    const { data: existing, error: checkError } = await supabase
      .from("applications")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("[Delete App Action] Check error:", checkError);
      return {
        success: false,
        error: "Error verifying application existence before deletion.",
      };
    }

    if (!existing) {
      return {
        success: false,
        error: "Application not found or already deleted.",
      };
    }

    // 3. Execute Deletion
    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Delete App Action] Delete error:", deleteError);
      return {
        success: false,
        error: "Failed to delete application due to a database constraint or error.",
      };
    }

    // 4. Revalidate Cache
    revalidateAppPaths();

    return {
      success: true,
    };
  } catch (err) {
    console.error("[Delete App Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the application.",
    };
  }
}

/**
 * Server Action: Quick-toggle publication visibility for an application.
 */
export async function toggleAppPublishedAction(
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
      .from("applications")
      .update({ published })
      .eq("id", id);

    if (error) {
      console.error("[Toggle App Published] Database error:", error);
      return {
        success: false,
        error: "Could not update publication status.",
      };
    }

    revalidateAppPaths();

    return {
      success: true,
      data: published,
    };
  } catch (err) {
    console.error("[Toggle App Published] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

/**
 * Server Action: Quick-toggle featured highlight for an application.
 */
export async function toggleAppFeaturedAction(
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
      .from("applications")
      .update({ featured })
      .eq("id", id);

    if (error) {
      console.error("[Toggle App Featured] Database error:", error);
      return {
        success: false,
        error: "Could not update featured status.",
      };
    }

    revalidateAppPaths();

    return {
      success: true,
      data: featured,
    };
  } catch (err) {
    console.error("[Toggle App Featured] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}

