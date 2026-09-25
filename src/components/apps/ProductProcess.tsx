import { Container } from "@/components/ui/Container";
import { productProcess } from "@/data/apps";
import styles from "./ProductProcess.module.css";

export function ProductProcess() {
  return (
    <section className={styles.section} aria-labelledby="product-process-heading">
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>03</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="product-process-heading" className={styles.sectionLabel}>
              How I build
            </h2>
          </div>
          <span className={styles.metaLabel}>ENGINEERING</span>
        </div>

        {/* 4-column horizontal process */}
        <div className={styles.stepsGrid}>
          {productProcess.map((stage) => (
            <div key={stage.step} className={styles.step}>
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>{stage.step}</span>
                <span className={styles.stepDash} aria-hidden="true">—</span>
                <h3 className={styles.stepTitle}>{stage.title}</h3>
              </div>
              <p className={styles.stepSummary}>{stage.summary}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
