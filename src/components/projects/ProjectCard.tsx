import Image from "next/image";
import { ProjectStatusBadge } from "./ProjectStatus";
import type { Project } from "@/data/projects";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const indexStr = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`${styles.card} ${project.isPlaceholder ? styles.cardArchitecture : ""}`}
      aria-labelledby={`project-title-${project.id}`}
    >
      {/* Visual media preview — authentic image OR blueprint architecture pattern */}
      {project.image ? (
        <div className={styles.mediaContainer}>
          <div className={styles.imageWrapper}>
            <Image
              src={project.image}
              alt={`${project.title} interface preview`}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 420px"
              className={styles.projectImage}
            />
          </div>
        </div>
      ) : (
        <div className={styles.blueprintContainer} aria-hidden="true">
          <div className={styles.blueprintLines} />
          <div className={styles.blueprintOverlay}>
            <span className={styles.blueprintIndex}>ARCH-{indexStr}</span>
            <span className={styles.blueprintBadge}>System Specification</span>
          </div>
        </div>
      )}

      {/* Card Header: Category & Status */}
      <div className={styles.cardHeader}>
        <span className={styles.category}>{project.category}</span>
        <ProjectStatusBadge
          status={project.status}
          statusType={project.statusType || (project.isPlaceholder ? "architecture" : "showcase")}
          size="sm"
        />
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <h3 id={`project-title-${project.id}`} className={styles.title}>
          {project.title}
        </h3>

        <p className={styles.summary}>{project.summary}</p>

        {project.problem && (
          <div className={styles.problemBox}>
            <span className={styles.problemLabel}>Scope & Intent</span>
            <p className={styles.problemText}>{project.problem}</p>
          </div>
        )}
      </div>

      {/* Card Footer: Tech tags & architectural note */}
      <div className={styles.cardFooter}>
        <div className={styles.tags} aria-label="Technologies involved">
          {project.technologies.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
