"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { Button } from "@/components/ui/Button";
import { AdminProject, ProjectStatusType } from "@/types/admin";
import {
  createProjectAction,
  updateProjectAction,
  type ProjectInput,
} from "@/lib/actions/projects";
import styles from "./ProjectForm.module.css";

interface ProjectFormProps {
  initialData?: AdminProject;
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

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<AdminProject>>(
    initialData || {
      title: "",
      slug: "",
      category: "Mobile Utility",
      summary: "",
      problem: "",
      direction: "",
      technologies: ["TypeScript", "Next.js"],
      status: "Active build",
      statusType: "active" as ProjectStatusType,
      published: false,
      featured: false,
      isPlaceholder: false,
      href: "/projects",
      image: "/projects/dandaza-screen.webp",
      secondaryImage: "/projects/dandaza-report.webp",
      sortOrder: 0,
    }
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [techInput, setTechInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, title: value };
      if (!slugManuallyEdited && !isEditing) {
        updated.slug = slugify(value);
      }
      return updated;
    });

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
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
    if (formData.title) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.title || "") }));
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Project title is required.";
    if (!formData.slug?.trim()) newErrors.slug = "URL slug is required.";
    if (!formData.category?.trim()) newErrors.category = "Category is required.";
    if (!formData.summary?.trim()) newErrors.summary = "Executive summary is required.";
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

    const payload: ProjectInput = {
      title: formData.title!.trim(),
      slug: formData.slug!.trim().toLowerCase(),
      category: formData.category!.trim(),
      summary: formData.summary!.trim(),
      problem: formData.problem?.trim() || "",
      direction: formData.direction?.trim() || "",
      technologies: formData.technologies || [],
      status: formData.status!.trim(),
      statusType: (formData.statusType as ProjectStatusType) || "planned",
      published: Boolean(formData.published),
      featured: Boolean(formData.featured),
      isPlaceholder: Boolean(formData.isPlaceholder),
      href: formData.href?.trim() || "/projects",
      image: formData.image?.trim() || "",
      secondaryImage: formData.secondaryImage?.trim() || "",
      sortOrder: typeof formData.sortOrder === "number" ? formData.sortOrder : 0,
    };

    try {
      let result;
      if (isEditing && initialData?.id) {
        result = await updateProjectAction(initialData.id, payload);
      } else {
        result = await createProjectAction(payload);
      }

      if (!result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        }
        setFeedback({
          type: "error",
          message: result.error || "An error occurred while saving the project.",
        });
        setIsSubmitting(false);
        return;
      }

      setFeedback({
        type: "success",
        message: isEditing
          ? `Project "${payload.title}" updated successfully.`
          : `Project "${payload.title}" created successfully. Redirecting...`,
      });

      // Redirect after a brief moment to show success
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("[ProjectForm] Error during submission:", err);
      setFeedback({
        type: "error",
        message: "An unexpected network or system error occurred.",
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
            href="/admin/projects"
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
            <span>Back to Projects</span>
          </Link>
          <h1 className={styles.formTitle}>
            {isEditing ? `Edit Project: ${initialData?.title}` : "Create New Project"}
          </h1>
          <p className={styles.formSubtitle}>
            Configure technical metadata, architectural problem statements, and public card display.
          </p>
        </div>

        <div className={styles.topActions}>
          <Button href="/admin/projects" variant="outline" size="sm">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            <Save size={15} />
            <span>{isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}</span>
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

      {/* Grid: Form (Left) & Live Preview (Right) */}
      <form onSubmit={handleSubmit} className={styles.gridArea}>
        {/* Form Column */}
        <div className={styles.formBody}>
          <AdminCard title="Core Information">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="title">
                Project Title <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title || ""}
                onChange={handleTitleChange}
                placeholder="e.g. Dandaza+, Scholarly ASA"
                className={styles.input}
                disabled={isSubmitting}
                required
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
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
                      title="Generate slug from title"
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
                  placeholder="e.g. Mobile Utility, Data & ML, Web Platform"
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
              <label className={styles.label} htmlFor="summary">
                Summary Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary || ""}
                onChange={handleTextChange}
                placeholder="Concise overview explaining purpose and real-world utility..."
                className={styles.textarea}
                disabled={isSubmitting}
                required
              />
              {errors.summary && (
                <span className={styles.errorText}>{errors.summary}</span>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Technical & Problem Statements">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="problem">
                Problem Statement
              </label>
              <textarea
                id="problem"
                name="problem"
                value={formData.problem || ""}
                onChange={handleTextChange}
                placeholder="What concrete real-world problem or operational friction does this solve?"
                className={styles.textarea}
                disabled={isSubmitting}
              />
              <span className={styles.hint}>
                Displayed in the expanded project details modal on the public portfolio.
              </span>
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
                placeholder="Architectural approach, performance considerations, and system design..."
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
                  placeholder="e.g. TypeScript, Next.js, Python, PostgreSQL"
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

          <AdminCard title="Media & Links">
            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="image">
                  Primary Thumbnail / Screen URL
                </label>
                <input
                  id="image"
                  name="image"
                  type="text"
                  value={formData.image || ""}
                  onChange={handleTextChange}
                  placeholder="/projects/dandaza-screen.webp"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="secondaryImage">
                  Secondary Screen / Report URL
                </label>
                <input
                  id="secondaryImage"
                  name="secondaryImage"
                  type="text"
                  value={formData.secondaryImage || ""}
                  onChange={handleTextChange}
                  placeholder="/projects/dandaza-report.webp"
                  className={styles.input}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className={styles.fieldRow} style={{ marginTop: "16px" }}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="href">
                  External or Case Study Link
                </label>
                <input
                  id="href"
                  name="href"
                  type="text"
                  value={formData.href || ""}
                  onChange={handleTextChange}
                  placeholder="/projects or https://..."
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
          </AdminCard>
        </div>

        {/* Sidebar Column: Settings & Live Preview */}
        <div className={styles.sidebarCol}>
          <AdminCard title="Publication Controls">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="status">
                Status Badge Label <span className={styles.required}>*</span>
              </label>
              <input
                id="status"
                name="status"
                type="text"
                value={formData.status || ""}
                onChange={handleTextChange}
                placeholder="Active build, In progress, Live"
                className={styles.input}
                disabled={isSubmitting}
                required
              />
              {errors.status && <span className={styles.errorText}>{errors.status}</span>}
            </div>

            <div className={styles.fieldGroup} style={{ marginTop: "14px" }}>
              <label className={styles.label} htmlFor="statusType">
                Status Classification
              </label>
              <select
                id="statusType"
                name="statusType"
                value={formData.statusType || "active"}
                onChange={handleTextChange}
                className={styles.select}
                disabled={isSubmitting}
              >
                <option value="showcase">Showcase (Verified Build)</option>
                <option value="active">Active In Development</option>
                <option value="architecture">Architecture In Progress</option>
                <option value="planned">Planned Direction</option>
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
                Featured on Homepage Grid
              </label>
            </div>

            <div className={styles.checkboxRow}>
              <input
                id="isPlaceholder"
                name="isPlaceholder"
                type="checkbox"
                checked={Boolean(formData.isPlaceholder)}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
                disabled={isSubmitting}
              />
              <label htmlFor="isPlaceholder" className={styles.checkboxLabel}>
                Mark as Planned Concept / Architecture
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
                  <ImageIcon size={28} style={{ color: "var(--color-text-subtle)" }} />
                )}
              </div>

              <h4 className={styles.previewTitle}>
                {formData.title || "Untitled Project"}
              </h4>
              <p className={styles.previewSummary}>
                {formData.summary || "Summary text will appear here as you type in the editor..."}
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
