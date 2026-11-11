"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowRight, Search, X, FolderX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProjectExpandedModal } from "./ProjectExpandedModal";
import type { Project } from "@/data/projects";
import type { ProjectDTO } from "@/lib/data/projects";
import styles from "./ProjectGrid.module.css";

export type ProjectItem = Project | ProjectDTO;

interface ProjectGridProps {
  projects: ProjectItem[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Instant reactive filter across all relevant text fields
  const filteredProjects = useMemo(() => {
    if (!normalizedQuery) return projects;
    return projects.filter((project) => {
      const titleMatch = project.title.toLowerCase().includes(normalizedQuery);
      const categoryMatch = project.category.toLowerCase().includes(normalizedQuery);
      const summaryMatch = project.summary.toLowerCase().includes(normalizedQuery);
      const problemMatch = project.problem?.toLowerCase().includes(normalizedQuery) || false;
      const directionMatch = project.direction?.toLowerCase().includes(normalizedQuery) || false;
      const techMatch = project.technologies.some((tech) =>
        tech.toLowerCase().includes(normalizedQuery)
      );
      const statusMatch = project.status.toLowerCase().includes(normalizedQuery);
      return (
        titleMatch ||
        categoryMatch ||
        summaryMatch ||
        problemMatch ||
        directionMatch ||
        techMatch ||
        statusMatch
      );
    });
  }, [projects, normalizedQuery]);

  // Identify Flagship Project (Dandaza+ preferred, or featured, or first project)
  const flagship = useMemo(() => {
    if (projects.length === 0) return null;
    return (
      projects.find(
        (p) =>
          ("slug" in p && p.slug === "dandaza-plus") ||
          p.id === "dandaza-plus"
      ) ||
      projects.find((p) => p.featured) ||
      projects[0]
    );
  }, [projects]);

  // Supporting projects are all other published projects
  const supportingProjects = useMemo(() => {
    if (!flagship) return [];
    return projects.filter(
      (p) =>
        p.id !== flagship.id &&
        (!("slug" in p) || !("slug" in flagship) || (p as ProjectDTO).slug !== (flagship as ProjectDTO).slug)
    );
  }, [projects, flagship]);

  const isSearching = normalizedQuery.length > 0;

  return (
    <>
      <section className={styles.section} aria-label="Projects showcase">
        <Container>
          {/* ============================================================
              SEARCH & FILTER CONTROLS (Task A)
              ============================================================ */}
          <div className={styles.searchSection}>
            <div className={styles.searchBar}>
              <div className={styles.searchFieldWrap}>
                <Search size={18} className={styles.searchIcon} aria-hidden="true" />
                <input
                  type="text"
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by title, category, or technology (e.g. Python, Mobile UI)..."
                  aria-label="Search projects"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className={styles.clearSearchBtn}
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear project search query"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className={styles.searchBadge}>
                {isSearching ? (
                  <span>
                    Found {filteredProjects.length}{" "}
                    {filteredProjects.length === 1 ? "match" : "matches"}
                  </span>
                ) : (
                  <span>{projects.length} Published Projects</span>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================
              CASE 1: ACTIVE SEARCH (Instant Filter Results)
              ============================================================ */}
          {isSearching ? (
            filteredProjects.length === 0 ? (
              /* Empty Search Results State */
              <div className={styles.emptyState}>
                <div className={styles.emptyIconWrap}>
                  <FolderX size={36} aria-hidden="true" />
                </div>
                <h3 className={styles.emptyTitle}>No matching projects found</h3>
                <p className={styles.emptyText}>
                  No published projects match your search for &ldquo;{searchQuery}&rdquo;.
                  Try searching with broader terms like &ldquo;Mobile&rdquo;, &ldquo;Python&rdquo;, or &ldquo;Architecture&rdquo;.
                </p>
                <button
                  type="button"
                  className={styles.emptyResetBtn}
                  onClick={() => setSearchQuery("")}
                >
                  Clear search and view all projects
                </button>
              </div>
            ) : (
              /* Matching Search Results Grid */
              <div className={styles.searchResultsContainer}>
                <div className={styles.secondaryGrid}>
                  {filteredProjects.map((project) => (
                    <article
                      key={project.id}
                      className={styles.projectCard}
                      onClick={() => setSelectedProject(project)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedProject(project);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open details for ${project.title}`}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <span className={styles.cardCategory}>{project.category}</span>
                          <h4 className={styles.cardTitle}>{project.title}</h4>
                        </div>
                        <div className={styles.statusRow}>
                          <span className={styles.statusDot} aria-hidden="true" />
                          <span>{project.status}</span>
                        </div>
                      </div>

                      <p className={styles.cardSummary}>{project.summary}</p>

                      {(project.direction || project.problem) && (
                        <p className={styles.cardFocus}>
                          {project.direction || project.problem}
                        </p>
                      )}

                      <div className={styles.cardFooter}>
                        <span className={styles.cardTech}>
                          {project.technologies.join("  ·  ")}
                        </span>
                        <div className={styles.cardAction} aria-hidden="true">
                          <span>View overview</span>
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )
          ) : (
            /* ============================================================
               CASE 2: DEFAULT EDITORIAL LAYOUT
               ============================================================ */
            <>
              {/* 1. FLAGSHIP PROJECT: Left / Center / Right Balanced Composition */}
              {flagship && (
                <article
                  className={styles.flagshipShowcase}
                  onClick={() => setSelectedProject(flagship)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProject(flagship);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open details for ${flagship.title}`}
                >
                  {/* ZONE 1 (LEFT): Human Context & Problem */}
                  <div className={styles.flagshipLeft}>
                    <span className={styles.flagshipCategory}>{flagship.category}</span>
                    <h2 className={styles.flagshipTitle}>{flagship.title}</h2>
                    <p className={styles.flagshipSummary}>{flagship.summary}</p>
                    <p className={styles.flagshipContext}>
                      {flagship.problem ||
                        "Daily records in Burundi often get scattered across paper notebooks or lost in spreadsheets. Dandaza+ provides a quick mobile interface to capture sales on the spot and generate clean daily summaries."}
                    </p>
                  </div>

                  {/* ZONE 2 (CENTER): Visual Anchor (Authentic Screenshot) */}
                  <div className={styles.flagshipCenter}>
                    <div className={styles.screenshotFrame}>
                      {flagship.image ? (
                        <Image
                          src={flagship.image}
                          alt={`${flagship.title} mobile interface`}
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 320px"
                          className={styles.flagshipImage}
                        />
                      ) : (
                        <div className={styles.conceptFallback}>
                          <span className={styles.conceptInitials}>
                            {flagship.category.slice(0, 3).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ZONE 3 (RIGHT): Status, Specifications & Interactive Action */}
                  <div className={styles.flagshipRight}>
                    <div className={styles.statusRow}>
                      <span className={styles.statusDot} aria-hidden="true" />
                      <span>{flagship.status}</span>
                    </div>

                    <div className={styles.specBlock}>
                      <span className={styles.specLabel}>Focus Areas</span>
                      <div className={styles.specList}>
                        {flagship.technologies.map((tech) => (
                          <span key={tech} className={styles.specItem}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className={styles.focusNote}>
                      {flagship.direction ||
                        "Built with a lightweight mobile-first interface designed for fast record entry in low-connectivity settings."}
                    </p>

                    <div className={styles.flagshipAction} aria-hidden="true">
                      <span>Open project overview</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </article>
              )}

              {/* 2. SUPPORTING PROJECTS: Render ALL dynamically */}
              {supportingProjects.length > 0 && (
                <>
                  <div className={styles.subheadingRow}>
                    <h3 className={styles.sectionSubhead}>Other work in progress</h3>
                  </div>

                  <div className={styles.secondaryGrid}>
                    {supportingProjects.map((project) => (
                      <article
                        key={project.id}
                        className={styles.projectCard}
                        onClick={() => setSelectedProject(project)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedProject(project);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Open details for ${project.title}`}
                      >
                        <div className={styles.cardHeader}>
                          <div>
                            <span className={styles.cardCategory}>{project.category}</span>
                            <h4 className={styles.cardTitle}>{project.title}</h4>
                          </div>
                          <div className={styles.statusRow}>
                            <span className={styles.statusDot} aria-hidden="true" />
                            <span>{project.status}</span>
                          </div>
                        </div>

                        <p className={styles.cardSummary}>{project.summary}</p>

                        {(project.direction || project.problem) && (
                          <p className={styles.cardFocus}>
                            {project.direction || project.problem}
                          </p>
                        )}

                        <div className={styles.cardFooter}>
                          <span className={styles.cardTech}>
                            {project.technologies.join("  ·  ")}
                          </span>
                          <div className={styles.cardAction} aria-hidden="true">
                            <span>View notes</span>
                            <ArrowRight size={13} />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
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
