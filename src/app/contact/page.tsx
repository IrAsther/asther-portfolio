import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "Contact — Asther Irakaza",
  description:
    "Get in touch with Asther Irakaza — Software Developer, AI/ML Enthusiast, and Graphic Designer. Discuss a project, collaboration, or engineering opportunity.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactSection />
    </>
  );
}
