import { Container } from "@/components/ui/Container";
import styles from "./DesignIntro.module.css";

export function DesignIntro() {
  return (
    <section className={styles.section} aria-labelledby="design-intro-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.header}>
            <span className={styles.badge}>Editorial Perspective</span>
            <h2 id="design-intro-heading" className={styles.heading}>
              Design is communication, not decoration.
            </h2>
          </div>
          <div className={styles.bodyGrid}>
            <p className={styles.leadText}>
              In digital products, aesthetics and functionality are deeply intertwined.
              Graphic design is the discipline of structuring information so that people can
              understand, navigate, and act with confidence and clarity.
            </p>
            <p className={styles.subText}>
              Whether crafting high-density financial metrics for a mobile utility, laying out
              a printable academic document, or establishing typographic rhythm for an AI
              assistant, my work prioritizes visual coherence, intentional contrast, and
              human-centered legibility.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
