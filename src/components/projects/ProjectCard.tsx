"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  layout?: "spotlight" | "diagram" | "horizontal";
  onSelect?: (project: Project) => void;
}

export function ProjectCard({
  project,
  layout = "diagram",
  onSelect,
}: ProjectCardProps) {
  const handleClick = () => {
    onSelect?.(project);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(project);
    }
  };

  const cardClass =
    layout === "spotlight"
      ? styles.cardSpotlight
      : layout === "horizontal"
      ? styles.cardHorizontal
      : styles.cardDiagram;

  return (
    <article
      className={`${styles.card} ${cardClass}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${project.title}`}
    >
      {/* Visual Area */}
      <div className={styles.mediaArea}>
        {project.image ? (
          <div className={styles.imageWrapper}>
            <Image
              src={project.image}
              alt={`${project.title} interface`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className={styles.projectImage}
            />
          </div>
        ) : layout === "diagram" ? (
          <div className={styles.conceptDiagram} aria-hidden="true">
            <div className={styles.conceptStep}>Ingest</div>
            <div className={`${styles.conceptStep} ${styles.conceptStepHighlight}`}>
              Pipeline
            </div>
            <div className={styles.conceptStep}>Inference</div>
          </div>
        ) : (
          <div className={styles.wireframeBox} aria-hidden="true">
            <div className={styles.wireframeBar} />
            <div className={styles.wireframeRow}>
              <div className={styles.wireframeCell} />
              <div className={styles.wireframeCell} />
            </div>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className={styles.infoArea}>
        <div className={styles.statusLine}>
          <span className={styles.statusDot} aria-hidden="true" />
          <span>{project.status}</span>
        </div>

        <h3 className={styles.title}>{project.title}</h3>

        <p className={styles.summary}>{project.summary}</p>

        <div className={styles.techLine}>
          {project.technologies.join("  ·  ")}
        </div>

        <div className={styles.actionLink} aria-hidden="true">
          <span>{layout === "spotlight" ? "Read project overview" : "View architecture"}</span>
          <ArrowRight size={15} />
        </div>
      </div>
    </article>
  );
}
