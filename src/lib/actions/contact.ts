"use server";

import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import type { AdminContactMessage } from "@/types/admin";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Revalidates the admin messages cache after any mutation.
 */
function revalidateMessagePaths() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/**
 * Row → AdminContactMessage DTO mapper (used after insert/update .select()).
 */
function rowToDTO(row: {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  status: string;
  is_read: boolean;
  replied_at: string | null;
  archived_at: string | null;
  created_at: string;
}): AdminContactMessage {
  return {
    id: row.id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    subject: row.subject,
    message: row.message,
    status: row.status as AdminContactMessage["status"],
    isRead: row.is_read,
    repliedAt: row.replied_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
  };
}

// ---------------------------------------------------------------------------
// Public Action — anyone can submit the contact form
// ---------------------------------------------------------------------------

/**
 * Server Action: Submit the public contact form.
 *
 * Does NOT require authentication. Validates and sanitizes all inputs
 * server-side. Silently drops messages that trigger the honeypot field
 * to defeat bots without revealing detection.
 */
export async function submitContactAction(
  formData: FormData
): Promise<ActionResponse<void>> {
  try {
    // -----------------------------------------------------------------------
    // 1. Extract raw values
    // -----------------------------------------------------------------------
    const rawName    = formData.get("sender_name");
    const rawEmail   = formData.get("sender_email");
    const rawSubject = formData.get("subject");
    const rawMessage = formData.get("message");
    const rawHoney   = formData.get("website"); // honeypot

    // -----------------------------------------------------------------------
    // 2. Honeypot check — silently succeed if a bot filled the hidden field
    // -----------------------------------------------------------------------
    const honeypot = typeof rawHoney === "string" ? rawHoney.trim() : "";
    if (honeypot.length > 0) {
      // Return success to fool the bot; do NOT store the submission
      return { success: true };
    }

    // -----------------------------------------------------------------------
    // 3. Type-narrow to strings
    // -----------------------------------------------------------------------
    const senderName  = typeof rawName    === "string" ? rawName.trim()           : "";
    const senderEmail = typeof rawEmail   === "string" ? rawEmail.trim().toLowerCase() : "";
    const subject     = typeof rawSubject === "string" ? rawSubject.trim()        : "";
    const message     = typeof rawMessage === "string" ? rawMessage.trim()        : "";

    // -----------------------------------------------------------------------
    // 4. Server-side validation
    // -----------------------------------------------------------------------
    const fieldErrors: Record<string, string> = {};

    // sender_name: required, 2–200 chars
    if (!senderName) {
      fieldErrors.sender_name = "Your name is required.";
    } else if (senderName.length < 2) {
      fieldErrors.sender_name = "Name must be at least 2 characters.";
    } else if (senderName.length > 200) {
      fieldErrors.sender_name = "Name cannot exceed 200 characters.";
    }

    // sender_email: required, valid format, 5–254 chars
    if (!senderEmail) {
      fieldErrors.sender_email = "Your email address is required.";
    } else if (senderEmail.length < 5) {
      fieldErrors.sender_email = "Please enter a valid email address.";
    } else if (senderEmail.length > 254) {
      fieldErrors.sender_email = "Email address cannot exceed 254 characters.";
    } else if (!EMAIL_REGEX.test(senderEmail)) {
      fieldErrors.sender_email = "Please enter a valid email address.";
    }

    // subject: required, 2–200 chars
    if (!subject) {
      fieldErrors.subject = "A subject is required.";
    } else if (subject.length < 2) {
      fieldErrors.subject = "Subject must be at least 2 characters.";
    } else if (subject.length > 200) {
      fieldErrors.subject = "Subject cannot exceed 200 characters.";
    }

    // message: required, 10–5000 chars
    if (!message) {
      fieldErrors.message = "A message is required.";
    } else if (message.length < 10) {
      fieldErrors.message = "Message must be at least 10 characters.";
    } else if (message.length > 5000) {
      fieldErrors.message = "Message cannot exceed 5,000 characters.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Please correct the highlighted errors and try again.",
        fieldErrors,
      };
    }

    // -----------------------------------------------------------------------
    // 5. Guard: if Supabase is not configured, accept gracefully
    // -----------------------------------------------------------------------
    if (!isSupabaseConfigured()) {
      // In local/demo mode the message cannot be stored, but we don't
      // expose infrastructure details to the public visitor.
      console.warn("[Contact Action] Supabase not configured — message not stored.");
      return { success: true };
    }

    // -----------------------------------------------------------------------
    // 6. Insert into contact_messages
    // -----------------------------------------------------------------------
    const supabase = await createClient();

    const { error } = await supabase.from("contact_messages").insert({
      sender_name:  senderName,
      sender_email: senderEmail,
      subject,
      message,
      status:  "new",
      is_read: false,
      website: null, // always null — honeypot is never persisted
    });

    if (error) {
      console.error("[Contact Action] Database error:", error);
      return {
        success: false,
        error:
          "We encountered a problem sending your message. Please try again or reach out directly via email.",
      };
    }

    // No revalidatePath — public submission does not touch an admin-cached page
    return { success: true };
  } catch (err) {
    console.error("[Contact Action] Unexpected exception:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

// ---------------------------------------------------------------------------
// Admin Actions — all require isAuthorizedAdmin
// ---------------------------------------------------------------------------

/**
 * Server Action: Mark a message as read.
 * Sets is_read=true; advances status from 'new' → 'read' only (preserves
 * 'replied' / 'archived' states that are further along the workflow).
 */
export async function markMessageReadAction(
  id: string
): Promise<ActionResponse<AdminContactMessage>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid message identifier." };
    }

    const supabase = await createClient();

    // Fetch current status so we only advance 'new' → 'read'
    const { data: existing, error: fetchError } = await supabase
      .from("contact_messages")
      .select("id, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existing) {
      return { success: false, error: "Message not found." };
    }

    const newStatus = existing.status === "new" ? "read" : existing.status;

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: true, status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[Mark Read Action] Database error:", error);
      return { success: false, error: "Failed to mark message as read." };
    }

    revalidateMessagePaths();
    return { success: true, data: rowToDTO(data) };
  } catch (err) {
    console.error("[Mark Read Action] Unexpected exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Server Action: Mark a message as replied.
 * Sets status='replied' and replied_at=NOW().
 */
export async function markMessageRepliedAction(
  id: string
): Promise<ActionResponse<AdminContactMessage>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid message identifier." };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .update({
        status:     "replied",
        is_read:    true,
        replied_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[Mark Replied Action] Database error:", error);
      return { success: false, error: "Failed to mark message as replied." };
    }

    revalidateMessagePaths();
    return { success: true, data: rowToDTO(data) };
  } catch (err) {
    console.error("[Mark Replied Action] Unexpected exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Server Action: Archive a message.
 * Sets status='archived' and archived_at=NOW().
 */
export async function archiveMessageAction(
  id: string
): Promise<ActionResponse<AdminContactMessage>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid message identifier." };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .update({
        status:      "archived",
        is_read:     true,
        archived_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[Archive Message Action] Database error:", error);
      return { success: false, error: "Failed to archive message." };
    }

    revalidateMessagePaths();
    return { success: true, data: rowToDTO(data) };
  } catch (err) {
    console.error("[Archive Message Action] Unexpected exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Server Action: Restore an archived message back to 'read'.
 * Clears archived_at and resets status to 'read'.
 */
export async function restoreMessageAction(
  id: string
): Promise<ActionResponse<AdminContactMessage>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid message identifier." };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_messages")
      .update({
        status:      "read",
        archived_at: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error("[Restore Message Action] Database error:", error);
      return { success: false, error: "Failed to restore message." };
    }

    revalidateMessagePaths();
    return { success: true, data: rowToDTO(data) };
  } catch (err) {
    console.error("[Restore Message Action] Unexpected exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

/**
 * Server Action: Permanently delete a contact message.
 * Verifies existence before deletion to surface meaningful errors.
 */
export async function deleteMessageAction(id: string): Promise<ActionResponse<void>> {
  try {
    const authStatus = await getAuthenticatedAdmin();
    if (!authStatus.isAuthorizedAdmin) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid message identifier." };
    }

    const supabase = await createClient();

    // Verify existence before deletion
    const { data: existing, error: checkError } = await supabase
      .from("contact_messages")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (checkError) {
      console.error("[Delete Message Action] Check error:", checkError);
      return {
        success: false,
        error: "Error verifying message existence before deletion.",
      };
    }

    if (!existing) {
      return { success: false, error: "Message not found or already deleted." };
    }

    const { error: deleteError } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[Delete Message Action] Delete error:", deleteError);
      return {
        success: false,
        error: "Failed to delete message due to a database error.",
      };
    }

    revalidateMessagePaths();
    return { success: true };
  } catch (err) {
    console.error("[Delete Message Action] Unexpected exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
