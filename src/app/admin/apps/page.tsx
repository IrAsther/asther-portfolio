import React from "react";
import { AppList } from "@/components/admin/apps/AppList";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { getAllApplicationsAdmin } from "@/lib/data/applications";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Applications Management — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAppsPage() {
  const isConfigured = isSupabaseConfigured();
  const apps = await getAllApplicationsAdmin();

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
          Applications Management
        </h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Manage engineering applications, platforms, links, and publication status in Supabase.
        </p>
      </div>

      <AppList initialApps={apps} />
    </div>
  );
}
