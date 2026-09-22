import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ProjectStatusBadge } from "./ProjectStatus";
import type { Project } from "@/data/projects";
import styles from "./FeaturedProject.module.css";

interface FeaturedProjectProps {
  project: Project;
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  return (
    <section className={styles.section} aria-labelledby="featured-project-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>01</span>
            <span className={styles.sectionTagline}>Flagship Build</span>
          </div>
          <h2 id="featured-project-heading" className={styles.heading}>
            Featured Showcase
          </h2>
          <p className={styles.subheading}>
            Deep dive into Dandaza+, an authentic mobile application build focused on
            practical data management and structured reporting workflows.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Visual media showcase — dual authentic screenshots */}
          <div className={styles.mediaColumn}>
            <div className={styles.mediaStage}>
              {/* Primary screenshot */}
              <div className={styles.primaryDevice}>
                <div className={styles.deviceHeader}>
                  <span className={styles.deviceDot} aria-hidden="true" />
                  <span className={styles.deviceLabel}>Primary Interface</span>
                </div>
                <div className={styles.imageFrame}>
                  {project.image && (
                    <Image
                      src={project.image}
                      alt="Dandaza+ mobile application interface showing primary navigation and utilities"
                      fill
                      priority
                      sizes="(max-width: 639px) 280px, (max-width: 1023px) 320px, 340px"
                      className={styles.screenshot}
                    />
                  )}
                </div>
              </div>

              {/* Secondary screenshot — structured records */}
              {project.secondaryImage && (
                <div className={styles.secondaryDevice}>
                  <div className={styles.deviceHeader}>
                    <span className={styles.deviceDot} aria-hidden="true" />
                    <span className={styles.deviceLabel}>Record Management</span>
                  </div>
                  <div className={styles.imageFrame}>
                    <Image
                      src={project.secondaryImage}
                      alt="Dandaza+ structured report and record management screen"
                      fill
                      sizes="(max-width: 639px) 220px, (max-width: 1023px) 260px, 280px"
                      className={styles.screenshot}
                    />
                  </div>
                </div>
              )}
            </div>
            <p className={styles.mediaCaption}>
              Authentic mobile UI screenshots from the Dandaza+ utility build.
            </p>
          </div>

          {/* Project Details Column */}
          <div className={styles.contentColumn}>
            <div className={styles.statusRow}>
              <span className={styles.category}>{project.category}</span>
              <ProjectStatusBadge
                status={project.status}
                statusType={project.statusType || "showcase"}
              />
            </div>

            <h3 className={styles.projectTitle}>{project.title}</h3>

            <p className={styles.summary}>{project.summary}</p>

            {project.problem && (
              <div className={styles.insightBlock}>
                <h4 className={styles.insightTitle}>Problem & Need</h4>
                <p className={styles.insightText}>{project.problem}</p>
              </div>
            )}

            {project.direction && (
              <div className={styles.insightBlock}>
                <h4 className={styles.insightTitle}>Technical Direction</h4>
                <p className={styles.insightText}>{project.direction}</p>
              </div>
            )}

            <div className={styles.techSection}>
              <h4 className={styles.techHeading}>Core Technologies & Focus</h4>
              <div className={styles.techGrid} aria-label="Technologies used in Dandaza+">
                {project.technologies.map((tech) => (
                  <span key={tech} className={styles.techPill}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.provenanceNotice}>
              <div className={styles.noticeIcon} aria-hidden="true">
                ✓
              </div>
              <div className={styles.noticeBody}>
                <strong className={styles.noticeTitle}>Authentic Project Asset</strong>
                <p className={styles.noticeText}>
                  Screenshots and workflows above are verified authentic assets from the
                  project codebase. No external demo metrics or mock users have been invented.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
