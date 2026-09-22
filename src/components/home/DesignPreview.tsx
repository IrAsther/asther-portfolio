import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./DesignPreview.module.css";

export function DesignPreview() {
  return (
    <section className={styles.section} aria-labelledby="design-heading">
      <Container>
        <div className={styles.grid}>
          {/* Text column */}
          <div className={styles.textCol}>
            <span className={styles.badge}>Creative Practice</span>
            <h2 id="design-heading" className={styles.heading}>
              Visual Craft &amp; Graphic Design
            </h2>
            <p className={styles.description}>
              Good software is both functionally resilient and visually coherent. Alongside software
              engineering, my design practice explores visual identity systems, layout design, and
              digital graphics.
            </p>
            <div className={styles.highlights}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightTitle}>Visual Identity</span>
                <span className={styles.highlightText}>
                  Geometric precision, distinct color systems, and typographic discipline.
                </span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightTitle}>Interface Layouts</span>
                <span className={styles.highlightText}>
                  Structured information hierarchy and intuitive mobile-first compositions.
                </span>
              </div>
            </div>
            <div className={styles.ctaRow}>
              <Button href="/design" variant="primary" size="md" id="design-preview-cta">
                Explore Design Gallery
              </Button>
            </div>
          </div>

          {/* Visual Showcase column */}
          <div className={styles.visualCol}>
            <div className={styles.showcaseGrid}>
              <div className={styles.imageCard}>
                <div className={styles.imageWrap}>
                  <Image
                    src="/design/pattern-1.jpg"
                    alt="Authentic visual pattern and color exploration"
                    fill
                    sizes="(max-width: 767px) 100vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <span className={styles.caption}>Visual Exploration</span>
              </div>

              <div className={styles.imageCard}>
                <div className={styles.imageWrap}>
                  <Image
                    src="/design/pattern-2.jpg"
                    alt="Graphic texture and brand identity motif"
                    fill
                    sizes="(max-width: 767px) 100vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <span className={styles.caption}>Brand Pattern Study</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
