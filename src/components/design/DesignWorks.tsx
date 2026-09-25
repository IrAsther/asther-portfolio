import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./DesignWorks.module.css";

interface VisualWork {
  id: string;
  name: string;
  category: "UI Design" | "Editorial Layout" | "Visual Systems" | "Brand Identity";
  image: string;
  width: number;
  height: number;
  alt: string;
  large?: boolean;
}

const selectedWorks: VisualWork[] = [
  {
    id: "scholarly-asa",
    name: "Scholarly ASA",
    category: "UI Design",
    image: "/design/scholarly-asa-ui.jpg",
    width: 1600,
    height: 1426,
    alt: "Scholarly ASA desktop web application interface",
    large: true,
  },
  {
    id: "dandaza-dashboard",
    name: "Dandaza+ Dashboard",
    category: "UI Design",
    image: "/design/dandaza-dashboard-ui.png",
    width: 720,
    height: 1600,
    alt: "Dandaza+ mobile application operational dashboard",
  },
  {
    id: "dandaza-report",
    name: "Dandaza+ Business Report",
    category: "Editorial Layout",
    image: "/design/ui-preview-2.png",
    width: 720,
    height: 1600,
    alt: "Dandaza+ structured typographic document and invoice layout",
  },
  {
    id: "geometric-pattern",
    name: "Geometric Arc Study",
    category: "Visual Systems",
    image: "/design/pattern-2.jpg",
    width: 736,
    height: 1104,
    alt: "Geometric modular arc composition in brand palette",
  },
  {
    id: "dandaza-brand",
    name: "Dandaza+ Mark",
    category: "Brand Identity",
    image: "/design/dandaza-logo.png",
    width: 720,
    height: 1600,
    alt: "Dandaza+ brand identity mark and mobile app icon",
  },
];

export function DesignWorks() {
  const primaryWork = selectedWorks[0];
  const supportingWorks = selectedWorks.slice(1);

  return (
    <section
      id="selected-design"
      className={styles.section}
      aria-labelledby="selected-design-heading"
    >
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>01</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="selected-design-heading" className={styles.sectionLabel}>
              Selected design
            </h2>
          </div>
          <span className={styles.metaCount}>5 WORKS</span>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className={styles.grid}>
          {/* Primary Featured Visual — Full Width Anchor */}
          <article className={styles.primaryItem}>
            <div className={styles.imageContainerPrimary}>
              <Image
                src={primaryWork.image}
                alt={primaryWork.alt}
                width={primaryWork.width}
                height={primaryWork.height}
                className={styles.workImage}
                sizes="(max-width: 1200px) 100vw, 1140px"
              />
            </div>
            <div className={styles.captionRow}>
              <h3 className={styles.workName}>{primaryWork.name}</h3>
              <span className={styles.workCategory}>{primaryWork.category}</span>
            </div>
          </article>

          {/* Thin Architectural Separator */}
          <div className={styles.gridSeparator} aria-hidden="true" />

          {/* Supporting Visuals — 4-Column Editorial Rhythm */}
          <div className={styles.supportingGrid}>
            {supportingWorks.map((work) => (
              <article key={work.id} className={styles.supportingItem}>
                <div className={styles.imageContainerSupporting}>
                  <Image
                    src={work.image}
                    alt={work.alt}
                    width={work.width}
                    height={work.height}
                    className={styles.workImage}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
                  />
                </div>
                <div className={styles.captionRow}>
                  <h3 className={styles.workNameSmall}>{work.name}</h3>
                  <span className={styles.workCategory}>{work.category}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
