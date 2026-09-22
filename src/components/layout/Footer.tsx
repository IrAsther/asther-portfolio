import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { Container } from "@/components/ui/Container";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandGroup}>
          <span className={styles.brandName}>{siteConfig.name}</span>
          <span className={styles.title}>{siteConfig.title}</span>
        </div>
        <div className={styles.copy}>
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
