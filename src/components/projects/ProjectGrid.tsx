"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProjectExpandedModal } from "./ProjectExpandedModal";
import type { Project } from "@/data/projects";
import styles from "./ProjectGrid.module.css";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const dandaza = projects.find((p) => p.id === "dandaza-plus") || projects[0];
  const aiProject = projects.find((p) => p.id === "ai-applied-system");
  const webProject = projects.find((p) => p.id === "web-platform-core");

  return (
    <>
      <section className={styles.section} aria-label="Projects showcase">
        <Container>
          {/* ============================================================
              1. FLAGSHIP PROJECT: Left / Center / Right Balanced Composition
              ============================================================ */}
          {dandaza && (
            <article
              className={styles.flagshipShowcase}
              onClick={() => setSelectedProject(dandaza)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedProject(dandaza);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Open details for ${dandaza.title}`}
            >
              {/* ZONE 1 (LEFT): Human Context & Problem */}
              <div className={styles.flagshipLeft}>
                <span className={styles.flagshipCategory}>Mobile Utility</span>
                <h2 className={styles.flagshipTitle}>{dandaza.title}</h2>
                <p className={styles.flagshipSummary}>{dandaza.summary}</p>
                <p className={styles.flagshipContext}>
                  Daily records in Burundi often get scattered across paper notebooks or lost in
                  spreadsheets. Dandaza+ provides a quick mobile interface to capture sales on the
                  spot and generate clean daily summaries.
                </p>
              </div>

              {/* ZONE 2 (CENTER): Visual Anchor (Authentic Screenshot) */}
              <div className={styles.flagshipCenter}>
                <div className={styles.screenshotFrame}>
                  {dandaza.image && (
                    <Image
                      src={dandaza.image}
                      alt={`${dandaza.title} mobile interface`}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 320px"
                      className={styles.flagshipImage}
                    />
                  )}
                </div>
              </div>

              {/* ZONE 3 (RIGHT): Status, Specifications & Interactive Action */}
              <div className={styles.flagshipRight}>
                <div className={styles.statusRow}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  <span>{dandaza.status}</span>
                </div>

                <div className={styles.specBlock}>
                  <span className={styles.specLabel}>Focus Areas</span>
                  <div className={styles.specList}>
                    {dandaza.technologies.map((tech) => (
                      <span key={tech} className={styles.specItem}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <p className={styles.focusNote}>
                  Built with a lightweight mobile-first interface designed for fast record entry in
                  low-connectivity settings.
                </p>

                <div className={styles.flagshipAction} aria-hidden="true">
                  <span>Open project overview</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </article>
          )}

          {/* ============================================================
              2. SUPPORTING PROJECTS: Honest, Asymmetric Composition
              (Real content determines structure — zero fake diagrams)
              ============================================================ */}
          <div className={styles.subheadingRow}>
            <h3 className={styles.sectionSubhead}>Other work in progress</h3>
          </div>

          <div className={styles.secondaryGrid}>
            {/* Project 2: Applied Machine Learning Pipeline */}
            {aiProject && (
              <article
                className={styles.projectCard}
                onClick={() => setSelectedProject(aiProject)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(aiProject);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open details for ${aiProject.title}`}
              >
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardTitle}>{aiProject.title}</h4>
                  <div className={styles.statusRow}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    <span>{aiProject.status}</span>
                  </div>
                </div>

                <p className={styles.cardSummary}>{aiProject.summary}</p>

                <p className={styles.cardFocus}>
                  Focusing on clean data transformation pipelines in Python and lightweight REST
                  inference endpoints to keep response times predictable.
                </p>

                <div className={styles.cardFooter}>
                  <span className={styles.cardTech}>
                    {aiProject.technologies.join("  ·  ")}
                  </span>
                  <div className={styles.cardAction} aria-hidden="true">
                    <span>View notes</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </article>
            )}

            {/* Project 3: Component Web Architecture */}
            {webProject && (
              <article
                className={styles.projectCard}
                onClick={() => setSelectedProject(webProject)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProject(webProject);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open details for ${webProject.title}`}
              >
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardTitle}>{webProject.title}</h4>
                  <div className={styles.statusRow}>
                    <span className={styles.statusDot} aria-hidden="true" />
                    <span>{webProject.status}</span>
                  </div>
                </div>

                <p className={styles.cardSummary}>{webProject.summary}</p>

                <p className={styles.cardFocus}>
                  Exploring custom, accessible components using strict semantic HTML and native CSS
                  Modules, with zero runtime CSS dependencies.
                </p>

                <div className={styles.cardFooter}>
                  <span className={styles.cardTech}>
                    {webProject.technologies.join("  ·  ")}
                  </span>
                  <div className={styles.cardAction} aria-hidden="true">
                    <span>View notes</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </article>
            )}
          </div>
        </Container>
      </section>

      {/* Expanded Project Modal */}
      {selectedProject && (
        <ProjectExpandedModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
