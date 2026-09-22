import type { Metadata } from "next";
import { designWorks } from "@/data/design";
import { DesignHero } from "@/components/design/DesignHero";
import { DesignIntro } from "@/components/design/DesignIntro";
import { FeaturedDesign } from "@/components/design/FeaturedDesign";
import { DesignGallery } from "@/components/design/DesignGallery";
import { DesignPrinciples } from "@/components/design/DesignPrinciples";
import { DesignTechnology } from "@/components/design/DesignTechnology";
import { DesignTools } from "@/components/design/DesignTools";
import { DesignCTA } from "@/components/design/DesignCTA";

export const metadata: Metadata = {
  title: "Design — Asther Irakaza",
  description:
    "Graphic design and visual communication portfolio of Asther Irakaza. Digital product UI design, structured editorial documentation, and brand identity systems.",
};

export default function DesignPage() {
  const featuredWork =
    designWorks.find((w) => w.featured) || designWorks[0];

  return (
    <>
      <DesignHero />
      <DesignIntro />
      <FeaturedDesign work={featuredWork} />
      <DesignGallery />
      <DesignPrinciples />
      <DesignTechnology />
      <DesignTools />
      <DesignCTA />
    </>
  );
}
