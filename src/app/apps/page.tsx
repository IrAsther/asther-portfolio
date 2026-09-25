import type { Metadata } from "next";
import { appsData } from "@/data/apps";
import { AppsBackground } from "@/components/apps/AppsBackground";
import { AppsHero } from "@/components/apps/AppsHero";
import { FeaturedApp } from "@/components/apps/FeaturedApp";
import { AppsGrid } from "@/components/apps/AppsGrid";
import { ProductProcess } from "@/components/apps/ProductProcess";
import { TechnologyDirection } from "@/components/apps/TechnologyDirection";
import { AppsCTA } from "@/components/apps/AppsCTA";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Apps — Asther Irakaza",
  description:
    "Applications and digital products built by Asther Irakaza — from mobile daily utilities to intelligent EdTech platforms and AI-assisted study tools.",
};

export default function AppsPage() {
  const featuredApp = appsData.find((a) => a.featured) || appsData[0];
  const gridApps = appsData.filter((a) => !a.featured);

  return (
    <div className={styles.pageWrapper}>
      {/* Authentic Asther logo background */}
      <AppsBackground />

      {/* Page content flow */}
      <main className={styles.pageContent}>
        <AppsHero />
        <FeaturedApp app={featuredApp} />
        <AppsGrid apps={gridApps} />
        <ProductProcess />
        <TechnologyDirection />
        <AppsCTA />
      </main>
    </div>
  );
}
