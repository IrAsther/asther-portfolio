import React from "react";
import { notFound } from "next/navigation";
import { AppForm } from "@/components/admin/apps/AppForm";
import { getApplicationByIdAdmin } from "@/lib/data/applications";

export const metadata = {
  title: "Edit Application — Admin",
};

export const dynamic = "force-dynamic";

interface EditAppPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditAppPage({ params }: EditAppPageProps) {
  const { id } = await params;
  const app = await getApplicationByIdAdmin(id);

  if (!app) {
    notFound();
  }

  return <AppForm initialData={app} isEditing={true} />;
}
