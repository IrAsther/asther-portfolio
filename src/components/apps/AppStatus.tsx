import styles from "./AppStatus.module.css";
import type { AppItem } from "@/data/apps";

interface AppStatusBadgeProps {
  status: string;
  statusType: AppItem["statusType"];
  size?: "sm" | "md";
}

export function AppStatusBadge({
  status,
  statusType,
  size = "md",
}: AppStatusBadgeProps) {
  const typeClass =
    statusType === "showcase"
      ? styles.badgeShowcase
      : statusType === "in-development"
      ? styles.badgeInDevelopment
      : statusType === "prototype"
      ? styles.badgePrototype
      : statusType === "architecture"
      ? styles.badgeArchitecture
      : styles.badgeConcept;

  const sizeClass = size === "sm" ? styles.badgeSm : styles.badgeMd;

  return (
    <span className={`${styles.badge} ${typeClass} ${sizeClass}`}>
      <span className={styles.indicator} aria-hidden="true" />
      <span className={styles.statusText}>{status}</span>
    </span>
  );
}
