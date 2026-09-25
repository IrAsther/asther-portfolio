"use client";

import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/data/projects";

interface FeaturedProjectProps {
  project: Project;
  onSelect?: (project: Project) => void;
}

export function FeaturedProject({ project, onSelect }: FeaturedProjectProps) {
  return (
    <ProjectCard
      project={project}
      layout="spotlight"
      onSelect={onSelect}
    />
  );
}
