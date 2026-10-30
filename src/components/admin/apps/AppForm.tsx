"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Image as ImageIcon, Plus, Sparkles } from "lucide-react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/media/ImageUploader";
import { AdminApp, AppStatusType } from "@/types/admin";
import {
  createAppAction,
  updateAppAction,
  type AppInput,
} from "@/lib/actions/apps";
import styles from "./AppForm.module.css";

interface AppFormProps {
  initialData?: AdminApp;
  isEditing?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AppForm({ initialData, isEditing = false }: AppFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<AdminApp>>(
    initialData || {
      name: "",
      slug: "",
      category: "Mobile & Digital Utility",
      description: "",
      problem: "",
      direction: "",
      technologies: ["TypeScript"],
      highlights: [],
      status: "Live / Showcase",
      statusType: "showcase" as AppStatusType,
      published: false,
      featured: false,
      image: "/projects/dandaza-screen.webp",
      secondaryImage: "",
      demoUrl: "",
      downloadUrl: "",
      githubUrl: "",
      sortOrder: 0,
    }
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [techInput, setTechInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: value };
      if (!slugManuallyEdited && !isEditing) {
        updated.slug = slugify(value);
      }
      return updated;
    });

    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    const value = slugify(e.target.value);
    setFormData((prev) => ({ ...prev, slug: value }));
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleAutoGenerateSlug = () => {
    if (formData.name) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name || "") }));
      if (errors.slug) {
        setErrors((prev) => ({ ...prev, slug: "" }));
      }
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sortOrder" ? (value === "" ? 0 : parseInt(value, 10)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      const tech = techInput.trim();
      if (!formData.technologies?.includes(tech)) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...(prev.technologies || []), tech],
        }));
      }
      setTechInput("");
    }
  };

  const handleAddTechClick = () => {
    if (techInput.trim()) {
      const tech = techInput.trim();
      if (!formData.technologies?.includes(tech)) {
        setFormData((prev) => ({
          ...prev,
          technologies: [...(prev.technologies || []), tech],
        }));
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((t) => t !== techToRemove),
    }));
  };

  const handleAddHighlight = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && highlightInput.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const handleAddHighlightClick = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Application name is required.";
    if (!formData.slug?.trim()) newErrors.slug = "URL slug is required.";
    if (!formData.category?.trim()) newErrors.category = "Category is required.";
    if (!formData.description?.trim())
      newErrors.description = "Application description is required.";
    if (!formData.status?.trim()) newErrors.status = "Status label is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFeedback({
        type: "error",
        message: "Please fill in all required fields marked with an asterisk (*).",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload: AppInput = {
      name: formData.name!.trim(),
      slug: formData.slug!.trim().toLowerCase(),
      category: formData.category!.trim(),
      description: formData.description!.trim(),
      problem: formData.problem?.trim() || "",
      direction: formData.direction?.trim() || "",
      technologies: formData.technologies || [],
      highlights: formData.highlights || [],
      status: formData.status!.trim(),
      statusType: (formData.statusType as AppStatusType) || "concept",
      published: Boolean(formData.published),
      featured: Boolean(formData.featured),
      demoUrl: formData.demoUrl?.trim() || "",
      downloadUrl: formData.downloadUrl?.trim() || "",
      githubUrl: formData.githubUrl?.trim() || "",
      image: formData.image?.trim() || "",
      secondaryImage: formData.secondaryImage?.trim() || "",
      sortOrder: typeof formData.sortOrder === "number" ? formData.sortOrder : 0,
    };

    try {
      let result;
      if (isEditing && initialData?.id) {
        result = await updateAppAction(initialData.id, payload);
      } else {
        result = await createAppAction(payload);
      }

      if (!result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        }
        setFeedback({
          type: "error",
          message: result.error || "An error occurred while saving the application.",
        });
        setIsSubmitting(false);
        return;
      }

      setFeedback({
        type: "success",
        message: isEditing
          ? `Application "${payload.name}" updated successfully.`
          : `Application "${payload.name}" created successfully. Redirecting...`,
      });

      setTimeout(() => {
        router.push("/admin/apps");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("[AppForm] Error during submission:", err);
      setFeedback({
        type: "error",
        message: "An unexpected error occurred while communicating with the server.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formLayout}>
      {/* Header bar */}
      <div className={styles.formHeader}>
        <div className={styles.titleGroup}>
          <Link
            href="/admin/apps"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.8125rem",
              color: "var(--color-text-subtle)",
              textDecoration: "none",
              marginBottom: "4px",
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Applications</span>
          </Link>
          <h1 className={styles.formTitle}>
            {isEditing
              ? `Edit Application: ${initialData?.name}`
              : "Create New Application"}
          </h1>
          <p className={styles.formSubtitle}>
            Configure application metadata, highlights, links, and public display settings.
          </p>
        </div>

        <div className={styles.topActions}>
          <Button href="/admin/apps" variant="outline" size="sm">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            <Save size={15} />
            <span>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Application"}
            </span>
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={styles.toastBanner}
          role="status"
          style={{
            borderColor: feedback.type === "error" ? "#E53E3E" : "#01605A",
            backgroundColor:
              feedback.type === "error"
                ? "rgba(229, 62, 62, 0.1)"
                : "rgba(1, 96, 90, 0.12)",
            color: feedback.type === "error" ? "#E53E3E" : "#01605A",
          }}
        >
          <span>{feedback.message}</span>
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

      {/* Grid: Form (Left) & Preview (Right) */}
      <form onSubmit={handleSubmit} className={styles.gridArea}>
        {/* Form Column */}
        <div className={styles.formBody}>
          <AdminCard title="Core Information">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="name">
                Application Name <span className={styles.required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleNameChange}
                placeholder="e.g. Dandaza+, Scholarly ASA"
                className={styles.input}
                disabled={isSubmitting}
                required
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name}</span>
              )}
            </div>

            <div className={styles.fieldRow} style={{ marginTop: "16px" }}>
              <div className={styles.fieldGroup}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className={styles.label} htmlFor="slug">
                    URL Slug <span className={styles.required}>*</span>
                  </label>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleAutoGenerateSlug}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-text-subtle)",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title="Generate slug from name"
                    >
                      <Sparkles size={12} />
                      <span>Auto</span>
                    </button>
                  )}
                </div>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug || ""}
                  onChange={handleSlugChange}
                  placeholder="e.g. dandaza-plus"
                  className={styles.input}
                  disabled={isSubmitting}
                  required
                />
                {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="category">
                  Category <span className={styles.required}>*</span>
                </label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category || ""}
                  onChange={handleTextChange}
                  placeholder="e.g. Mobile & Digital Utility, EdTech Platform"
                  className={styles.input}
                  disabled={isSubmitting}
                  required
                />
                {errors.category && (
                  <span className={styles.errorText}>{errors.category}</span>
                )}
              </div>
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: "16px" }}>
              <label className={styles.label} htmlFor="description">
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleTextChange}
                placeholder="Clear overview explaining the application's purpose and scope..."
                className={styles.textarea}
                disabled={isSubmitting}
                required
              />
              {errors.description && (
                <span className={styles.errorText}>{errors.description}</span>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Problem & Engineering Direction">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="problem">
                Problem Statement
              </label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem || ""}
                onChange={handleTextChange}
                placeholder="What real-world problem or user friction does this application address?"
                className={styles.textarea}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: "16px" }}>
              <label className={styles.label} htmlFor="direction">
                Engineering Direction
              </label>
              <textarea
                id="direction"
                name="direction"
                value={formData.direction || ""}
                onChange={handleTextChange}
                placeholder="Technical approach, stack rationale, architecture decisions..."
                className={styles.textarea}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: "16px" }}>
              <label className={styles.label} htmlFor="tech">
                Technologies (Type and press Enter)
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  id="tech"
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  placeholder="e.g. Next.js, Supabase, React Native"
                  className={styles.input}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddTechClick}
                  disabled={isSubmitting || !techInput.trim()}
                  style={{
                    padding: "0 14px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xs)",
                    color: "var(--color-text)",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                  }}
                >
                  Add
                </button>
              </div>
              <div className={styles.tagList}>
                {formData.technologies?.map((tech) => (
                  <span key={tech} className={styles.tagChip}>
                    <span>{tech}</span>
                    <button
                      type="button"
                      className={styles.removeTagBtn}
                      onClick={() => handleRemoveTech(tech)}
                      disabled={isSubmitting}
                      aria-label={`Remove ${tech}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Highlights & Key Features">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="highlight">
                Key Highlights (Type and press Enter)
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  id="highlight"
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={handleAddHighlight}
                  placeholder="e.g. Streamlined daily activity record entry"
                  className={styles.input}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={handleAddHighlightClick}
                  disabled={isSubmitting || !highlightInput.trim()}
                  style={{
                    padding: "0 14px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xs)",
                    color: "var(--color-text)",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                  }}
                >
                  Add
                </button>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "8px",
                }}
              >
                {formData.highlights?.map((h, i) => (
                  <div key={i} className={styles.highlightItem}>
                    <Plus
                      size={12}
                      style={{ color: "var(--color-accent)", flexShrink: 0 }}
                    />
                    <span style={{ flex: 1 }}>{h}</span>
                    <button
                      type="button"
                      className={styles.removeTagBtn}
                      onClick={() => handleRemoveHighlight(i)}
                      disabled={isSubmitting}
                      aria-label={`Remove highlight: ${h}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Links & Media">
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="demoUrl">
                  Demo URL
                </label>
                <input
                  id="demoUrl"
                  name="demoUrl"
                  type="text"
                  value={formData.demoUrl || ""}
                  onChange={handleTextChange}
                  placeholder="https://demo.example.com"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="githubUrl">
                  GitHub URL
                </label>
                <input
                  id="githubUrl"
                  name="githubUrl"
                  type="text"
                  value={formData.githubUrl || ""}
                  onChange={handleTextChange}
                  placeholder="https://github.com/IrAsther/..."
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className={styles.fieldRow} style={{ marginTop: "14px" }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="downloadUrl">
                  Download URL
                </label>
                <input
                  id="downloadUrl"
                  name="downloadUrl"
                  type="text"
                  value={formData.downloadUrl || ""}
                  onChange={handleTextChange}
                  placeholder="https://github.com/.../releases"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="sortOrder">
                  Display Sort Order
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min="0"
                  value={formData.sortOrder ?? 0}
                  onChange={handleTextChange}
                  className={styles.input}
                  disabled={isSubmitting}
                />
                <span className={styles.hint}>Lower numbers appear first.</span>
              </div>
            </div>
            <div className={styles.fieldRow} style={{ marginTop: "14px" }}>
              <div className={styles.fieldGroup}>
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  folder="applications"
                  label="Cover Image"
                  id="app-image-uploader"
                />
              </div>
              <div className={styles.fieldGroup}>
                <ImageUploader
                  value={formData.secondaryImage}
                  onChange={(url) => setFormData((prev) => ({ ...prev, secondaryImage: url }))}
                  folder="applications"
                  label="Secondary / Detail Image"
                  id="app-sec-image-uploader"
                />
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sidebarCol}>
          <AdminCard title="Publication Controls">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="status">
                Status Label <span className={styles.required}>*</span>
              </label>
              <input
                id="status"
                name="status"
                type="text"
                value={formData.status || ""}
                onChange={handleTextChange}
                placeholder="Live / Showcase, In Development"
                className={styles.input}
                disabled={isSubmitting}
                required
              />
              {errors.status && (
                <span className={styles.errorText}>{errors.status}</span>
              )}
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: "14px" }}>
              <label className={styles.label} htmlFor="statusType">
                Status Classification
              </label>
              <select
                id="statusType"
                name="statusType"
                value={formData.statusType || "showcase"}
                onChange={handleTextChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="showcase">Showcase (Verified Build)</option>
                <option value="in-development">In Development</option>
                <option value="prototype">Prototype</option>
                <option value="architecture">Architecture In Progress</option>
                <option value="concept">Concept / Planned</option>
              </select>
            </div>

            <div className={styles.checkboxRow} style={{ marginTop: "12px" }}>
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={Boolean(formData.published)}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <label htmlFor="published" className={styles.checkboxLabel}>
                Published on Live Website
              </label>
            </div>

            <div className={styles.checkboxRow}>
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <label htmlFor="featured" className={styles.checkboxLabel}>
                Featured on Apps Page Hero
              </label>
            </div>
          </AdminCard>

          {/* Live Card Preview */}
          <div className={styles.previewArea}>
            <div className={styles.previewFrame}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className={styles.previewTag}>CARD PREVIEW</span>
                <AdminBadge
                  label={formData.published ? "Published" : "Draft"}
                  variant={formData.published ? "published" : "draft"}
                  showDot={false}
                />
              </div>

              <div className={styles.previewThumbnail}>
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt=""
                    fill
                    sizes="300px"
                    className={styles.previewImg}
                  />
                ) : (
                  <ImageIcon
                    size={28}
                    style={{ color: "var(--color-text-subtle)" }}
                  />
                )}
              </div>

              <h4 className={styles.previewTitle}>
                {formData.name || "Untitled Application"}
              </h4>
              <p className={styles.previewSummary}>
                {formData.description ||
                  "Description text will appear here as you type..."}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {formData.technologies?.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "var(--font-family-mono)",
                      fontSize: "0.625rem",
                      padding: "1px 5px",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
