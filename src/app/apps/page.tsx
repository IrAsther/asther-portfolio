import type { Metadata } from "next";
import { appsData } from "@/data/apps";
import { AppsHero } from "@/components/apps/AppsHero";
import { FeaturedApp } from "@/components/apps/FeaturedApp";
import { AppsGrid } from "@/components/apps/AppsGrid";
import { ProductProcess } from "@/components/apps/ProductProcess";
import { TechnologyDirection } from "@/components/apps/TechnologyDirection";
import { AppsCTA } from "@/components/apps/AppsCTA";

export const metadata: Metadata = {
  title: "Apps — Asther Irakaza",
  description:
    "Applications, digital products, and education technology tools developed by Asther Irakaza. Featured mobile utilities, EdTech platforms, and intelligent study assistants.",
};

export default function AppsPage() {
  const featuredApp = appsData.find((a) => a.featured) || appsData[0];
  const gridApps = appsData.filter((a) => !a.featured);

  return (
    <>
      <AppsHero />
      <FeaturedApp app={featuredApp} />
      <AppsGrid apps={gridApps} />
      <ProductProcess />
      <TechnologyDirection />
      <AppsCTA />
    </>
  );
}
