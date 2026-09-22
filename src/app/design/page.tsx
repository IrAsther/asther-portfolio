import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export const metadata: Metadata = {
  title: "Design",
  description: "Graphic and UI/UX design portfolio of Asther Irakaza.",
};

export default function DesignPage() {
  return (
    <PlaceholderSection
      title="Design"
      badge="Visual & UI Design"
      description="Route foundation established. Interface systems, typography explorations, and visual artifacts will be added in upcoming phases."
    />
  );
}
