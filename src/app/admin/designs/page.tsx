import React from "react";
import { DesignList } from "@/components/admin/designs/DesignList";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { getAllDesignsAdmin } from "@/lib/data/designs";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Designs Management — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminDesignsPage() {
  const isConfigured = isSupabaseConfigured();
  const designs = await getAllDesignsAdmin();

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
          Designs Management
        </h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Manage portfolio design works, cover images, categories and publication status.
        </p>
      </div>

      <DesignList initialDesigns={designs} />
    </div>
  );
}
