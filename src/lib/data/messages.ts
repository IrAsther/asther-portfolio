/**
 * Data Access Layer — Contact Messages
 *
 * Server-only module.
 * Queries Supabase when configured. Messages are admin-only; no public fallback
 * data is used — an empty array is returned when Supabase is not configured.
 */

import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { AdminContactMessage } from "@/types/admin";

// ---------------------------------------------------------------------------
// Row → DTO mapper
// ---------------------------------------------------------------------------

function rowToAdminContactMessage(row: {
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
// Admin queries
// ---------------------------------------------------------------------------

/**
 * Admin query: Fetch all contact messages ordered newest-first.
 * Returns an empty array if Supabase is not configured (no static fallback —
 * contact messages are always sensitive / admin-only data).
 */
export async function getAllMessagesAdmin(): Promise<AdminContactMessage[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[DAL Messages Admin] Error fetching messages:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(rowToAdminContactMessage);
  } catch (err) {
    console.error("[DAL Messages Admin] Unexpected error in getAllMessagesAdmin:", err);
    return [];
  }
}

/**
 * Admin query: Fetch a single contact message by its UUID primary key.
 * Returns null if not found or Supabase is not configured.
 */
export async function getMessageByIdAdmin(id: string): Promise<AdminContactMessage | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[DAL Messages Admin] Error fetching message by ID:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return rowToAdminContactMessage(data);
  } catch (err) {
    console.error("[DAL Messages Admin] Unexpected error in getMessageByIdAdmin:", err);
    return null;
  }
}

/**
 * Admin query: Count of unread, non-archived messages.
 * Used for the dashboard badge / notification indicator.
 * Returns 0 if Supabase is not configured.
 */
export async function getUnreadCountAdmin(): Promise<number> {
  if (!isSupabaseConfigured()) {
    return 0;
  }

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .neq("status", "archived");

    if (error) {
      console.error("[DAL Messages Admin] Error fetching unread count:", error);
      return 0;
    }

    return count ?? 0;
  } catch (err) {
    console.error("[DAL Messages Admin] Unexpected error in getUnreadCountAdmin:", err);
    return 0;
  }
}
