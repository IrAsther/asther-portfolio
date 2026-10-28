import React from "react";
import { Info } from "lucide-react";
import styles from "./AdminNotice.module.css";

interface AdminNoticeProps {
  title?: string;
  message?: string;
  className?: string;
}

export function AdminNotice({
  title = "Frontend Prototype Mode",
  message = "This admin interface operates strictly on client-side state. Changes and actions reflect locally for demonstration and are not saved permanently until the backend phase is implemented.",
  className = "",
}: AdminNoticeProps) {
  return (
    <aside className={`${styles.notice} ${className}`.trim()} aria-label="Prototype notice">
      <div className={styles.iconWrap} aria-hidden="true">
        <Info size={16} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          {title}
          <span className={styles.tag}>DEMO STATE ONLY</span>
        </div>
        <p className={styles.description}>{message}</p>
      </div>
    </aside>
  );
}
