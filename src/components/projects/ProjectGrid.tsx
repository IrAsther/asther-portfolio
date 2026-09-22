import { Container } from "@/components/ui/Container";
import { ProjectCard } from "./ProjectCard";
import { ProjectStatusGuide } from "./ProjectStatus";
import type { Project } from "@/data/projects";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <section className={styles.section} aria-labelledby="architectures-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>02</span>
            <span className={styles.sectionTagline}>System Design</span>
          </div>
          <h2 id="architectures-heading" className={styles.heading}>
            Architectures & Active Explorations
          </h2>
          <p className={styles.subheading}>
            Technical frameworks, data pipelines, and full-stack component systems currently
            under active formulation, architectural design, and structured documentation.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Status Methodology and Transparency Guide */}
        <ProjectStatusGuide />
      </Container>
    </section>
  );
}
