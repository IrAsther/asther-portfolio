import type { Metadata } from "next";
import { featuredProjects } from "@/data/projects";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectsCTA } from "@/components/projects/ProjectsCTA";
import { ProjectsBackground } from "@/components/projects/ProjectsBackground";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects — Asther Irakaza",
  description:
    "Software development, AI/ML system architectures, and digital product work by Asther Irakaza. Authentic engineering showcase and active project designs.",
};

export default function ProjectsPage() {
  return (
    <div className={styles.pageWrapper}>
      <ProjectsBackground />
      <div className={styles.pageContent}>
        <ProjectsHero />
        <ProjectGrid projects={featuredProjects} />
        <ProjectsCTA />
      </div>
    </div>
  );
}
