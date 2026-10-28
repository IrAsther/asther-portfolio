"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/siteConfig";
import { Container } from "@/components/ui/Container";
import styles from "./Footer.module.css";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brandLink} aria-label={`${siteConfig.name} - Home`}>
            <Image
              src="/Asther_logo.png"
              alt={`${siteConfig.name} Logo`}
              width={64}
              height={64}
              className={styles.footerLogo}
            />
            <span className={styles.brandName}>{siteConfig.name}</span>
          </Link>
          <span className={styles.title}>{siteConfig.title}</span>
        </div>
        <div className={styles.copy}>
          &copy; {currentYear} {siteConfig.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
