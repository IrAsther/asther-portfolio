"use client";

import { useState } from "react";
import { Copy, Check, ArrowUpRight } from "lucide-react";
import { contactConfig, type SocialLink } from "@/data/contact";
import styles from "./ContactInfo.module.css";

/* ── Platform SVG Icons ─────────────────────────────────── */

function GithubIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function PlatformIcon({ platform }: { platform: SocialLink["platform"] }) {
  switch (platform) {
    case "github":    return <GithubIcon />;
    case "linkedin":  return <LinkedInIcon />;
    case "instagram": return <InstagramIcon />;
    case "twitter":   return <XTwitterIcon />;
    case "telegram":  return <TelegramIcon />;
    case "whatsapp":  return <WhatsAppIcon />;
  }
}

/* ── Component ───────────────────────────────────────────── */

export function ContactInfo() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contactConfig.email);
    } catch {
      const el = document.createElement("textarea");
      el.value = contactConfig.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={styles.wrapper}>
      {/* Email — primary */}
      <div className={styles.emailBlock}>
        <span className={styles.channelLabel}>Email</span>
        <a
          href={`mailto:${contactConfig.email}`}
          className={styles.emailValue}
          aria-label={`Send email to ${contactConfig.email}`}
        >
          {contactConfig.email}
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className={styles.copyBtn}
          aria-label={copied ? "Copied" : "Copy email address"}
        >
          {copied ? (
            <><Check size={13} aria-hidden="true" /><span>Copied</span></>
          ) : (
            <><Copy size={13} aria-hidden="true" /><span>Copy</span></>
          )}
        </button>
      </div>

      <div className={styles.divider} aria-hidden="true" />

      {/* All social links */}
      <div className={styles.socialsBlock}>
        <span className={styles.channelLabel}>Elsewhere</span>
        <ul className={styles.socialsList} role="list">
          {contactConfig.socials.map((s) => (
            <li key={s.platform}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={`${s.label} profile (opens in new tab)`}
              >
                <span className={styles.socialIcon}>
                  <PlatformIcon platform={s.platform} />
                </span>
                <span className={styles.socialMeta}>
                  <span className={styles.socialLabel}>{s.label}</span>
                  <span className={styles.socialHandle}>{s.handle}</span>
                </span>
                <ArrowUpRight size={14} className={styles.arrow} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Closing line */}
      <p className={styles.closingLine}>
        Open to meaningful projects and collaborations.
      </p>
    </div>
  );
}
