import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export const metadata: Metadata = {
  title: "About",
  description: "About Asther Irakaza — Software Developer & AI/ML Enthusiast.",
};

export default function AboutPage() {
  return (
    <PlaceholderSection
      title="About"
      badge="About Asther"
      description="Route foundation established. Biography, background, and personal journey will be added in upcoming phases."
    />
  );
}
