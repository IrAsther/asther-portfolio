import React from "react";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { getProjectByIdAdmin } from "@/lib/data/projects";

export const metadata = {
  title: "Edit Project — Admin",
};

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} isEditing={true} />;
}
