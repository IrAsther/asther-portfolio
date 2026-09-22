"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import styles from "./MobileNav.module.css";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function MobileNav({ isOpen, onClose, triggerRef }: MobileNavProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Close when pathname changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handle focus trapping, ESC key, scroll locking, and background inactivation
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Capture trigger element for reliable cleanup restoration
    const triggerElement = triggerRef?.current;

    // Inactivate background elements for accessibility
    const mainEl = document.getElementById("main-content");
    const footerEl = document.querySelector("footer");
    const headerEl = document.querySelector("header");

    const setInert = (el: HTMLElement | null, inert: boolean) => {
      if (!el) return;
      if (inert) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    };

    setInert(mainEl, true);
    setInert(footerEl, true);
    setInert(headerEl, true);

    // Focus close button initially with slight delay for mount completion
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on ESC
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap keyboard focus within the drawer
      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: wrap from first to last
          if (document.activeElement === firstElement || !drawerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: wrap from last to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);

      // Restore background accessibility
      setInert(mainEl, false);
      setInert(footerEl, false);
      setInert(headerEl, false);

      // Restore focus to trigger button or previous element
      if (triggerElement) {
        triggerElement.focus();
      } else if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide Drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className={styles.drawerHeader}>
          <div className={styles.brand}>
            <span>{siteConfig.shortBrand}</span>
            <span className={styles.brandDot} aria-hidden="true" />
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile Navigation Links">
          <ul className={styles.navList}>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.drawerFooter}>
          <span className={styles.themePrompt}>Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
