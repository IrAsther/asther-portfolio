import React from "react";
import { DesignForm } from "@/components/admin/designs/DesignForm";

export const metadata = {
  title: "Create Design — Admin",
};

export const dynamic = "force-dynamic";

export default function AdminNewDesignPage() {
  return <DesignForm mode="create" />;
}
