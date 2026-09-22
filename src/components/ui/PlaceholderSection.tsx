import React from "react";
import { Container } from "@/components/ui/Container";
import styles from "./PlaceholderSection.module.css";

interface PlaceholderSectionProps {
  title: string;
  badge?: string;
  description?: string;
}

export function PlaceholderSection({
  title,
  badge = "Phase 1 Foundation",
  description = "This page route structure and design system integration are established. Detailed content will be introduced in subsequent phases.",
}: PlaceholderSectionProps) {
  return (
    <section className={styles.section}>
      <Container>
        {badge && (
          <div className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            <span>{badge}</span>
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </Container>
    </section>
  );
}
