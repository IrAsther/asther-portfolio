import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { AppStatusBadge } from "./AppStatus";
import type { AppItem } from "@/data/apps";
import styles from "./FeaturedApp.module.css";

interface FeaturedAppProps {
  app: AppItem;
}

export function FeaturedApp({ app }: FeaturedAppProps) {
  return (
    <section className={styles.section} aria-labelledby="featured-app-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>01</span>
            <span className={styles.sectionTagline}>Featured Product Showcase</span>
          </div>
          <h2 id="featured-app-heading" className={styles.heading}>
            Flagship Application
          </h2>
          <p className={styles.subheading}>
            Dandaza+ is a verified mobile utility engineered to bring clarity and structure
            to daily activity reporting and organizational data tracking.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Left Column: Product Information & Architectural Insights */}
          <div className={styles.contentColumn}>
            <div className={styles.statusRow}>
              <span className={styles.category}>{app.category}</span>
              <AppStatusBadge status={app.status} statusType={app.statusType} />
            </div>

            <h3 className={styles.appName}>{app.name}</h3>

            <p className={styles.description}>{app.description}</p>

            <div className={styles.insightBox}>
              <h4 className={styles.insightTitle}>Problem & Necessity</h4>
              <p className={styles.insightText}>{app.problem}</p>
            </div>

            <div className={styles.insightBox}>
              <h4 className={styles.insightTitle}>Technical Direction</h4>
              <p className={styles.insightText}>{app.direction}</p>
            </div>

            {app.highlights && app.highlights.length > 0 && (
              <div className={styles.highlightsBlock}>
                <h4 className={styles.highlightsTitle}>Key Capabilities</h4>
                <ul className={styles.highlightsList}>
                  {app.highlights.map((item) => (
                    <li key={item} className={styles.highlightItem}>
                      <span className={styles.highlightDot} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.techSection}>
              <h4 className={styles.techTitle}>Application Stack</h4>
              <div className={styles.techPills} aria-label="Technologies used in Dandaza+">
                {app.technologies.map((tech) => (
                  <span key={tech} className={styles.techPill}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.provenanceNotice}>
              <span className={styles.noticeIcon} aria-hidden="true">✓</span>
              <div className={styles.noticeBody}>
                <strong className={styles.noticeHeading}>Verified Product Evidence</strong>
                <p className={styles.noticeText}>
                  Screenshots shown are authentic captures from the Dandaza+ mobile codebase.
                  No artificial metric counters or mock adoption numbers are used.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Visual Showcase */}
          <div className={styles.mediaColumn}>
            <div className={styles.deviceStage}>
              {/* Primary Screenshot Frame */}
              <div className={styles.primaryFrame}>
                <div className={styles.frameHeader}>
                  <span className={styles.frameDot} aria-hidden="true" />
                  <span className={styles.frameLabel}>Workflow Interface</span>
                </div>
                <div className={styles.imageBox}>
                  {app.image && (
                    <Image
                      src={app.image}
                      alt="Dandaza+ mobile application interface showing primary navigation and utilities"
                      fill
                      priority
                      sizes="(max-width: 639px) 280px, (max-width: 1023px) 300px, 320px"
                      className={styles.screenImage}
                    />
                  )}
                </div>
              </div>

              {/* Secondary Screenshot Frame */}
              {app.secondaryImage && (
                <div className={styles.secondaryFrame}>
                  <div className={styles.frameHeader}>
                    <span className={styles.frameDot} aria-hidden="true" />
                    <span className={styles.frameLabel}>Report & Records</span>
                  </div>
                  <div className={styles.imageBox}>
                    <Image
                      src={app.secondaryImage}
                      alt="Dandaza+ structured report and record management screen"
                      fill
                      sizes="(max-width: 639px) 220px, (max-width: 1023px) 250px, 260px"
                      className={styles.screenImage}
                    />
                  </div>
                </div>
              )}
            </div>

            <p className={styles.mediaCaption}>
              Authentic mobile UI screenshots from Dandaza+
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
