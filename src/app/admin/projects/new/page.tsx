import React from "react";
import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const metadata = {
  title: "New Project — Admin",
};

export default function AdminNewProjectPage() {
  return <ProjectForm isEditing={false} />;
}
