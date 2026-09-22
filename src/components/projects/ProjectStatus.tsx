import styles from "./ProjectStatus.module.css";

interface ProjectStatusBadgeProps {
  status: string;
  statusType?: "showcase" | "active" | "architecture" | "planned";
  size?: "sm" | "md";
}

export function ProjectStatusBadge({
  status,
  statusType = "showcase",
  size = "md",
}: ProjectStatusBadgeProps) {
  const typeClass =
    statusType === "showcase"
      ? styles.badgeShowcase
      : statusType === "active"
      ? styles.badgeActive
      : statusType === "architecture"
      ? styles.badgeArchitecture
      : styles.badgePlanned;

  const sizeClass = size === "sm" ? styles.badgeSm : styles.badgeMd;

  return (
    <span className={`${styles.badge} ${typeClass} ${sizeClass}`}>
      <span className={styles.indicator} aria-hidden="true" />
      <span className={styles.statusText}>{status}</span>
    </span>
  );
}

export function ProjectStatusGuide() {
  const tiers = [
    {
      label: "Project Showcase",
      statusType: "showcase" as const,
      summary: "Functional application builds",
      detail:
        "Verified software and digital tools featuring authentic user interfaces, working workflows, and confirmed system assets.",
    },
    {
      label: "Architecture In Progress",
      statusType: "architecture" as const,
      summary: "Active technical design",
      detail:
        "Engineered system architectures, model pipelines, and technical specifications currently undergoing design and structured documentation.",
    },
    {
      label: "Planned Builds",
      statusType: "planned" as const,
      summary: "Formulated roadmaps",
      detail:
        "Formulated problem statements and architectural blueprints scheduled for implementation in upcoming development cycles.",
    },
  ];

  return (
    <section className={styles.guideSection} aria-labelledby="status-guide-heading">
      <div className={styles.guideCard}>
        <div className={styles.guideHeader}>
          <span className={styles.guideBadge}>Methodology</span>
          <h2 id="status-guide-heading" className={styles.guideHeading}>
            Engineering Transparency & Project Status
          </h2>
          <p className={styles.guideDescription}>
            Every entry in this portfolio maintains honest distinction between active showcases,
            in-progress system architectures, and planned technical builds.
          </p>
        </div>

        <div className={styles.tiersGrid}>
          {tiers.map((tier) => (
            <div key={tier.label} className={styles.tierCard}>
              <div className={styles.tierTop}>
                <ProjectStatusBadge
                  status={tier.label}
                  statusType={tier.statusType}
                  size="sm"
                />
              </div>
              <h3 className={styles.tierSummary}>{tier.summary}</h3>
              <p className={styles.tierDetail}>{tier.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
