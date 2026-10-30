import type { Metadata } from "next";
import { DesignBackground } from "@/components/design/DesignBackground";
import { DesignHero } from "@/components/design/DesignHero";
import { DesignWorks } from "@/components/design/DesignWorks";
import { DesignProcess } from "@/components/design/DesignProcess";
import { DesignSystemGlimpse } from "@/components/design/DesignSystemGlimpse";
import { DesignCTA } from "@/components/design/DesignCTA";
import { getPublishedDesigns } from "@/lib/data/designs";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design — Asther Irakaza",
  description:
    "Design portfolio of Asther Irakaza. Visual systems, digital product interfaces, and editorial experiences designed with clarity and purpose.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DesignPage() {
  const designs = await getPublishedDesigns();

  // Safe server logging for public query tracing
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0]
    : "not-configured";

  console.log(`[Public Design Page] Supabase project: ${projectRef}`);
  console.log(`[Public Design Page] Query filter: published = true`);
  console.log(`[Public Design Page] Returned count: ${designs.length}`);
  console.log(
    `[Public Design Page] Designs:`,
    designs.map((d) => ({ id: d.id, slug: d.slug, title: d.title }))
  );

  return (
    <div className={styles.pageWrapper}>
      {/* Authentic Asther Logo Architectural Background */}
      <DesignBackground />

      {/* Main Page Flow (div avoids duplicate <main> landmark with root layout) */}
      <div className={styles.pageContent}>
        <DesignHero />
        <DesignWorks designs={designs} />
        <DesignProcess />
        <DesignSystemGlimpse />
        <DesignCTA />
      </div>
    </div>
  );
}
