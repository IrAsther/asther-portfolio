import { Container } from "@/components/ui/Container";
import { journey } from "@/data/about";
import styles from "./Journey.module.css";

export function Journey() {
  return (
    <section className={styles.section} aria-labelledby="journey-heading">
      <Container className={styles.inner}>
        {/* Section header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel} aria-hidden="true">
            02 — My Journey
          </span>
          <h2 id="journey-heading" className={styles.heading}>
            My Journey
          </h2>
          <p className={styles.subheading}>
            The path from secondary education through technology studies to
            computer science and AI exploration.
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div
          className={styles.timeline}
          role="list"
          aria-label="Educational and professional milestones"
        >
          {/* Connecting line — decorative */}
          <div className={styles.timelineLine} aria-hidden="true" />

          {journey.map((milestone, index) => (
            <div
              key={milestone.id}
              className={styles.milestone}
              role="listitem"
            >
              {/* Marker */}
              <div className={styles.markerGroup} aria-hidden="true">
                <div className={styles.markerDot} />
                <span className={styles.markerNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className={styles.milestoneContent}>
                <span className={styles.milestoneLabel}>
                  {milestone.label}
                </span>
                <h3 className={styles.milestoneInstitution}>
                  {milestone.institution}
                </h3>
                <p className={styles.milestoneDesc}>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
