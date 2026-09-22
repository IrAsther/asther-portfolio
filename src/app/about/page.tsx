import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { WhoIAm } from "@/components/about/WhoIAm";
import { Journey } from "@/components/about/Journey";
import { Education } from "@/components/about/Education";
import { TechnicalDirection } from "@/components/about/TechnicalDirection";
import { DesignStory } from "@/components/about/DesignStory";
import { ValuesMission } from "@/components/about/ValuesMission";
import { CurrentFocus } from "@/components/about/CurrentFocus";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About — Asther Irakaza",
  description:
    "About Asther Irakaza — Computer Science student, Software Developer, AI/ML enthusiast, and Graphic Designer building practical digital solutions.",
};

export default function AboutPage() {
  return (
    <main id="main-content">
      {/* 01 — About Hero */}
      <AboutHero />

      {/* 02 — Who I Am */}
      <WhoIAm />

      {/* 03 — My Journey */}
      <Journey />

      {/* 04 — Education */}
      <Education />

      {/* 05 — Technical Direction */}
      <TechnicalDirection />

      {/* 06 — Design & Creative */}
      <DesignStory />

      {/* 07 — Values & Mission */}
      <ValuesMission />

      {/* 08 — Current Focus */}
      <CurrentFocus />

      {/* 09 — Final CTA */}
      <AboutCTA />
    </main>
  );
}
