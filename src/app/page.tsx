import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { BuildCategories } from "@/components/home/BuildCategories";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { SkillsPreview } from "@/components/home/SkillsPreview";
import { DesignPreview } from "@/components/home/DesignPreview";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Asther Irakaza — Software Developer & AI/ML Enthusiast",
  description:
    "Personal portfolio of Asther Irakaza — Software Developer, AI/ML Enthusiast, and Graphic Designer. Practical engineering, intelligent systems, and digital product design.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <BuildCategories />
      <FeaturedProjects />
      <SkillsPreview />
      <DesignPreview />
      <FinalCTA />
    </>
  );
}
