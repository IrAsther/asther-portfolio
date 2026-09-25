import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./DesignSystemGlimpse.module.css";

const swatches = [
  { name: "Deep Teal", hex: "#023341", role: "Primary / Text", colorVar: "var(--brand-deep-teal)" },
  { name: "Bright Orange", hex: "#FD5E02", role: "Accent / Focal", colorVar: "var(--brand-bright-orange)" },
  { name: "Warm Cream", hex: "#FCF5E3", role: "Base Canvas", colorVar: "var(--brand-cream)" },
  { name: "Muted Teal", hex: "#214E5B", role: "Technical Subtext", colorVar: "var(--color-text-muted)" },
];

export function DesignSystemGlimpse() {
  return (
    <section className={styles.section} aria-labelledby="design-system-heading">
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>03</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="design-system-heading" className={styles.sectionLabel}>
              Visual system
            </h2>
          </div>
          <span className={styles.metaLabel}>FOUNDATIONS</span>
        </div>

        {/* 3-Column Architectural Spec Layout */}
        <div className={styles.specGrid}>
          {/* Column 1: Core Color Tokens */}
          <div className={styles.specColumn}>
            <div className={styles.columnHeader}>
              <span className={styles.columnTag}>COLOR PALETTE</span>
            </div>
            <div className={styles.swatchList}>
              {swatches.map((s) => (
                <div key={s.hex} className={styles.swatchRow}>
                  <div
                    className={styles.swatchBlock}
                    style={{ backgroundColor: s.colorVar }}
                    aria-hidden="true"
                  />
                  <div className={styles.swatchInfo}>
                    <span className={styles.swatchName}>{s.name}</span>
                    <span className={styles.swatchHex}>{s.hex}</span>
                  </div>
                  <span className={styles.swatchRole}>{s.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Typography System */}
          <div className={styles.specColumn}>
            <div className={styles.columnHeader}>
              <span className={styles.columnTag}>TYPOGRAPHY</span>
            </div>
            <div className={styles.typeSpec}>
              <div className={styles.typeBlock}>
                <span className={styles.typeRole}>DISPLAY & HEADINGS</span>
                <span className={styles.typeSampleHeading}>Archivo Black</span>
                <span className={styles.typeMeta}>Geometric Display · 400 Weight</span>
              </div>
              <div className={styles.typeDivider} aria-hidden="true" />
              <div className={styles.typeBlock}>
                <span className={styles.typeRole}>BODY & INTERFACE</span>
                <span className={styles.typeSampleBody}>Inter Regular & Medium</span>
                <span className={styles.typeMeta}>Optimized Screen Legibility · 16px Base</span>
              </div>
            </div>
          </div>

          {/* Column 3: Geometric & Architectural Principles */}
          <div className={styles.specColumn}>
            <div className={styles.columnHeader}>
              <span className={styles.columnTag}>GEOMETRY & BRAND</span>
            </div>
            <div className={styles.geometrySpec}>
              <div className={styles.ruleItem}>
                <span className={styles.ruleKey}>RADII</span>
                <span className={styles.ruleVal}>0px — Pure sharp corners</span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleKey}>CADENCE</span>
                <span className={styles.ruleVal}>8px spatial datum grid</span>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.ruleKey}>SEPARATORS</span>
                <span className={styles.ruleVal}>1px technical boundaries</span>
              </div>
              <div className={styles.logoRow}>
                <div className={styles.logoThumb}>
                  <Image
                    src="/Asther_logo.png"
                    alt="Asther monogram logo mark"
                    width={40}
                    height={40}
                    className={styles.logoImg}
                  />
                </div>
                <div className={styles.logoMeta}>
                  <span className={styles.logoTitle}>Asther Monogram</span>
                  <span className={styles.logoSubtitle}>Primary geometric identity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
