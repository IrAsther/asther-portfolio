import type { AppItem } from "@/data/apps";
import styles from "./AppCard.module.css";

interface AppCardProps {
  app: AppItem;
  index: number;
}

export function AppCard({ app, index }: AppCardProps) {
  const indexStr = String(index + 2).padStart(2, "0");

  return (
    <article className={styles.card} aria-labelledby={`app-title-${app.id}`}>
      {/* Card Top: Index + Status */}
      <div className={styles.cardTop}>
        <span className={styles.cardIndex}>{indexStr}</span>
        <span className={styles.statusLabel}>{app.status}</span>
      </div>

      {/* Blueprint Visual — Honest architectural abstraction for apps without screenshots */}
      <div className={styles.blueprintArea} aria-hidden="true">
        <div className={styles.blueprintGrid} />
        <div className={styles.blueprintLines}>
          <div className={styles.bpLine} />
          <div className={styles.bpLine} />
          <div className={styles.bpLine} />
        </div>
        <div className={styles.blueprintCenter}>
          <span className={styles.bpTag}>{app.category.toUpperCase()}</span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <span className={styles.category}>{app.category}</span>

        <h3 id={`app-title-${app.id}`} className={styles.title}>
          {app.name}
        </h3>

        <p className={styles.description}>{app.description}</p>

        {/* Highlights — short dash list */}
        {app.highlights && app.highlights.length > 0 && (
          <div className={styles.highlights}>
            {app.highlights.map((item) => (
              <div key={item} className={styles.highlightItem}>
                <span className={styles.highlightMark} aria-hidden="true">—</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Tech tags — inline plain text */}
      <div className={styles.cardFoot}>
        <div className={styles.techList} aria-label={`Technologies in ${app.name}`}>
          {app.technologies.map((tech, i) => (
            <span key={tech} className={styles.techItem}>
              {tech}{i < app.technologies.length - 1 && <span className={styles.techSep} aria-hidden="true"> · </span>}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

