import { Container } from "@/components/ui/Container";
import { values } from "@/data/about";
import styles from "./ValuesMission.module.css";

export function ValuesMission() {
  return (
    <section className={styles.section} aria-labelledby="values-heading">
      <Container className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel} aria-hidden="true">
            06 — Values & Mission
          </span>
          <h2 id="values-heading" className={styles.heading}>
            Why I Build
          </h2>
          <p className={styles.subheading}>
            Technology should solve real problems and create practical impact.
            These are the principles that guide how I approach software,
            design, and learning.
          </p>
        </div>

        {/* Values list */}
        <div className={styles.valuesGrid} role="list">
          {values.map((value, index) => (
            <div key={value.title} className={styles.valueItem} role="listitem">
              <span className={styles.valueNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.valueDivider} aria-hidden="true" />
              <div className={styles.valueBody}>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
