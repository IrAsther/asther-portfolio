import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export const metadata: Metadata = {
  title: "Resume",
  description: "Interactive résumé and curriculum vitae of Asther Irakaza.",
};

export default function ResumePage() {
  return (
    <PlaceholderSection
      title="Resume"
      badge="Curriculum Vitae"
      description="Route foundation established. Professional timeline, skills taxonomy, and certifications will be added in upcoming phases."
    />
  );
}
