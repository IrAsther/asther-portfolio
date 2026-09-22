import { AppStatusBadge } from "./AppStatus";
import type { AppItem } from "@/data/apps";
import styles from "./AppCard.module.css";

interface AppCardProps {
  app: AppItem;
  index: number;
}

export function AppCard({ app, index }: AppCardProps) {
  const indexStr = String(index + 1).padStart(2, "0");

  return (
    <article
      className={styles.card}
      aria-labelledby={`app-title-${app.id}`}
    >
      {/* Blueprint Visual Header — Honest architectural abstraction */}
      <div className={styles.blueprintContainer} aria-hidden="true">
        <div className={styles.blueprintGrid} />
        <div className={styles.blueprintOverlay}>
          <span className={styles.blueprintTag}>APP-{indexStr}</span>
          <span className={styles.blueprintScope}>{app.category}</span>
        </div>
      </div>

      {/* Header: Category & Status */}
      <div className={styles.cardHeader}>
        <span className={styles.category}>{app.category}</span>
        <AppStatusBadge status={app.status} statusType={app.statusType} size="sm" />
      </div>

      {/* Body: Title, Description, Problem & Highlights */}
      <div className={styles.cardBody}>
        <h3 id={`app-title-${app.id}`} className={styles.title}>
          {app.name}
        </h3>

        <p className={styles.description}>{app.description}</p>

        <div className={styles.problemBox}>
          <span className={styles.problemLabel}>Problem Context</span>
          <p className={styles.problemText}>{app.problem}</p>
        </div>

        {app.highlights && app.highlights.length > 0 && (
          <div className={styles.highlightsBox}>
            <span className={styles.highlightsLabel}>Focus Capabilities</span>
            <ul className={styles.highlightsList}>
              {app.highlights.map((item) => (
                <li key={item} className={styles.highlightItem}>
                  <span className={styles.dot} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer: Tech Stack Pills */}
      <div className={styles.cardFooter}>
        <div className={styles.tags} aria-label={`Technologies in ${app.name}`}>
          {app.technologies.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
