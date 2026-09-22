import { Container } from "@/components/ui/Container";
import { productProcess } from "@/data/apps";
import styles from "./ProductProcess.module.css";

export function ProductProcess() {
  return (
    <section className={styles.section} aria-labelledby="product-process-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>03</span>
            <span className={styles.sectionTagline}>Engineering Philosophy</span>
          </div>
          <h2 id="product-process-heading" className={styles.heading}>
            From Problem to Product
          </h2>
          <p className={styles.subheading}>
            How I approach building software applications—prioritizing genuine utility,
            disciplined architectural choices, and human-centered problem solving.
          </p>
        </div>

        <div className={styles.timeline}>
          {productProcess.map((stage) => (
            <div key={stage.step} className={styles.stageCard}>
              <div className={styles.stageTop}>
                <span className={styles.stepNumber}>{stage.step}</span>
                <span className={styles.stepTitle}>{stage.title}</span>
              </div>
              <h3 className={styles.stageSummary}>{stage.summary}</h3>
              <p className={styles.stageDescription}>{stage.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
