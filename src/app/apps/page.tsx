import type { Metadata } from "next";
import { getPublishedApplications } from "@/lib/data";
import { appsData } from "@/data/apps";
import { AppsBackground } from "@/components/apps/AppsBackground";
import { AppsHero } from "@/components/apps/AppsHero";
import { FeaturedApp } from "@/components/apps/FeaturedApp";
import { AppsGrid } from "@/components/apps/AppsGrid";
import { ProductProcess } from "@/components/apps/ProductProcess";
import { TechnologyDirection } from "@/components/apps/TechnologyDirection";
import { AppsCTA } from "@/components/apps/AppsCTA";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Apps — Asther Irakaza",
  description:
    "Applications and digital products built by Asther Irakaza — from mobile daily utilities to intelligent EdTech platforms and AI-assisted study tools.",
};

export default async function AppsPage() {
  const publishedApps = await getPublishedApplications();
  const apps = publishedApps.length > 0 ? publishedApps : appsData;
  const featuredApp = apps.find((a) => a.featured) || apps[0];
  const gridApps = apps.filter((a) => !a.featured);

  return (
    <div className={styles.pageWrapper}>
      {/* Authentic Asther logo background */}
      <AppsBackground />

      {/* Page content flow */}
      <main className={styles.pageContent}>
        <AppsHero />
        {featuredApp && <FeaturedApp app={featuredApp} />}
        {gridApps.length > 0 && <AppsGrid apps={gridApps} />}
        <ProductProcess />
        <TechnologyDirection />
        <AppsCTA />
      </main>
    </div>
  );
}
