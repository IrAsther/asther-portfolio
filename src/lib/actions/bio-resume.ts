"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import type {
  AdminContentData,
} from "@/types/admin";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit for PDF resumes

/**
 * Validates PDF magic bytes (%PDF- = 0x25 0x50 0x44 0x46 0x2D).
 */
function isValidPdfMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

/**
 * Server Action: Save all bio, skills, education, and journey content to Supabase.
 */
export async function saveAllBioResumeAction(
  data: AdminContentData
): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated || !authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may modify bio & resume content.",
      };
    }

    const supabase = await createClient();

    // ── 1. Save Bio / Profile ──────────────────────────────────────────
    if (data.profile) {
      const p = data.profile;
      if (!p.name?.trim()) {
        return { success: false, error: "Profile name is required." };
      }
      if (!p.role?.trim()) {
        return { success: false, error: "Profile primary role is required." };
      }

      const cleanProfile = {
        name: p.name.trim(),
        role: p.role.trim(),
        subtitles: Array.isArray(p.subtitles)
          ? p.subtitles.map((s) => s.trim()).filter(Boolean)
          : [],
        positioning: (p.positioning || "").trim(),
        summary: (p.summary || "").trim(),
        github: (p.github || "").trim(),
        educationAffiliation: (p.educationAffiliation || "").trim(),
      };

      const { error: profileErr } = await supabase.from("page_content").upsert(
        {
          page_slug: "about",
          section_key: "profile",
          content: cleanProfile,
          published: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_slug,section_key" }
      );

      if (profileErr) {
        console.error("[saveAllBioResumeAction] Profile error:", profileErr);
        return { success: false, error: `Failed to save profile: ${profileErr.message}` };
      }
    }

    // ── 2. Save Skill Categories & Skills ──────────────────────────────
    if (Array.isArray(data.skills)) {
      // Fetch existing categories to safely reconcile
      const { data: existingCats } = await supabase
        .from("skill_categories")
        .select("id, slug");

      const incomingCatIds = new Set<string>();

      for (let cIdx = 0; cIdx < data.skills.length; cIdx++) {
        const cat = data.skills[cIdx];
        const catName = cat.name.trim();
        if (!catName) continue;

        const catSlug = slugify(catName);
        let categoryId = cat.id;
        const isExistingUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            categoryId
          );

        if (isExistingUUID) {
          // Update existing category
          const { error: catErr } = await supabase
            .from("skill_categories")
            .update({
              name: catName,
              sort_order: cIdx + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", categoryId);

          if (catErr) {
            console.error("[saveAllBioResumeAction] Category update err:", catErr);
          }
          incomingCatIds.add(categoryId);
        } else {
          // Insert new category
          const uniqueSlug = `${catSlug}-${Date.now().toString(36)}`;
          const { data: insertedCat, error: insertErr } = await supabase
            .from("skill_categories")
            .insert({
              name: catName,
              slug: uniqueSlug,
              sort_order: cIdx + 1,
            })
            .select("id")
            .single();

          if (insertErr || !insertedCat) {
            console.error("[saveAllBioResumeAction] Category insert err:", insertErr);
            continue;
          }
          categoryId = insertedCat.id;
          incomingCatIds.add(categoryId);
        }

        // Delete existing skills for this category and re-insert fresh list to preserve exact ordering
        await supabase.from("skills").delete().eq("category_id", categoryId);

        const cleanSkills = Array.isArray(cat.skills)
          ? cat.skills.map((s) => s.trim()).filter(Boolean)
          : [];

        if (cleanSkills.length > 0) {
          const skillsToInsert = cleanSkills.map((sName, sIdx) => ({
            category_id: categoryId,
            name: sName,
            sort_order: sIdx + 1,
          }));

          const { error: skillsErr } = await supabase
            .from("skills")
            .insert(skillsToInsert);

          if (skillsErr) {
            console.error("[saveAllBioResumeAction] Skills insert err:", skillsErr);
          }
        }
      }

      // Delete categories that were removed by the admin
      if (existingCats && existingCats.length > 0) {
        const toDelete = existingCats
          .filter((c) => !incomingCatIds.has(c.id))
          .map((c) => c.id);

        if (toDelete.length > 0) {
          await supabase.from("skill_categories").delete().in("id", toDelete);
        }
      }
    }

    // ── 3. Save Education ──────────────────────────────────────────────
    if (Array.isArray(data.education)) {
      const { data: existingEdu } = await supabase
        .from("education")
        .select("id");

      const incomingEduIds = new Set<string>();

      for (let eIdx = 0; eIdx < data.education.length; eIdx++) {
        const item = data.education[eIdx];
        const inst = item.institution.trim();
        const field = item.field.trim();
        if (!inst && !field) continue;

        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            item.id
          );

        if (isUUID) {
          await supabase
            .from("education")
            .update({
              institution: inst || "Institution",
              field: field || "Field of Study",
              status: item.status.trim() || "Active",
              note: (item.note || "").trim() || null,
              current: Boolean(item.current),
              sort_order: eIdx + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
          incomingEduIds.add(item.id);
        } else {
          const { data: insertedEdu } = await supabase
            .from("education")
            .insert({
              institution: inst || "Institution",
              field: field || "Field of Study",
              status: item.status.trim() || "Active",
              note: (item.note || "").trim() || null,
              current: Boolean(item.current),
              sort_order: eIdx + 1,
            })
            .select("id")
            .single();

          if (insertedEdu) incomingEduIds.add(insertedEdu.id);
        }
      }

      if (existingEdu && existingEdu.length > 0) {
        const toDeleteEdu = existingEdu
          .filter((e) => !incomingEduIds.has(e.id))
          .map((e) => e.id);

        if (toDeleteEdu.length > 0) {
          await supabase.from("education").delete().in("id", toDeleteEdu);
        }
      }
    }

    // ── 4. Save Journey ────────────────────────────────────────────────
    if (Array.isArray(data.journey)) {
      const { data: existingJourney } = await supabase
        .from("journey_milestones")
        .select("id");

      const incomingJourneyIds = new Set<string>();

      for (let jIdx = 0; jIdx < data.journey.length; jIdx++) {
        const item = data.journey[jIdx];
        const label = item.label.trim();
        const inst = item.institution.trim();
        if (!label && !inst) continue;

        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            item.id
          );

        const jSlug = slugify(`${label}-${inst}-${jIdx + 1}`);

        if (isUUID) {
          await supabase
            .from("journey_milestones")
            .update({
              label: label || "Milestone",
              institution: inst || "Institution",
              description: item.description.trim(),
              sort_order: jIdx + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
          incomingJourneyIds.add(item.id);
        } else {
          const { data: insertedJ } = await supabase
            .from("journey_milestones")
            .insert({
              slug: `${jSlug}-${Date.now().toString(36)}`,
              label: label || "Milestone",
              institution: inst || "Institution",
              description: item.description.trim(),
              sort_order: jIdx + 1,
            })
            .select("id")
            .single();

          if (insertedJ) incomingJourneyIds.add(insertedJ.id);
        }
      }

      if (existingJourney && existingJourney.length > 0) {
        const toDeleteJ = existingJourney
          .filter((j) => !incomingJourneyIds.has(j.id))
          .map((j) => j.id);

        if (toDeleteJ.length > 0) {
          await supabase.from("journey_milestones").delete().in("id", toDeleteJ);
        }
      }
    }

    // Revalidate public & admin pages
    revalidatePath("/about");
    revalidatePath("/resume");
    revalidatePath("/admin/content");

    return { success: true };
  } catch (err) {
    console.error("[saveAllBioResumeAction] Uncaught exception:", err);
    return {
      success: false,
      error: `An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Server Action: Upload, validate, and persist a formal PDF resume document.
 */
export async function uploadResumeAction(
  formData: FormData
): Promise<ActionResponse<{ url: string; filename: string; sizeBytes: number; storagePath: string }>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated || !authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Only authorized administrators may upload resumes.",
      };
    }

    const file = formData.get("file");
    if (!file || typeof file === "string" || typeof (file as Blob).arrayBuffer !== "function") {
      return { success: false, error: "No valid PDF resume file was selected." };
    }

    const uploadedFile = file as File;
    const originalName = (uploadedFile.name || "").trim() || "Asther_Irakaza_CV.pdf";

    // 1. Strict extension check: file must end with .pdf (case-insensitive)
    if (!originalName.toLowerCase().endsWith(".pdf")) {
      return {
        success: false,
        error: "Invalid document format. Only PDF (.pdf) documents are accepted.",
      };
    }

    // 2. Strict size check (must be non-empty and <= 10 MB)
    if (uploadedFile.size <= 0) {
      return {
        success: false,
        error: "Uploaded file is empty. Please select a valid PDF document.",
      };
    }

    if (uploadedFile.size > MAX_RESUME_SIZE_BYTES) {
      const sizeMb = (uploadedFile.size / (1024 * 1024)).toFixed(1);
      return {
        success: false,
        error: `Resume document exceeds 10 MB limit (current: ${sizeMb} MB). Please choose a smaller file.`,
      };
    }

    // 3. Server-side PDF magic-byte validation (%PDF- = 0x25 0x50 0x44 0x46 0x2D)
    // Never trust browser-supplied Content-Type alone.
    const arrayBuffer = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!isValidPdfMagicBytes(buffer)) {
      return {
        success: false,
        error: "Invalid file content. The uploaded document does not match a valid PDF file signature (%PDF-).",
      };
    }

    const supabase = await createClient();

    // 4. Safe Replacement Order (Requirement 4):
    // Inspect current resume document metadata to obtain previous storage path,
    // but DO NOT delete previous file yet.
    const { data: existingDoc } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "resume_document")
      .maybeSingle();

    const previousStoragePath =
      existingDoc?.value && typeof existingDoc.value === "object"
        ? (existingDoc.value as { storagePath?: string }).storagePath || null
        : null;

    // 5. Sanitize filename: letters, digits, underscores, hyphens, and ensure .pdf ending
    const baseName = originalName.slice(0, -4);
    const sanitizedBase = baseName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "") || "asther_irakaza_cv";
    const storagePath = `resumes/${Date.now()}-${sanitizedBase}.pdf`;

    // 6. Upload new PDF file to Supabase Storage FIRST (explicitly application/pdf)
    const { error: uploadError } = await supabase.storage
      .from("portfolio-media")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("[uploadResumeAction] Storage upload error:", uploadError);
      return {
        success: false,
        error: `Failed to upload resume to storage: ${uploadError.message}`,
      };
    }

    // 7. Resolve public URL for the newly stored document
    const { data: urlData } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(storagePath);
    const publicUrl = urlData.publicUrl;

    // 8. Update database metadata ONLY AFTER successful storage upload
    const resumeMetadata = {
      url: publicUrl,
      storagePath,
      filename: originalName,
      sizeBytes: uploadedFile.size,
      uploadedAt: new Date().toISOString(),
      published: true,
    };

    const { error: settingsErr } = await supabase.from("site_settings").upsert(
      {
        key: "resume_document",
        value: resumeMetadata,
        updated_at: new Date().toISOString(),
        updated_by: authStatus.user?.id || null,
      },
      { onConflict: "key" }
    );

    if (settingsErr) {
      console.error("[uploadResumeAction] Settings update error:", settingsErr);
      // Rollback: delete the newly uploaded file to avoid orphaned storage objects
      try {
        await supabase.storage.from("portfolio-media").remove([storagePath]);
      } catch (rollbackErr) {
        console.warn("[uploadResumeAction] Rollback delete failed:", rollbackErr);
      }
      return {
        success: false,
        error: `Failed to update resume metadata: ${settingsErr.message}`,
      };
    }

    // 9. Record in media_assets catalog (non-blocking for public resume availability)
    try {
      await supabase.from("media_assets").insert({
        filename: originalName,
        url: publicUrl,
        size_bytes: uploadedFile.size,
        mime_type: "application/pdf",
        category: "resume",
        alt_text: "Asther Irakaza Resume CV Document",
        created_by: authStatus.user?.id || null,
      });
    } catch (mediaErr) {
      console.warn("[uploadResumeAction] Non-critical media_assets record error:", mediaErr);
    }

    // 10. ONLY AFTER new upload and database update succeed: safely clean up previous resume file
    if (previousStoragePath && previousStoragePath !== storagePath) {
      try {
        await supabase.storage.from("portfolio-media").remove([previousStoragePath]);
      } catch (cleanupErr) {
        console.warn("[uploadResumeAction] Non-critical cleanup error for previous resume:", cleanupErr);
      }
    }

    revalidatePath("/resume");
    revalidatePath("/about");
    revalidatePath("/admin/content");

    return {
      success: true,
      data: {
        url: publicUrl,
        filename: originalName,
        sizeBytes: uploadedFile.size,
        storagePath,
      },
    };
  } catch (err) {
    console.error("[uploadResumeAction] Uncaught exception:", err);
    return {
      success: false,
      error: `Resume upload failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Server Action: Toggle published status of the active resume document.
 */
export async function toggleResumePublishAction(
  published: boolean
): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated || !authStatus.isAuthorizedAdmin) {
      return { success: false, error: "Access denied." };
    }

    const supabase = await createClient();
    const { data: current } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "resume_document")
      .maybeSingle();

    if (!current || !current.value) {
      return { success: false, error: "No resume document has been uploaded yet." };
    }

    const updated = {
      ...(current.value as Record<string, unknown>),
      published: Boolean(published),
      updatedAt: new Date().toISOString(),
    };

    await supabase.from("site_settings").upsert(
      {
        key: "resume_document",
        value: updated,
        updated_at: new Date().toISOString(),
        updated_by: authStatus.user?.id || null,
      },
      { onConflict: "key" }
    );

    revalidatePath("/resume");
    revalidatePath("/about");
    revalidatePath("/admin/content");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `Failed to toggle publish status: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Server Action: Delete the active resume document from storage and catalog.
 */
export async function deleteResumeAction(): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthenticated || !authStatus.isAuthorizedAdmin) {
      return { success: false, error: "Access denied." };
    }

    const supabase = await createClient();
    const { data: current } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "resume_document")
      .maybeSingle();

    if (current && current.value && (current.value as { storagePath?: string }).storagePath) {
      const storagePath = (current.value as { storagePath: string }).storagePath;
      try {
        await supabase.storage.from("portfolio-media").remove([storagePath]);
      } catch (storageErr) {
        console.warn("[deleteResumeAction] Non-critical storage remove warning:", storageErr);
      }
    }

    await supabase.from("media_assets").delete().eq("category", "resume");
    await supabase.from("site_settings").delete().eq("key", "resume_document");

    revalidatePath("/resume");
    revalidatePath("/about");
    revalidatePath("/admin/content");

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `Failed to delete resume: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
