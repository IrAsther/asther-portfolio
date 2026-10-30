import React from "react";
import Link from "next/link";
import { DesignForm } from "@/components/admin/designs/DesignForm";
import { getDesignByIdAdmin } from "@/lib/data/designs";

export const dynamic = "force-dynamic";

interface EditDesignPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditDesignPageProps) {
  const { id } = await params;
  const design = await getDesignByIdAdmin(id);
  return {
    title: design ? `Edit "${design.title}" — Admin` : "Design Not Found — Admin",
  };
}

export default async function AdminEditDesignPage({ params }: EditDesignPageProps) {
  const { id } = await params;
  const design = await getDesignByIdAdmin(id);

  if (!design) {
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
          Design not found
        </h2>
        <p style={{ margin: 0, color: "var(--color-text-subtle)", fontSize: "0.875rem" }}>
          The design with ID <code>{id}</code> does not exist or has been deleted.
        </p>
        <Link
          href="/admin/designs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-xs)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontFamily: "var(--font-family-sans)",
            transition: "background-color var(--transition-fast)",
          }}
        >
          ← Back to Designs
        </Link>
      </div>
    );
  }

  return <DesignForm mode="edit" initialData={design} />;
}
