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
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>02</span>
            <span className={styles.sectionTagline}>Active Builds</span>
          </div>
          <h2 id="apps-grid-heading" className={styles.heading}>
            More Applications & Product Work
          </h2>
          <p className={styles.subheading}>
            Active platforms and education-technology systems currently in design,
            data schema modeling, and structured development.
          </p>
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
