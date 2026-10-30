import React from "react";
import { MessageList } from "@/components/admin/messages/MessageList";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { getAllMessagesAdmin } from "@/lib/data/messages";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Messages Management — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const isConfigured = isSupabaseConfigured();
  const messages = isConfigured ? await getAllMessagesAdmin() : [];

  return (
    <div>
      {!isConfigured && <AdminNotice />}
      <div style={{ marginBottom: "var(--space-6)" }}>
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            color: "var(--color-text)",
            margin: "0 0 4px 0",
            fontWeight: 400,
          }}
        >
          Contact Messages
        </h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Direct inquiries submitted by visitors from the public portfolio contact form.
        </p>
      </div>

      <MessageList initialMessages={messages} />
    </div>
  );
}

