import { Container } from "@/components/ui/Container";
import { designPrinciples } from "@/data/design";
import styles from "./DesignPrinciples.module.css";

export function DesignPrinciples() {
  return (
    <section className={styles.section} aria-labelledby="design-principles-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>03</span>
            <span className={styles.sectionTagline}>Design Philosophy</span>
          </div>
          <h2 id="design-principles-heading" className={styles.heading}>
            How I Think About Design
          </h2>
          <p className={styles.subheading}>
            Foundational design principles guiding typographic hierarchy, visual weight,
            and interface ergonomics across my work.
          </p>
        </div>

        <div className={styles.grid}>
          {designPrinciples.map((p) => (
            <div key={p.number} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.number}>{p.number}</span>
                <span className={styles.principleTitle}>{p.title}</span>
              </div>
              <h3 className={styles.summary}>{p.summary}</h3>
              <p className={styles.description}>{p.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
