import React from "react";
import styles from "./AdminBadge.module.css";

export type AdminBadgeVariant = "published" | "draft" | "featured" | "active" | "archived";

interface AdminBadgeProps {
  label: string;
  variant?: AdminBadgeVariant;
  showDot?: boolean;
  className?: string;
}

export function AdminBadge({
  label,
  variant = "draft",
  showDot = true,
  className = "",
}: AdminBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`.trim()}>
      {showDot && <span className={styles.indicator} aria-hidden="true" />}
      {label}
    </span>
  );
}
