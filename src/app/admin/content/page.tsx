import React from "react";
import { ContentEditor } from "@/components/admin/content/ContentEditor";
import { getAdminContentData } from "@/lib/data/resume";

export const metadata = {
  title: "Bio & Resume — Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const initialData = await getAdminContentData();
  return <ContentEditor initialData={initialData} />;
}
