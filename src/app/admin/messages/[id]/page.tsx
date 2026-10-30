import React from "react";
import Link from "next/link";
import { MessageDetail } from "@/components/admin/messages/MessageDetail";
import { getMessageByIdAdmin } from "@/lib/data/messages";

export const dynamic = "force-dynamic";

interface MessageDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MessageDetailPageProps) {
  const { id } = await params;
  const message = await getMessageByIdAdmin(id);
  return {
    title: message ? `Message from ${message.senderName} — Admin` : "Message Not Found — Admin",
  };
}

export default async function AdminMessageDetailPage({ params }: MessageDetailPageProps) {
  const { id } = await params;
  const message = await getMessageByIdAdmin(id);

  if (!message) {
    return (
      <div
        style={{
          padding: "var(--space-12) var(--space-6)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-family-display)",
            fontSize: "1.5rem",
            fontWeight: 400,
            color: "var(--color-text)",
            margin: 0,
          }}
        >
          Message not found
        </h2>
        <p style={{ margin: 0, color: "var(--color-text-subtle)", fontSize: "0.875rem" }}>
          The message with ID <code>{id}</code> does not exist or has been deleted.
        </p>
        <Link
          href="/admin/messages"
          style={{
            color: "#FF862D",
            fontSize: "0.875rem",
            textDecoration: "underline",
          }}
        >
          Return to messages inbox
        </Link>
      </div>
    );
  }

  return <MessageDetail message={message} />;
}

