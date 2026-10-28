import React from "react";
import styles from "./AdminCard.module.css";

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
}: AdminCardProps) {
  return (
    <div className={`${styles.card} ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleGroup}>
            {title && <h3 className={styles.cardTitle}>{title}</h3>}
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.cardActions}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
