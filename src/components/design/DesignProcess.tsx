import { Container } from "@/components/ui/Container";
import styles from "./DesignProcess.module.css";

interface ProcessStep {
  number: string;
  title: string;
  summary: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    summary: "Find the problem before designing the interface.",
  },
  {
    number: "02",
    title: "Shape",
    summary: "Turn the idea into a clear visual system.",
  },
  {
    number: "03",
    title: "Refine",
    summary: "Remove what is unnecessary and improve the details.",
  },
];

export function DesignProcess() {
  return (
    <section className={styles.section} aria-labelledby="design-process-heading">
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>02</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="design-process-heading" className={styles.sectionLabel}>
              Process
            </h2>
          </div>
          <span className={styles.metaLabel}>APPROACH</span>
        </div>

        {/* 3 Concise Steps */}
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.stepItem}>
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>{step.number}</span>
                <span className={styles.stepDash} aria-hidden="true">—</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
              </div>
              <p className={styles.stepSummary}>{step.summary}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
