import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export const metadata: Metadata = {
  title: "Apps",
  description: "Applications and digital tools created by Asther Irakaza.",
};

export default function AppsPage() {
  return (
    <PlaceholderSection
      title="Apps"
      badge="Application Showcase"
      description="Route foundation established. Application releases, platforms, and interactive software will be added in upcoming phases."
    />
  );
}
