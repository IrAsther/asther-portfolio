import React from "react";
import { AppForm } from "@/components/admin/apps/AppForm";

export const metadata = {
  title: "New Application — Admin",
};

export default function AdminNewAppPage() {
  return <AppForm isEditing={false} />;
}
