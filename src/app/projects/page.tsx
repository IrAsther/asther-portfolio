import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export const metadata: Metadata = {
  title: "Projects",
  description: "Featured engineering projects and technical work by Asther Irakaza.",
};

export default function ProjectsPage() {
  return (
    <PlaceholderSection
      title="Projects"
      badge="Project Showcase"
      description="Route foundation established. Technical project architectures, case studies, and codebases will be added in upcoming phases."
    />
  );
}
