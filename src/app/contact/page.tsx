import type { Metadata } from "next";
import { PlaceholderSection } from "@/components/ui/PlaceholderSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Asther Irakaza — Software Developer & AI/ML Enthusiast.",
};

export default function ContactPage() {
  return (
    <PlaceholderSection
      title="Contact"
      badge="Get in Touch"
      description="Route foundation established. Professional contact form and verified communication channels will be added in upcoming phases."
    />
  );
}
