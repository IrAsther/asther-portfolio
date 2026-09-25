"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { featuredProjects, type Project } from "@/data/projects";
import styles from "./FeaturedProjects.module.css";

/* ─────────────────────────────────────────
   Concept panel for projects without images
───────────────────────────────────────── */
function ConceptPanel({ project }: { project: Project }) {
  return (
    <div className={styles.conceptPanel} aria-hidden="true">
      <div className={styles.conceptGrid} />
      <div className={styles.conceptContent}>
        <span className={styles.conceptCategory}>{project.category}</span>
        <div className={styles.conceptDiagram}>
          <div className={styles.diagramNode} />
          <div className={styles.diagramLine} />
          <div className={styles.diagramNode} />
          <div className={styles.diagramLine} />
          <div className={styles.diagramNode} />
        </div>
        <div className={styles.conceptCodeLines}>
          <span className={styles.codeLine} style={{ width: "72%" }} />
          <span className={styles.codeLine} style={{ width: "55%" }} />
          <span className={styles.codeLine} style={{ width: "84%" }} />
          <span className={styles.codeLine} style={{ width: "40%" }} />
        </div>
        <span className={styles.conceptStatus}>{project.status}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Fullscreen expanded project panel
───────────────────────────────────────── */
function ProjectExpanded({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus close button on open
    closeRef.current?.focus();

    // Trap scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape key
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} project details`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.panel}>
        {/* Close */}
        <button
          ref={closeRef}
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className={styles.panelInner}>
          {/* Left — visual */}
          <div className={styles.panelMedia}>
            {project.image ? (
              <div className={styles.panelImageWrapper}>
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(max-width: 767px) 100vw, 55vw"
                  className={styles.panelImage}
                  priority
                />
              </div>
            ) : (
              <ConceptPanel project={project} />
            )}
          </div>

          {/* Right — content */}
          <div className={styles.panelContent}>
            <div className={styles.panelMeta}>
              <span className={styles.panelCategory}>{project.category}</span>
              <span
                className={`${styles.panelStatus} ${
                  project.isPlaceholder
                    ? styles.statusDraft
                    : styles.statusActive
                }`}
              >
                {project.isPlaceholder
                  ? `Planned · ${project.status}`
                  : project.status}
              </span>
            </div>

            <h2 className={styles.panelTitle}>{project.title}</h2>

            {project.problem && (
              <div className={styles.panelBlock}>
                <span className={styles.panelLabel}>Problem</span>
                <p className={styles.panelText}>{project.problem}</p>
              </div>
            )}

            {project.direction && (
              <div className={styles.panelBlock}>
                <span className={styles.panelLabel}>Direction</span>
                <p className={styles.panelText}>{project.direction}</p>
              </div>
            )}

            <div className={styles.panelTags}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.panelTag}>
                  {tech}
                </span>
              ))}
            </div>

            <Link
              href={project.href || "/projects"}
              className={styles.panelCta}
              aria-label={`View full ${project.title} project page`}
            >
              View Full Project
              <ExternalLink size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main section
───────────────────────────────────────── */
export function FeaturedProjects() {
  const [expanded, setExpanded] = useState<Project | null>(null);

  const handleOpen = useCallback((project: Project) => {
    setExpanded(project);
  }, []);

  const handleClose = useCallback(() => {
    setExpanded(null);
  }, []);

  return (
    <>
      <section
        className={styles.section}
        aria-labelledby="projects-heading"
      >
        <Container>
          {/* Section header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <span className={styles.badge}>Portfolio</span>
              <h2 id="projects-heading" className={styles.heading}>
                Featured Projects
              </h2>
              <p className={styles.subheading}>
                Selected applications and technical systems showcasing practical
                engineering, functional architecture, and interface design.
              </p>
            </div>
            <div className={styles.headerAction}>
              <Button
                href="/projects"
                variant="outline"
                size="md"
                id="featured-projects-all"
              >
                All Projects
              </Button>
            </div>
          </div>

          {/* Project grid */}
          <div className={styles.grid}>
            {featuredProjects.map((project) => (
              <article
                key={project.id}
                className={`${styles.card} ${
                  project.isPlaceholder ? styles.cardPlaceholder : ""
                }`}
                onClick={() => handleOpen(project)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${project.title} project details`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpen(project);
                  }
                }}
              >
                {/* Image or concept panel */}
                <div className={styles.mediaContainer}>
                  {project.image ? (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={project.image}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className={styles.projectImage}
                      />
                    </div>
                  ) : (
                    <ConceptPanel project={project} />
                  )}
                  {/* Hover overlay */}
                  <div className={styles.mediaOverlay} aria-hidden="true">
                    <span className={styles.expandHint}>View Project</span>
                  </div>
                </div>

                {/* Card meta row */}
                <div className={styles.cardHeader}>
                  <span className={styles.category}>{project.category}</span>
                  <span
                    className={`${styles.status} ${
                      project.isPlaceholder
                        ? styles.statusDraft
                        : styles.statusActive
                    }`}
                  >
                    {project.isPlaceholder
                      ? `Planned · ${project.status}`
                      : project.status}
                  </span>
                </div>

                {/* Title & link */}
                <div className={styles.cardBody}>
                  <div className={styles.titleRow}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <span className={styles.arrowIcon} aria-hidden="true">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <p className={styles.summary}>{project.summary}</p>
                </div>

                {/* Tech tags */}
                <div className={styles.cardFooter}>
                  <div className={styles.tags} aria-label="Technologies used">
                    {project.technologies.map((tech) => (
                      <span key={tech} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className={styles.mobileAction}>
            <Button href="/projects" variant="outline" size="md">
              View All Projects
            </Button>
          </div>
        </Container>
      </section>

      {/* Expanded project panel */}
      {expanded && (
        <ProjectExpanded project={expanded} onClose={handleClose} />
      )}
    </>
  );
}
