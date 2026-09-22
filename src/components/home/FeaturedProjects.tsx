import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { featuredProjects } from "@/data/projects";
import styles from "./FeaturedProjects.module.css";

export function FeaturedProjects() {
  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.badge}>Portfolio</span>
            <h2 id="projects-heading" className={styles.heading}>
              Featured Projects
            </h2>
            <p className={styles.subheading}>
              Selected applications and technical systems showcasing practical engineering,
              functional architecture, and interface design.
            </p>
          </div>
          <div className={styles.headerAction}>
            <Button href="/projects" variant="outline" size="md" id="featured-projects-all">
              All Projects
            </Button>
          </div>
        </div>

        <div className={styles.grid}>
          {featuredProjects.map((project) => (
            <article
              key={project.id}
              className={`${styles.card} ${project.isPlaceholder ? styles.cardPlaceholder : ""}`}
            >
              {/* Visual media preview — major visual element */}
              {project.image ? (
                <div className={styles.mediaContainer}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={project.image}
                      alt={`${project.title} mobile interface screenshot`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 360px"
                      className={styles.projectImage}
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.blueprintContainer} aria-hidden="true">
                  <div className={styles.blueprintLines} />
                  <span className={styles.blueprintBadge}>Architecture In Progress</span>
                </div>
              )}

              <div className={styles.cardHeader}>
                <span className={styles.category}>{project.category}</span>
                <span
                  className={`${styles.status} ${
                    project.isPlaceholder ? styles.statusDraft : styles.statusActive
                  }`}
                >
                  {project.isPlaceholder ? `Planned • ${project.status}` : project.status}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.titleRow}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <Link
                    href={project.href || "/projects"}
                    className={styles.projectLink}
                    aria-label={`View details for ${project.title}`}
                  >
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
                <p className={styles.summary}>{project.summary}</p>
              </div>

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

        <div className={styles.mobileAction}>
          <Button href="/projects" variant="outline" size="md">
            View All Projects
          </Button>
        </div>
      </Container>
    </section>
  );
}
