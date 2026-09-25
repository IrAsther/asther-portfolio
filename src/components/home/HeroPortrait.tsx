"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

/**
 * HeroPortrait — premium framed portrait with:
 * - Blurred ghost layer for depth
 * - Polygon clip-path frame (architectural, zero radius)
 * - Mouse parallax (max 8px)
 * - Floating idle animation
 * - Accent lines and grid overlay
 */
export function HeroPortrait() {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const accentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bail out for users who prefer reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const stage = stageRef.current;
    if (!stage) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const MAX = 8; // px

    const onMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Normalise to -1 … +1
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      targetX = nx * MAX;
      targetY = ny * MAX;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (frameRef.current) {
        frameRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      // Ghost moves slightly opposite for depth
      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${-currentX * 0.4}px, ${-currentY * 0.4}px)`;
      }
      // Accents move subtly
      if (accentsRef.current) {
        accentsRef.current.style.transform = `translate(${currentX * 0.6}px, ${currentY * 0.6}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    // Attach to window so parallax works even off-stage
    window.addEventListener("mousemove", onMouseMove);
    stage.addEventListener("mouseleave", onMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      stage.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles.portraitStage} ref={stageRef} aria-hidden="false">

      {/* ── Layer 0: Technical grid background ── */}
      <div className={styles.portraitGrid} aria-hidden="true" />

      {/* ── Layer 0b: Accent gradient halo ── */}
      <div className={styles.portraitHalo} aria-hidden="true" />

      {/* ── Layer 1: Blurred ghost portrait (depth) ── */}
      <div className={styles.portraitGhost} ref={ghostRef} aria-hidden="true">
        <Image
          src="/hero-portrait-transparent.webp"
          alt=""
          width={516}
          height={484}
          className={styles.ghostImage}
          sizes="(max-width: 479px) 220px, (max-width: 767px) 280px, 420px"
        />
      </div>

      {/* ── Layer 2: Main portrait inside polygon frame ── */}
      <div className={styles.portraitFrame} ref={frameRef}>
        {/* Top-right corner bracket */}
        <div className={styles.cornerTR} aria-hidden="true" />
        {/* Bottom-left corner bracket */}
        <div className={styles.cornerBL} aria-hidden="true" />

        {/* Clipped image */}
        <div className={styles.clipContainer}>
          <Image
            src="/hero-portrait-transparent.webp"
            alt="Asther Irakaza — Software Developer"
            width={516}
            height={484}
            priority
            className={styles.portraitFigure}
            sizes="(max-width: 479px) 240px, (max-width: 767px) 290px, (max-width: 1023px) 340px, 440px"
          />
        </div>
      </div>

      {/* ── Layer 3: Accent lines (2 only) ── */}
      <div className={styles.accentLines} ref={accentsRef} aria-hidden="true">
        <span className={styles.accentH1} />
        <span className={styles.accentH2} />
      </div>

    </div>
  );
}
