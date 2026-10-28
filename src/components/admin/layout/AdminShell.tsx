"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import styles from "./AdminShell.module.css";

interface AdminShellProps {
  children: React.ReactNode;
  adminUser?: {
    id: string;
    email: string | null;
    role: string;
  } | null;
}

export function AdminShell({ children, adminUser }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If navigating back from a post-logout state, detect bfcache restoration and force server re-validation
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  // If viewing the login page, render children cleanly without the admin layout chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className={`${styles.shell} ${mobileMenuOpen ? styles.drawerOpen : ""}`.trim()}>
      {/* Desktop Persistent Sidebar */}
      <div className={styles.desktopSidebarWrap}>
        <AdminSidebar
          adminEmail={adminUser?.email}
          adminRole={adminUser?.role}
        />
      </div>

      {/* Mobile Drawer */}
      <div
        className={styles.drawerOverlay}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <div className={styles.drawerContent}>
        <AdminSidebar
          onNavClick={() => setMobileMenuOpen(false)}
          adminEmail={adminUser?.email}
          adminRole={adminUser?.role}
        />
      </div>

      {/* Main Workspace Area */}
      <div className={styles.mainArea}>
        <AdminTopBar
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          adminEmail={adminUser?.email}
        />
        <main className={styles.contentWrapper}>{children}</main>
      </div>
    </div>
  );
}

