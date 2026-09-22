import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { DesignWork } from "@/data/design";
import styles from "./FeaturedDesign.module.css";

interface FeaturedDesignProps {
  work: DesignWork;
}

export function FeaturedDesign({ work }: FeaturedDesignProps) {
  return (
    <section className={styles.section} aria-labelledby="featured-design-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>01</span>
            <span className={styles.sectionTagline}>Flagship Composition</span>
          </div>
          <h2 id="featured-design-heading" className={styles.heading}>
            Featured Visual Work
          </h2>
          <p className={styles.subheading}>
            Desktop platform interface design for Scholarly ASA—crafting calm conversational
            typography, structured study prompt tiles, and clean visual hierarchy.
          </p>
        </div>

        {/* Large Asymmetric Showcase */}
        <div className={styles.showcase}>
          {/* Visual Canvas with Window Chrome */}
          <div className={styles.canvasFrame}>
            <div className={styles.windowBar} aria-hidden="true">
              <div className={styles.windowDots}>
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <span className={styles.windowTitle}>Scholarly ASA — Interface Design Spec</span>
              <span className={styles.windowResolution}>1600 × 1426 px</span>
            </div>

            <div className={styles.imageContainer}>
              <Image
                src={work.image}
                alt={work.alt}
                width={work.width}
                height={work.height}
                priority
                className={styles.featuredImage}
                sizes="(max-width: 1023px) 100vw, 1120px"
              />
            </div>
          </div>

          {/* Editorial Details Row */}
          <div className={styles.detailsRow}>
            <div className={styles.titleColumn}>
              <span className={styles.category}>{work.category}</span>
              <h3 className={styles.workTitle}>{work.title}</h3>
              <p className={styles.description}>{work.description}</p>
            </div>

            <div className={styles.metaColumn}>
              <div className={styles.metaGroup}>
                <span className={styles.metaLabel}>Design Tools</span>
                <div className={styles.toolsList}>
                  {work.tools.map((tool) => (
                    <span key={tool} className={styles.toolPill}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.metaGroup}>
                <span className={styles.metaLabel}>Asset Verification</span>
                <span className={styles.verifiedNotice}>
                  <span className={styles.checkIcon} aria-hidden="true">✓</span>
                  <span>Authentic user interface specification</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
