import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutSkills } from "@/components/about/AboutSkills";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutGallery } from "@/components/about/AboutGallery";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About — Asther Irakaza",
  description:
    "About Asther Irakaza — Computer Science student, Software Developer, AI/ML enthusiast, and Graphic Designer building practical digital solutions.",
};

export default function AboutPage() {
  return (
    <main id="main-content">
      {/* 01 — Hero */}
      <AboutHero />

      {/* 02 — Intro: who I am, 2 paragraphs */}
      <AboutIntro />

      {/* 03 — Stats metrics row */}
      <AboutStats />

      {/* 04 — Skills cards */}
      <AboutSkills />

      {/* 05 — Timeline */}
      <AboutTimeline />

      {/* 06 — Design gallery */}
      <AboutGallery />

      {/* 07 — CTA */}
      <AboutCTA />
    </main>
  );
}
