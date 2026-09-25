import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactSection } from "@/components/contact/ContactSection";
import { ContactBackground } from "@/components/contact/ContactBackground";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact — Asther Irakaza",
  description:
    "Get in touch with Asther Irakaza — Software Developer, AI/ML Enthusiast, and Graphic Designer. Discuss a project, collaboration, or engineering opportunity.",
};

export default function ContactPage() {
  return (
    <div className={styles.pageWrapper}>
      <ContactBackground />
      <div className={styles.pageContent}>
        <ContactHero />
        <ContactSection />
      </div>
    </div>
  );
}
