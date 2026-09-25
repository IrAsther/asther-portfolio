import { Container } from "@/components/ui/Container";
import { AppCard } from "./AppCard";
import type { AppItem } from "@/data/apps";
import styles from "./AppsGrid.module.css";

interface AppsGridProps {
  apps: AppItem[];
}

export function AppsGrid({ apps }: AppsGridProps) {
  return (
    <section className={styles.section} aria-labelledby="apps-grid-heading">
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>02</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="apps-grid-heading" className={styles.sectionLabel}>
              Also building
            </h2>
          </div>
          <span className={styles.metaLabel}>IN DEVELOPMENT</span>
        </div>

        <div className={styles.grid}>
          {apps.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
