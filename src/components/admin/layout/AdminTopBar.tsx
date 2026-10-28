"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./AdminTopBar.module.css";

interface AdminTopBarProps {
  onMobileMenuToggle: () => void;
  adminEmail?: string | null;
}

export function AdminTopBar({ onMobileMenuToggle, adminEmail }: AdminTopBarProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from URL pathname
  const segments = pathname?.split("/").filter(Boolean) || ["admin"];
  
  const getBreadcrumbLabel = (seg: string) => {
    switch (seg) {
      case "admin": return "Dashboard";
      case "projects": return "Projects";
      case "apps": return "Applications";
      case "content": return "Content & Bio";
      case "media": return "Media Library";
      case "settings": return "Settings";
      case "new": return "New";
      case "edit": return "Edit";
      default: return seg;
    }
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          onClick={onMobileMenuToggle}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <nav aria-label="Breadcrumbs" className={styles.breadcrumbs}>
          <Link href="/admin" className={styles.crumbItem}>
            Admin
          </Link>
          {segments.length > 1 && (
            <>
              <span className={styles.crumbSeparator} aria-hidden="true">
                <ChevronRight size={12} />
              </span>
              <span className={styles.crumbCurrent}>
                {getBreadcrumbLabel(segments[1])}
              </span>
            </>
          )}
          {segments.length > 2 && (
            <>
              <span className={styles.crumbSeparator} aria-hidden="true">
                <ChevronRight size={12} />
              </span>
              <span className={styles.crumbCurrent}>
                {getBreadcrumbLabel(segments[2])}
              </span>
            </>
          )}
        </nav>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.prototypeBadge} title="Running in frontend prototype mode">
          <span className={styles.pulseDot} aria-hidden="true" />
          <span>Demo State</span>
        </div>

        <ThemeToggle />

        <div className={styles.profileMenu} title={adminEmail ? `Logged in as ${adminEmail}` : "Administrator profile"}>
          <span className={styles.userDot} aria-hidden="true" />
          <span>{adminEmail ? adminEmail.split("@")[0] : "Asther"}</span>
        </div>
      </div>
    </header>
  );
}
