"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Layers,
  Palette,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import styles from "./AdminSidebar.module.css";

interface AdminSidebarProps {
  onNavClick?: () => void;
  adminEmail?: string | null;
  adminRole?: string | null;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  count?: string;
}

export function AdminSidebar({
  onNavClick,
  adminEmail,
  adminRole = "Administrator",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, startLogoutTransition] = React.useTransition();

  const handleLogout = () => {
    startLogoutTransition(async () => {
      await logoutAction();
    });
  };

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: LayoutDashboard,
          exact: true,
        },
      ],
    },
    {
      title: "PORTFOLIO CONTENT",
      items: [
        {
          label: "Projects",
          href: "/admin/projects",
          icon: FolderGit2,
        },
        {
          label: "Applications",
          href: "/admin/apps",
          icon: Layers,
        },
        {
          label: "Designs",
          href: "/admin/designs",
          icon: Palette,
        },
        {
          label: "Bio & Resume",
          href: "/admin/content",
          icon: FileText,
        },
        {
          label: "Media Library",
          href: "/admin/media",
          icon: ImageIcon,
        },
      ],
    },
    {
      title: "COMMUNICATION",
      items: [
        {
          label: "Messages",
          href: "/admin/messages",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        {
          label: "Settings & SEO",
          href: "/admin/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar} aria-label="Admin Navigation">
      {/* Brand area */}
      <Link href="/admin" className={styles.brandArea}>
        <Image
          src="/Asther_logo.png"
          alt="Asther Monogram"
          width={34}
          height={34}
          className={styles.brandLogo}
        />
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>ASTHER</span>
          <span className={styles.brandSubtitle}>Control Panel</span>
        </div>
      </Link>

      {/* Navigation container */}
      <nav className={styles.navContainer}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.sectionGroup}>
            <h4 className={styles.sectionTitle}>{section.title}</h4>
            <ul className={styles.navList}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                      onClick={onNavClick}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
                      <div className={styles.navLinkLeft}>
                        <Icon size={16} className={styles.navIcon} aria-hidden="true" />
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span className={styles.itemBadge}>{item.count}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer area */}
      <div className={styles.sidebarFooter}>
        <Link href="/" target="_blank" className={styles.publicLink} rel="noopener noreferrer">
          <span>View Public Site</span>
          <ExternalLink size={13} aria-hidden="true" />
        </Link>
        <div className={styles.userRow}>
          <div className={styles.userAvatar}>
            {adminEmail ? adminEmail.charAt(0).toUpperCase() : "A"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName} title={adminEmail ?? "Asther Irakaza"}>
              {adminEmail ? adminEmail.split("@")[0] : "Asther Irakaza"}
            </span>
            <span className={styles.userRole}>{adminRole}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={styles.logoutBtn}
            title="Sign out of Admin Dashboard"
            aria-label="Sign out"
          >
            {isLoggingOut ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <LogOut size={14} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
