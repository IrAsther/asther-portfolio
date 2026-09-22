import type { Metadata } from "next";
import { featuredProjects } from "@/data/projects";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectsCTA } from "@/components/projects/ProjectsCTA";

export const metadata: Metadata = {
  title: "Projects — Asther Irakaza",
  description:
    "Software development, AI/ML system architectures, and digital product work by Asther Irakaza. Authentic engineering showcase and active project designs.",
};

export default function ProjectsPage() {
  const dandaza =
    featuredProjects.find((p) => p.id === "dandaza-plus") || featuredProjects[0];
  const architectureProjects = featuredProjects.filter(
    (p) => p.id !== "dandaza-plus"
  );

  return (
    <>
      <ProjectsHero />
      <FeaturedProject project={dandaza} />
      <ProjectGrid projects={architectureProjects} />
      <ProjectsCTA />
    </>
  );
}
