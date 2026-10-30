"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import type { AdminDesign, DesignGalleryItem } from "@/types/admin";

export interface DesignInput {
  title: string;
  slug: string;
  category: string;
  description?: string;
  tools?: string[];
  coverImage?: string;
  gallery?: DesignGalleryItem[];
  externalUrl?: string;
  projectDate?: string;
  published?: boolean;
  featured?: boolean;
  sortOrder?: number;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates design input data on the server.
 */
function validateDesignInput(input: Partial<DesignInput>): {
  valid: boolean;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};

  const title = input.title?.trim() || "";
  if (!title) {
    fieldErrors.title = "Design title is required.";
  } else if (title.length < 2) {
    fieldErrors.title = "Design title must be at least 2 characters.";
  } else if (title.length > 200) {
    fieldErrors.title = "Design title cannot exceed 200 characters.";
  }

  const slug = input.slug?.trim().toLowerCase() || "";
  if (!slug) {
    fieldErrors.slug = "URL slug is required.";
  } else if (!SLUG_REGEX.test(slug)) {
    fieldErrors.slug =
      "Slug must contain only lowercase alphanumeric characters and hyphens (e.g. 'my-cool-design').";
  } else if (slug.length > 100) {
    fieldErrors.slug = "Slug cannot exceed 100 characters.";
  }

  const category = input.category?.trim() || "";
  if (!category) {
    fieldErrors.category = "Category is required.";
  } else if (category.length > 100) {
    fieldErrors.category = "Category cannot exceed 100 characters.";
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

/**
 * Revalidates all relevant cached paths when design data changes.
 */
function revalidateDesignPaths(slug?: string) {
  revalidatePath("/admin/designs");
  revalidatePath("/admin");
  revalidatePath("/design");
  if (slug) {
    revalidatePath(`/design/${slug}`);
  }
}

/**
 * Helper to map a Supabase row to an AdminDesign object.
 */
function rowToAdminDesign(data: Record<string, unknown>): AdminDesign {
  return {
    id: data.id as string,
    slug: data.slug as string,
    title: data.title as string,
    category: data.category as string,
    description: (data.description as string) ?? "",
    tools: (data.tools as string[]) ?? [],
    coverImage: (data.cover_image as string | null) ?? null,
    gallery: parseGalleryRow(data.gallery),
    externalUrl: (data.external_url as string | null) ?? null,
    projectDate: (data.project_date as string | null) ?? null,
    published: data.published as boolean,
    featured: data.featured as boolean,
    sortOrder: data.sort_order as number,
    createdAt: data.created_at as string,
    updatedAt: data.updated_at as string,
  };
}

function parseGalleryRow(raw: unknown): DesignGalleryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is DesignGalleryItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Record<string, unknown>).url === "string"
  );
}

/**
 * Server Action: Create a new design in Supabase.
 */
export async function createDesignAction(
  input: DesignInput
): Promise<ActionResponse<AdminDesign>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may create designs.",
      };
    }

    // 2. Server-Side Validation
    const validation = validateDesignInput(input);
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
      description: input.description?.trim() || null,
      tools: Array.isArray(input.tools) ? input.tools.filter(Boolean) : [],
      cover_image: input.coverImage?.trim() || null,
      gallery: Array.isArray(input.gallery) ? input.gallery : [],
      external_url: input.externalUrl?.trim() || null,
      project_date: input.projectDate?.trim() || null,
      published: Boolean(input.published),
      featured: Boolean(input.featured),
      sort_order:
        typeof input.sortOrder === "number" && !isNaN(input.sortOrder)
          ? Math.max(0, Math.floor(input.sortOrder))
          : 0,
    };

    // 4. Insert into Supabase
    const { data, error } = await supabase
      .from("designs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      // Postgres error code 23505: unique_violation
      if (error.code === "23505" || error.message.includes("unique")) {
        return {
          success: false,
          error: `A design with the slug "${payload.slug}" already exists. Please choose a unique slug.`,
          fieldErrors: {
            slug: "This slug is already in use by another design.",
          },
        };
      }

      console.error("[Create Design Action] Database error:", error);
      return {
        success: false,
        error: "Database error occurred while saving the design.",
      };
    }

    // 5. Revalidate Cache
    revalidateDesignPaths();

    return {
      success: true,
      data: rowToAdminDesign(data as Record<string, unknown>),
    };
  } catch (err) {
    console.error("[Create Design Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while creating the design.",
    };
  }
}

/**
 * Server Action: Update an existing design in Supabase.
 */
export async function updateDesignAction(
  id: string,
  input: DesignInput
): Promise<ActionResponse<AdminDesign>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may update designs.",
      };
    }

    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid design ID provided.",
      };
    }

    // 2. Server-Side Validation
    const validation = validateDesignInput(input);
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
      description: input.description?.trim() || null,
      tools: Array.isArray(input.tools) ? input.tools.filter(Boolean) : [],
      cover_image: input.coverImage?.trim() || null,
      gallery: Array.isArray(input.gallery) ? input.gallery : [],
      external_url: input.externalUrl?.trim() || null,
      project_date: input.projectDate?.trim() || null,
      published: Boolean(input.published),
      featured: Boolean(input.featured),
      sort_order:
        typeof input.sortOrder === "number" && !isNaN(input.sortOrder)
          ? Math.max(0, Math.floor(input.sortOrder))
          : 0,
    };

    // 4. Update in Supabase
    const { data, error } = await supabase
      .from("designs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505" || error.message.includes("unique")) {
        return {
          success: false,
          error: `A design with the slug "${payload.slug}" already exists. Please choose a unique slug.`,
          fieldErrors: {
            slug: "This slug is already in use by another design.",
          },
        };
      }

      console.error("[Update Design Action] Database error:", error);
      return {
        success: false,
        error: "Database error occurred while updating the design.",
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Design record not found or could not be updated.",
      };
    }

    // 5. Revalidate Cache
    revalidateDesignPaths();

    return {
      success: true,
      data: rowToAdminDesign(data as Record<string, unknown>),
    };
  } catch (err) {
    console.error("[Update Design Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while updating the design.",
    };
  }
}

/**
 * Server Action: Delete a design from Supabase by its primary key.
 */
export async function deleteDesignAction(id: string): Promise<ActionResponse<void>> {
  try {
    // 1. Strict Server-Side Authorization
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may delete designs.",
      };
    }

    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "Invalid design identifier provided.",
      };
    }

    const supabase = await createClient();

    // 2. Verify existence before deletion
    const { data: existing, error: checkError } = await supabase
      .from("designs")
      .select("id, title")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("[Delete Design Action] Check error:", checkError);
      return {
        success: false,
        error: "Error verifying design existence before deletion.",
      };
    }

    if (!existing) {
      return {
        success: false,
        error: "Design not found or already deleted.",
      };
    }

    // 3. Execute Deletion
    const { error: deleteError } = await supabase
      .from("designs")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Delete Design Action] Delete error:", deleteError);
      return {
        success: false,
        error: "Failed to delete design due to a database constraint or error.",
      };
    }

    // 4. Revalidate Cache
    revalidateDesignPaths();

    return {
      success: true,
    };
  } catch (err) {
    console.error("[Delete Design Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the design.",
    };
  }
}

/**
 * Server Action: Quick-toggle publication visibility for a design.
 */
export async function toggleDesignPublishedAction(
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

    if (!id || typeof id !== "string" || !id.trim()) {
      return {
        success: false,
        error: "Invalid design identifier provided.",
      };
    }

    const publishedVal = Boolean(published);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .update({ published: publishedVal })
      .eq("id", id.trim())
      .select("id, slug, published")
      .maybeSingle();

    if (error) {
      console.error("[Toggle Design Published] Database error:", error);
      return {
        success: false,
        error: `Could not update publication status: ${error.message}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Design record not found or permission denied.",
      };
    }

    revalidateDesignPaths(data.slug);

    return {
      success: true,
      data: data.published,
    };
  } catch (err) {
    console.error("[Toggle Design Published] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while toggling publication status.",
    };
  }
}

/**
 * Server Action: Quick-toggle featured highlight for a design.
 */
export async function toggleDesignFeaturedAction(
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

    if (!id || typeof id !== "string" || !id.trim()) {
      return {
        success: false,
        error: "Invalid design identifier provided.",
      };
    }

    const featuredVal = Boolean(featured);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("designs")
      .update({ featured: featuredVal })
      .eq("id", id.trim())
      .select("id, slug, featured")
      .maybeSingle();

    if (error) {
      console.error("[Toggle Design Featured] Database error:", error);
      return {
        success: false,
        error: `Could not update featured status: ${error.message}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Design record not found or permission denied.",
      };
    }

    revalidateDesignPaths(data.slug);

    return {
      success: true,
      data: data.featured,
    };
  } catch (err) {
    console.error("[Toggle Design Featured] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while toggling featured status.",
    };
  }
}

/**
 * Server Action: Update sort order priority for a design.
 */
export async function updateDesignSortOrderAction(
  id: string,
  sortOrder: number
): Promise<ActionResponse<number>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!id || typeof id !== "string" || !id.trim()) {
      return {
        success: false,
        error: "Invalid design identifier provided.",
      };
    }

    const safeOrder = typeof sortOrder === "number" && !isNaN(sortOrder) ? Math.max(0, Math.floor(sortOrder)) : 0;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("designs")
      .update({ sort_order: safeOrder })
      .eq("id", id.trim())
      .select("id, slug, sort_order")
      .maybeSingle();

    if (error) {
      console.error("[Update Design Sort Order] Database error:", error);
      return {
        success: false,
        error: `Could not update sort order: ${error.message}`,
      };
    }

    if (!data) {
      return {
        success: false,
        error: "Design record not found.",
      };
    }

    revalidateDesignPaths(data.slug);

    return {
      success: true,
      data: data.sort_order,
    };
  } catch (err) {
    console.error("[Update Design Sort Order] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred while updating sort order.",
    };
  }
}
