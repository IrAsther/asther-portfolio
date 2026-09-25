import { Container } from "@/components/ui/Container";
import { journey } from "@/data/about";
import styles from "./AboutTimeline.module.css";

export function AboutTimeline() {
  return (
    <section className={styles.section} aria-labelledby="timeline-heading">
      <Container className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label} aria-hidden="true">Journey</span>
          <h2 id="timeline-heading" className={styles.heading}>
            My Path
          </h2>
        </div>

        <ol className={styles.timeline} aria-label="Education and learning milestones">
          {journey.map((item) => (
            <li key={item.id} className={styles.item}>
              {/* Vertical line + dot */}
              <div className={styles.track} aria-hidden="true">
                <div className={styles.dot} />
                <div className={styles.line} />
              </div>

              {/* Content */}
              <div className={styles.content}>
                <span className={styles.itemLabel}>{item.label}</span>
                <h3 className={styles.itemTitle}>{item.institution}</h3>
                <p className={styles.itemDesc}>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
