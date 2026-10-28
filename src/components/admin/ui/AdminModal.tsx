"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./AdminModal.module.css";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: AdminModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`${styles.modal} ${wide ? styles.wide : ""}`.trim()}
        ref={modalRef}
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>{children}</div>

        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  );
}
