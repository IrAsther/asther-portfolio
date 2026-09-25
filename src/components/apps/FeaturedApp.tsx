import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { AppItem } from "@/data/apps";
import styles from "./FeaturedApp.module.css";

interface FeaturedAppProps {
  app: AppItem;
}

export function FeaturedApp({ app }: FeaturedAppProps) {
  return (
    <section className={styles.section} aria-labelledby="featured-app-heading">
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>01</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="featured-app-heading" className={styles.sectionLabel}>
              {app.name}
            </h2>
          </div>
          <span className={styles.statusText}>{app.status}</span>
        </div>

        {/* Editorial Layout: Content Left, Visual Right */}
        <div className={styles.layout}>
          {/* Left: Copy */}
          <div className={styles.contentCol}>
            <span className={styles.category}>{app.category}</span>

            <p className={styles.description}>{app.description}</p>

            <div className={styles.problemBlock}>
              <span className={styles.blockLabel}>Problem</span>
              <p className={styles.blockText}>{app.problem}</p>
            </div>

            <div className={styles.directionBlock}>
              <span className={styles.blockLabel}>Direction</span>
              <p className={styles.blockText}>{app.direction}</p>
            </div>

            {app.highlights && app.highlights.length > 0 && (
              <div className={styles.highlightsList}>
                {app.highlights.map((item) => (
                  <div key={item} className={styles.highlightItem}>
                    <span className={styles.highlightMark} aria-hidden="true">—</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.techRow}>
              {app.technologies.map((tech) => (
                <span key={tech} className={styles.techItem}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Authentic Screenshot Composition */}
          <div className={styles.mediaCol}>
            <div className={styles.screenshotStage}>
              {/* Primary Screenshot — Tall Mobile Frame */}
              {app.image && (
                <div className={styles.primaryShot}>
                  <div className={styles.shotHeader}>
                    <span className={styles.shotDot} aria-hidden="true" />
                    <span className={styles.shotLabel}>DANDAZA+ // DASHBOARD</span>
                  </div>
                  <div className={styles.shotImageWrap}>
                    <Image
                      src={app.image}
                      alt="Dandaza+ mobile application primary interface"
                      width={720}
                      height={1600}
                      priority
                      className={styles.shotImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 340px"
                    />
                  </div>
                </div>
              )}

              {/* Secondary Screenshot — Overlapping */}
              {app.secondaryImage && (
                <div className={styles.secondaryShot}>
                  <div className={styles.shotHeader}>
                    <span className={styles.shotDot} aria-hidden="true" />
                    <span className={styles.shotLabel}>REPORTS</span>
                  </div>
                  <div className={styles.shotImageWrap}>
                    <Image
                      src={app.secondaryImage}
                      alt="Dandaza+ structured report and records screen"
                      width={720}
                      height={1600}
                      className={styles.shotImage}
                      sizes="(max-width: 768px) 100vw, 220px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
