import type { Metadata } from "next";
import { DesignBackground } from "@/components/design/DesignBackground";
import { DesignHero } from "@/components/design/DesignHero";
import { DesignWorks } from "@/components/design/DesignWorks";
import { DesignProcess } from "@/components/design/DesignProcess";
import { DesignSystemGlimpse } from "@/components/design/DesignSystemGlimpse";
import { DesignCTA } from "@/components/design/DesignCTA";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design — Asther Irakaza",
  description:
    "Design portfolio of Asther Irakaza. Visual systems, digital product interfaces, and editorial experiences designed with clarity and purpose.",
};

export default function DesignPage() {
  return (
    <div className={styles.pageWrapper}>
      {/* Authentic Asther Logo Architectural Background */}
      <DesignBackground />

      {/* Main Page Flow */}
      <main className={styles.pageContent}>
        <DesignHero />
        <DesignWorks />
        <DesignProcess />
        <DesignSystemGlimpse />
        <DesignCTA />
      </main>
    </div>
  );
}
