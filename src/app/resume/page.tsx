import type { Metadata } from "next";
import { ResumeHero } from "@/components/resume/ResumeHero";
import { ResumeSummary } from "@/components/resume/ResumeSummary";
import { ResumeSkills } from "@/components/resume/ResumeSkills";
import { ResumeEducation } from "@/components/resume/ResumeEducation";
import { ResumeProjects } from "@/components/resume/ResumeProjects";
import { ResumeDirection } from "@/components/resume/ResumeDirection";
import { ResumeCTA } from "@/components/resume/ResumeCTA";

export const metadata: Metadata = {
  title: "Resume — Asther Irakaza",
  description:
    "Professional online resume of Asther Irakaza — Software Developer, Computer Science Student, and AI/ML Enthusiast. Technical skills, academic coursework, and selected engineering projects.",
};

export default function ResumePage() {
  return (
    <>
      <ResumeHero />
      <ResumeSummary />
      <ResumeSkills />
      <ResumeEducation />
      <ResumeProjects />
      <ResumeDirection />
      <ResumeCTA />
    </>
  );
}
