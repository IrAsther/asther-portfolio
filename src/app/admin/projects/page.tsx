import React from "react";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { getAllProjectsAdmin } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = {
  title: "Projects Management — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const isConfigured = isSupabaseConfigured();
  const projects = await getAllProjectsAdmin();

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
          Projects Management
        </h1>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
          Manage engineering projects, case studies, technologies, and publication status in Supabase.
        </p>
      </div>

      <ProjectList initialProjects={projects} />
    </div>
  );
}
