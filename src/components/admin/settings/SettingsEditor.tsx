"use client";

import React, { useState } from "react";
import {
  Save,
  Globe,
  Share2,
  Palette,
  Mail,
  CheckCircle,
  Link2,
  Users,
  Camera,
  AtSign,
  MessageCircle,
  Phone,
} from "lucide-react";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Button } from "@/components/ui/Button";
import { initialSettings } from "@/data/adminMockData";
import { AdminSiteSettings } from "@/types/admin";
import styles from "./SettingsEditor.module.css";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Link2,
  linkedin: Users,
  instagram: Camera,
  twitter: AtSign,
  telegram: MessageCircle,
  whatsapp: Phone,
};

export function SettingsEditor() {
  const [settings, setSettings] = useState<AdminSiteSettings>(initialSettings);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const keywords = e.target.value
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    setSettings((prev) => ({
      ...prev,
      seo: { ...prev.seo, keywords },
    }));
  };

  const handleSocialChange = (
    platform: string,
    field: "handle" | "url",
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      socials: prev.socials.map((s) =>
        s.platform === platform ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleAppearanceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      appearance: { ...prev.appearance, [name]: value },
    }));
  };

  const handleSave = () => {
    showFeedback(
      "Site settings validated in local prototype state. (Backend persistence will be connected in next phase)"
    );
  };

  return (
    <div className={styles.settingsLayout}>
      <AdminNotice />

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings & SEO</h1>
          <p className={styles.pageSubtitle}>
            Manage global portfolio identity, SEO metadata, social links, and appearance defaults.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave}>
          <Save size={15} />
          <span>Save in Demo State</span>
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={styles.toastBanner} role="status">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle size={14} />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two-column grid */}
      <div className={styles.settingsGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          {/* Site Identity */}
          <AdminCard
            title="Site Identity"
            subtitle="Core brand information displayed across the portfolio"
            actions={
              <Globe size={14} style={{ color: "var(--color-text-subtle)" }} />
            }
          >
            <div className={styles.formStack}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="siteName">
                    Full Name
                  </label>
                  <input
                    id="siteName"
                    name="siteName"
                    type="text"
                    value={settings.siteName}
                    onChange={handleBasicChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="shortBrand">
                    Brand Short Name
                  </label>
                  <input
                    id="shortBrand"
                    name="shortBrand"
                    type="text"
                    value={settings.shortBrand}
                    onChange={handleBasicChange}
                    className={styles.input}
                    placeholder="e.g. ASTHER"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="title">
                  Professional Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={settings.title}
                  onChange={handleBasicChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="description">
                  Short Bio / Site Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleBasicChange}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="contactEmail">
                    Contact Email
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleBasicChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="affiliation">
                    Affiliation
                  </label>
                  <input
                    id="affiliation"
                    name="affiliation"
                    type="text"
                    value={settings.affiliation}
                    onChange={handleBasicChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* SEO */}
          <AdminCard
            title="SEO Metadata"
            subtitle="Meta tags, Open Graph, and search engine settings"
            actions={
              <span className={styles.seoIndicator}>
                <Globe size={12} />
                <span>Public Visibility</span>
              </span>
            }
          >
            <div className={styles.formStack}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="metaTitle">
                  Meta Title
                </label>
                <input
                  id="metaTitle"
                  name="metaTitle"
                  type="text"
                  value={settings.seo.metaTitle}
                  onChange={handleSeoChange}
                  className={styles.input}
                />
                <span className={styles.hint}>
                  {settings.seo.metaTitle.length}/60 chars recommended
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="metaDescription">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={settings.seo.metaDescription}
                  onChange={handleSeoChange}
                  className={styles.textarea}
                  rows={3}
                />
                <span className={styles.hint}>
                  {settings.seo.metaDescription.length}/160 chars recommended
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="keywords">
                  Keywords (comma-separated)
                </label>
                <textarea
                  id="keywords"
                  name="keywords"
                  value={settings.seo.keywords.join(", ")}
                  onChange={handleKeywordsChange}
                  className={styles.textarea}
                  rows={2}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="ogImageUrl">
                  OG Image URL
                </label>
                <input
                  id="ogImageUrl"
                  name="ogImageUrl"
                  type="text"
                  value={settings.seo.ogImageUrl}
                  onChange={handleSeoChange}
                  className={styles.input}
                  placeholder="/projects/dandaza-screen.webp"
                />
                <span className={styles.hint}>
                  Recommended: 1200×630 px. Used for social sharing previews.
                </span>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Social Links */}
          <AdminCard
            title="Social Channels"
            subtitle="Platform handles and URLs used across the portfolio"
            actions={
              <Share2 size={14} style={{ color: "var(--color-text-subtle)" }} />
            }
          >
            <div className={styles.socialList}>
              {settings.socials.map((social) => {
                const Icon = PLATFORM_ICONS[social.platform] || Mail;
                return (
                  <div key={social.platform} className={styles.socialItem}>
                    <div className={styles.socialPlatformIcon}>
                      <Icon size={15} aria-hidden="true" />
                    </div>
                    <div className={styles.socialFields}>
                      <span className={styles.socialLabel}>{social.label}</span>
                      <input
                        type="text"
                        value={social.handle}
                        onChange={(e) =>
                          handleSocialChange(social.platform, "handle", e.target.value)
                        }
                        className={styles.socialInput}
                        placeholder="Handle / username"
                        aria-label={`${social.label} handle`}
                      />
                      <input
                        type="url"
                        value={social.url}
                        onChange={(e) =>
                          handleSocialChange(social.platform, "url", e.target.value)
                        }
                        className={styles.socialInput}
                        placeholder="https://..."
                        aria-label={`${social.label} URL`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          {/* Appearance */}
          <AdminCard
            title="Appearance Defaults"
            subtitle="Brand colors and theme defaults"
            actions={
              <Palette size={14} style={{ color: "var(--color-text-subtle)" }} />
            }
          >
            <div className={styles.formStack}>
              <div className={styles.colorRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="primaryBrand">
                    Primary Brand
                  </label>
                  <div className={styles.colorInputWrap}>
                    <input
                      id="primaryBrand"
                      name="primaryBrand"
                      type="color"
                      value={settings.appearance.primaryBrand}
                      onChange={handleAppearanceChange}
                      className={styles.colorSwatch}
                    />
                    <input
                      type="text"
                      value={settings.appearance.primaryBrand}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          appearance: {
                            ...prev.appearance,
                            primaryBrand: e.target.value,
                          },
                        }))
                      }
                      className={styles.colorHexInput}
                      placeholder="#01605A"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="accentColor">
                    Accent Color
                  </label>
                  <div className={styles.colorInputWrap}>
                    <input
                      id="accentColor"
                      name="accentColor"
                      type="color"
                      value={settings.appearance.accentColor}
                      onChange={handleAppearanceChange}
                      className={styles.colorSwatch}
                    />
                    <input
                      type="text"
                      value={settings.appearance.accentColor}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          appearance: {
                            ...prev.appearance,
                            accentColor: e.target.value,
                          },
                        }))
                      }
                      className={styles.colorHexInput}
                      placeholder="#FF862D"
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="supportingColor">
                    Supporting
                  </label>
                  <div className={styles.colorInputWrap}>
                    <input
                      id="supportingColor"
                      name="supportingColor"
                      type="color"
                      value={settings.appearance.supportingColor}
                      onChange={handleAppearanceChange}
                      className={styles.colorSwatch}
                    />
                    <input
                      type="text"
                      value={settings.appearance.supportingColor}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          appearance: {
                            ...prev.appearance,
                            supportingColor: e.target.value,
                          },
                        }))
                      }
                      className={styles.colorHexInput}
                      placeholder="#FFD0A8"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="themeDefault">
                  Default Theme
                </label>
                <select
                  id="themeDefault"
                  name="themeDefault"
                  value={settings.appearance.themeDefault}
                  onChange={handleAppearanceChange}
                  className={styles.select}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System (auto-detect)</option>
                </select>
              </div>

              {/* Color preview strip */}
              <div className={styles.colorPreviewStrip}>
                <div
                  className={styles.colorPreviewBlock}
                  style={{ backgroundColor: settings.appearance.primaryBrand }}
                  title={`Primary: ${settings.appearance.primaryBrand}`}
                />
                <div
                  className={styles.colorPreviewBlock}
                  style={{ backgroundColor: settings.appearance.accentColor }}
                  title={`Accent: ${settings.appearance.accentColor}`}
                />
                <div
                  className={styles.colorPreviewBlock}
                  style={{ backgroundColor: settings.appearance.supportingColor }}
                  title={`Supporting: ${settings.appearance.supportingColor}`}
                />
                <span className={styles.colorPreviewHint}>
                  Live color preview
                </span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
