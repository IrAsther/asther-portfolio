"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import styles from "./ProjectExpandedModal.module.css";

interface ProjectExpandedModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectExpandedModal({ project, onClose }: ProjectExpandedModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeView, setActiveView] = useState<"screen" | "report">("screen");

  useEffect(() => {
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.modal} ref={modalRef}>
        {/* Modal Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.statusLine}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span>{project.status}</span>
          </div>

          <button
            ref={closeButtonRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close project modal"
          >
            <span>Close</span>
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles.contentLayout}>
          {/* Visual Column */}
          <div className={styles.visualCol}>
            {project.image ? (
              <div className={styles.imageShowcase}>
                <div className={styles.imageFrame}>
                  <Image
                    src={
                      activeView === "report" && project.secondaryImage
                        ? project.secondaryImage
                        : project.image
                    }
                    alt={`${project.title} screenshot`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className={styles.screenshot}
                  />
                </div>

                {project.secondaryImage && (
                  <div className={styles.viewToggle}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${activeView === "screen" ? styles.toggleBtnActive : ""}`}
                      onClick={() => setActiveView("screen")}
                    >
                      Primary Interface
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${activeView === "report" ? styles.toggleBtnActive : ""}`}
                      onClick={() => setActiveView("report")}
                    >
                      Record Workflow
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.conceptBox}>
                <div className={styles.conceptInitials}>
                  {project.id === "ai-applied-system" ? "ML" : "WEB"}
                </div>
                <p className={styles.conceptCaption}>
                  {project.id === "ai-applied-system"
                    ? "Data ingestion and inference endpoint experiments in Python."
                    : "Accessible component architecture with Next.js and pure CSS Modules."}
                </p>
              </div>
            )}
          </div>

          {/* Text Information Column */}
          <div className={styles.infoCol}>
            <h2 id="modal-project-title" className={styles.title}>
              {project.title}
            </h2>

            <p className={styles.summary}>{project.summary}</p>

            {project.problem && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>The Problem</h3>
                <p className={styles.sectionText}>{project.problem}</p>
              </div>
            )}

            {project.direction && (
              <div className={styles.sectionBlock}>
                <h3 className={styles.sectionHeading}>Technical Approach</h3>
                <p className={styles.sectionText}>{project.direction}</p>
              </div>
            )}

            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>Technologies</h3>
              <p className={styles.techText}>
                {project.technologies.join("  ·  ")}
              </p>
            </div>

            {project.href && project.href !== "/projects" && (
              <div className={styles.linkRow}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  <span>Visit project</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
