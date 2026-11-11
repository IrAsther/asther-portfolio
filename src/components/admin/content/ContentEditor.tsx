"use client";

import React, { useState, useTransition, useRef } from "react";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Upload,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Code2,
  Loader2,
} from "lucide-react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import type {
  AdminContentData,
  AdminSkillCategory,
  AdminEducationItem,
  AdminJourneyItem,
  AdminBioProfile,
  AdminResumeDocument,
} from "@/types/admin";
import {
  saveAllBioResumeAction,
  uploadResumeAction,
  toggleResumePublishAction,
  deleteResumeAction,
} from "@/lib/actions/bio-resume";
import styles from "./ContentEditor.module.css";

interface ContentEditorProps {
  initialData: AdminContentData;
}

type TabKey = "profile" | "skills" | "career" | "resume";

export function ContentEditor({ initialData }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // State populated directly from real Supabase database
  const [profile, setProfile] = useState<AdminBioProfile>(initialData.profile);
  const [skills, setSkills] = useState<AdminSkillCategory[]>(initialData.skills);
  const [education, setEducation] = useState<AdminEducationItem[]>(initialData.education);
  const [journey, setJourney] = useState<AdminJourneyItem[]>(initialData.journey);
  const [resumeDoc, setResumeDoc] = useState<AdminResumeDocument | null>(
    initialData.resumeDocument
  );

  const [isDirty, setIsDirty] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const [isSaving, startSaveTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();
  const [isDeletingResume, startDeleteResumeTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Temporary inputs
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubtitleInput, setNewSubtitleInput] = useState("");

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    if (type === "success") {
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  /* ──────────────────────────────────────────────────────────────────────────
     PROFILE HANDLERS
     ────────────────────────────────────────────────────────────────────────── */
  const handleProfileChange = (field: keyof AdminBioProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAddSubtitle = () => {
    const val = newSubtitleInput.trim();
    if (!val) return;
    setProfile((prev) => ({
      ...prev,
      subtitles: [...prev.subtitles, val],
    }));
    setNewSubtitleInput("");
    setIsDirty(true);
  };

  const handleRemoveSubtitle = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      subtitles: prev.subtitles.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  };

  /* ──────────────────────────────────────────────────────────────────────────
     SKILLS & CATEGORIES HANDLERS
     ────────────────────────────────────────────────────────────────────────── */
  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const newCat: AdminSkillCategory = {
      id: `temp-cat-${Date.now()}`,
      name,
      skills: [],
    };
    setSkills((prev) => [...prev, newCat]);
    setNewCategoryName("");
    setIsDirty(true);
    showFeedback("success", `Added category "${name}". Remember to click "Save Changes".`);
  };

  const handleRenameCategory = (catId: string, newName: string) => {
    setSkills((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, name: newName } : c))
    );
    setIsDirty(true);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    const target = skills.find((c) => c.id === catId);
    if (target && target.skills.length > 0) {
      const confirmed = window.confirm(
        `Category "${catName}" contains ${target.skills.length} skills. Are you sure you want to delete it?`
      );
      if (!confirmed) return;
    }
    setSkills((prev) => prev.filter((c) => c.id !== catId));
    setIsDirty(true);
    showFeedback("success", `Category "${catName}" removed.`);
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;
    const copy = [...skills];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setSkills(copy);
    setIsDirty(true);
  };

  const handleAddSkill = (catId: string) => {
    const val = (newSkillInput[catId] || "").trim();
    if (!val) return;
    setSkills((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, skills: [...c.skills, val] } : c
      )
    );
    setNewSkillInput((prev) => ({ ...prev, [catId]: "" }));
    setIsDirty(true);
  };

  const handleRemoveSkill = (catId: string, skillName: string) => {
    setSkills((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, skills: c.skills.filter((s) => s !== skillName) }
          : c
      )
    );
    setIsDirty(true);
  };

  const handleMoveSkill = (catId: string, skillIdx: number, direction: "left" | "right") => {
    setSkills((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const targetIdx = direction === "left" ? skillIdx - 1 : skillIdx + 1;
        if (targetIdx < 0 || targetIdx >= c.skills.length) return c;
        const copy = [...c.skills];
        const [moved] = copy.splice(skillIdx, 1);
        copy.splice(targetIdx, 0, moved);
        return { ...c, skills: copy };
      })
    );
    setIsDirty(true);
  };

  /* ──────────────────────────────────────────────────────────────────────────
     EDUCATION HANDLERS
     ────────────────────────────────────────────────────────────────────────── */
  const newEduAnchorRef = useRef<HTMLDivElement | null>(null);

  const handleAddEducation = () => {
    const newEdu: AdminEducationItem = {
      id: `temp-edu-${Date.now()}`,
      institution: "",
      field: "",
      status: "",
      note: "",
      current: false,
    };
    setEducation((prev) => [...prev, newEdu]);
    setIsDirty(true);
    // Scroll new card into view on next tick
    setTimeout(() => {
      newEduAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  };

  const handleEducationChange = (
    id: string,
    field: keyof AdminEducationItem,
    value: string | boolean
  ) => {
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
    setIsDirty(true);
  };

  const handleDeleteEducation = (id: string) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
    setIsDirty(true);
  };

  const handleMoveEducation = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= education.length) return;
    const copy = [...education];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setEducation(copy);
    setIsDirty(true);
  };

  /* ──────────────────────────────────────────────────────────────────────────
     JOURNEY HANDLERS
     ────────────────────────────────────────────────────────────────────────── */
  const handleAddJourney = () => {
    const newJ: AdminJourneyItem = {
      id: `temp-j-${Date.now()}`,
      label: "Milestone",
      institution: "Institution or School",
      description: "Description of academic or technical milestone.",
    };
    setJourney((prev) => [...prev, newJ]);
    setIsDirty(true);
  };

  const handleJourneyChange = (
    id: string,
    field: keyof AdminJourneyItem,
    value: string
  ) => {
    setJourney((prev) =>
      prev.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );
    setIsDirty(true);
  };

  const handleDeleteJourney = (id: string) => {
    setJourney((prev) => prev.filter((j) => j.id !== id));
    setIsDirty(true);
  };

  const handleMoveJourney = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= journey.length) return;
    const copy = [...journey];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setJourney(copy);
    setIsDirty(true);
  };

  /* ──────────────────────────────────────────────────────────────────────────
     RESUME MANAGEMENT (PDF) HANDLERS
     ────────────────────────────────────────────────────────────────────────── */
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      showFeedback("error", "Please select a valid PDF file (.pdf).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showFeedback("error", "The resume PDF exceeds the 10 MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startUploadTransition(async () => {
      const res = await uploadResumeAction(formData);
      if (res.success && res.data) {
        setResumeDoc({
          url: res.data.url,
          storagePath: res.data.storagePath,
          filename: res.data.filename,
          sizeBytes: res.data.sizeBytes,
          uploadedAt: new Date().toISOString(),
          published: true,
        });
        showFeedback("success", "Resume PDF uploaded successfully to Supabase Storage!");
      } else {
        showFeedback("error", res.error || "Failed to upload resume.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const handleTogglePublishResume = () => {
    if (!resumeDoc) return;
    const nextState = !resumeDoc.published;
    startToggleTransition(async () => {
      const res = await toggleResumePublishAction(nextState);
      if (res.success) {
        setResumeDoc((prev) => (prev ? { ...prev, published: nextState } : null));
        showFeedback(
          "success",
          nextState
            ? "Resume published on the website."
            : "Resume unpublished (hidden from public)."
        );
      } else {
        showFeedback("error", res.error || "Failed to update publish state.");
      }
    });
  };

  const handleDeleteResume = () => {
    if (!resumeDoc) return;
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this resume document?"
    );
    if (!confirmed) return;

    startDeleteResumeTransition(async () => {
      const res = await deleteResumeAction();
      if (res.success) {
        setResumeDoc(null);
        showFeedback("success", "Resume document deleted from Supabase Storage.");
      } else {
        showFeedback("error", res.error || "Failed to delete resume.");
      }
    });
  };

  /* ──────────────────────────────────────────────────────────────────────────
     MAIN SAVE OPERATION
     ────────────────────────────────────────────────────────────────────────── */
  const handleSaveAll = () => {
    startSaveTransition(async () => {
      const payload: AdminContentData = {
        profile,
        skills,
        education,
        journey,
        resumeDocument: resumeDoc,
      };

      const res = await saveAllBioResumeAction(payload);
      if (res.success) {
        setIsDirty(false);
        showFeedback("success", "All bio & resume changes saved successfully to Supabase!");
      } else {
        showFeedback("error", res.error || "Failed to save changes. Please try again.");
      }
    });
  };

  return (
    <div className={styles.editorLayout}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Bio &amp; Resume Editor</h1>
          <p className={styles.pageSubtitle}>
            Persistent management for your public bio, skills taxonomy, career journey, and resume PDF.
          </p>
        </div>

        <div className={styles.headerActions}>
          {isDirty && (
            <span className={styles.dirtyBadge} role="status">
              <span className={styles.dirtyDot} aria-hidden="true" />
              Unsaved changes
            </span>
          )}

          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSaveAll}
            disabled={isSaving}
            aria-label="Save all changes to database"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} aria-hidden="true" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={
            feedback.type === "success"
              ? styles.toastBannerSuccess
              : styles.toastBannerError
          }
          role="status"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {feedback.type === "success" ? (
              <CheckCircle size={16} aria-hidden="true" />
            ) : (
              <AlertCircle size={16} aria-hidden="true" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={() => setFeedback(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <nav className={styles.sectionTabs} aria-label="Editor sections">
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "profile" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={15} aria-hidden="true" />
          <span>Profile &amp; Bio</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "skills" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          <Code2 size={15} aria-hidden="true" />
          <span>Skills &amp; Technologies ({skills.reduce((acc, c) => acc + c.skills.length, 0)})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "career" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("career")}
        >
          <GraduationCap size={15} aria-hidden="true" />
          <span>Education &amp; Journey ({education.length + journey.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "resume" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("resume")}
        >
          <FileText size={15} aria-hidden="true" />
          <span>Resume Document {resumeDoc?.published ? "· (Published)" : ""}</span>
        </button>
      </nav>

      {/* ── TAB 1: PROFILE & BIO ────────────────────────────────────────── */}
      {activeTab === "profile" && (
        <div className={styles.tabContent}>
          <AdminCard
            title="Bio &amp; Personal Profile"
            subtitle="Core biographical statements displayed on About and Resume pages"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="bio-name">
                    Full Name
                  </label>
                  <input
                    id="bio-name"
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className={styles.input}
                    placeholder="Asther Irakaza"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="bio-role">
                    Primary Professional Role
                  </label>
                  <input
                    id="bio-role"
                    type="text"
                    value={profile.role}
                    onChange={(e) => handleProfileChange("role", e.target.value)}
                    className={styles.input}
                    placeholder="Software Developer"
                  />
                </div>
              </div>

              {/* Subtitles Tag Editor */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Role Subtitles / Identities
                </label>
                <div className={styles.tagList}>
                  {profile.subtitles.map((sub, idx) => (
                    <span key={idx} className={styles.tagPill}>
                      <span>{sub}</span>
                      <button
                        type="button"
                        className={styles.tagRemoveBtn}
                        onClick={() => handleRemoveSubtitle(idx)}
                        aria-label={`Remove subtitle: ${sub}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={newSubtitleInput}
                    onChange={(e) => setNewSubtitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubtitle();
                      }
                    }}
                    placeholder="Add subtitle (e.g. AI/ML Enthusiast) & press Enter"
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.addSkillBtn}
                    onClick={handleAddSubtitle}
                  >
                    <Plus size={14} aria-hidden="true" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Professional Positioning Statement */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="bio-positioning">
                  Professional Positioning Statement
                </label>
                <textarea
                  id="bio-positioning"
                  value={profile.positioning}
                  onChange={(e) => handleProfileChange("positioning", e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Comprehensive positioning statement displayed on the Resume page."
                />
              </div>

              {/* Summary */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="bio-summary">
                  Professional Summary
                </label>
                <textarea
                  id="bio-summary"
                  value={profile.summary}
                  onChange={(e) => handleProfileChange("summary", e.target.value)}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Detailed summary statement explaining your engineering focus and design methodology."
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="bio-github">
                    GitHub URL
                  </label>
                  <input
                    id="bio-github"
                    type="url"
                    value={profile.github}
                    onChange={(e) => handleProfileChange("github", e.target.value)}
                    className={styles.input}
                    placeholder="https://github.com/IrAsther"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="bio-affiliation">
                    Academic Affiliation
                  </label>
                  <input
                    id="bio-affiliation"
                    type="text"
                    value={profile.educationAffiliation}
                    onChange={(e) =>
                      handleProfileChange("educationAffiliation", e.target.value)
                    }
                    className={styles.input}
                    placeholder="University of the People"
                  />
                </div>
              </div>
            </div>
          </AdminCard>
        </div>
      )}

      {/* ── TAB 2: SKILLS & TECHNOLOGIES ────────────────────────────────── */}
      {activeTab === "skills" && (
        <div className={styles.tabContent}>
          <div className={styles.skillsSection}>
            {/* Add Category Row */}
            <div className={styles.categoryControls}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="New category name (e.g. Cloud & DevOps)"
                  className={styles.input}
                  style={{ maxWidth: "340px" }}
                />
                <button
                  type="button"
                  className={styles.addSkillBtn}
                  onClick={handleAddCategory}
                >
                  <Plus size={15} aria-hidden="true" />
                  <span>Add Category</span>
                </button>
              </div>
            </div>

            {/* List of categories */}
            {skills.map((category, catIdx) => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryNameRow}>
                    <span className={styles.orderBadge}>{catIdx + 1}</span>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleRenameCategory(category.id, e.target.value)}
                      className={styles.categoryTitleInput}
                      title="Click to rename category"
                      aria-label="Category name"
                    />
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", fontFamily: "var(--font-family-mono)" }}>
                      ({category.skills.length} skills)
                    </span>
                  </div>

                  <div className={styles.categoryActions}>
                    <button
                      type="button"
                      className={styles.iconActionBtn}
                      onClick={() => handleMoveCategory(catIdx, "up")}
                      disabled={catIdx === 0}
                      title="Move category up"
                      aria-label="Move category up"
                    >
                      <ArrowUp size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.iconActionBtn}
                      onClick={() => handleMoveCategory(catIdx, "down")}
                      disabled={catIdx === skills.length - 1}
                      title="Move category down"
                      aria-label="Move category down"
                    >
                      <ArrowDown size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconActionBtn} ${styles.deleteCatBtn}`}
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                      title="Delete category"
                      aria-label={`Delete category ${category.name}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Skills Pills */}
                <div className={styles.skillPillList}>
                  {category.skills.map((skill, sIdx) => (
                    <span key={sIdx} className={styles.skillPill}>
                      <button
                        type="button"
                        className={styles.skillItemMove}
                        onClick={() => handleMoveSkill(category.id, sIdx, "left")}
                        disabled={sIdx === 0}
                        title="Move left"
                        aria-label="Move skill left"
                      >
                        ‹
                      </button>
                      <span>{skill}</span>
                      <button
                        type="button"
                        className={styles.skillItemMove}
                        onClick={() => handleMoveSkill(category.id, sIdx, "right")}
                        disabled={sIdx === category.skills.length - 1}
                        title="Move right"
                        aria-label="Move skill right"
                      >
                        ›
                      </button>
                      <button
                        type="button"
                        className={styles.skillPillDelete}
                        onClick={() => handleRemoveSkill(category.id, skill)}
                        aria-label={`Remove skill ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Skill Row */}
                <div className={styles.addSkillInputRow}>
                  <input
                    type="text"
                    placeholder={`Add skill to ${category.name} & press Enter`}
                    value={newSkillInput[category.id] || ""}
                    onChange={(e) =>
                      setNewSkillInput((prev) => ({
                        ...prev,
                        [category.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(category.id);
                      }
                    }}
                    className={styles.addSkillInput}
                    aria-label={`Add skill to ${category.name}`}
                  />
                  <button
                    type="button"
                    className={styles.addSkillBtn}
                    onClick={() => handleAddSkill(category.id)}
                  >
                    <Plus size={14} aria-hidden="true" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: CAREER & EDUCATION ───────────────────────────────────── */}
      {activeTab === "career" && (
        <div className={styles.columnsGrid}>
          {/* Education column */}
          <div className={styles.leftCol}>
            <AdminCard
              title="Education"
              subtitle="Academic institutions and degree programs"
              actions={
                <button
                  type="button"
                  className={styles.addSkillBtn}
                  onClick={handleAddEducation}
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>Add Education</span>
                </button>
              }
            >
              <div className={styles.educationList}>
                {education.length === 0 && (
                  <p className={styles.emptyState}>
                    No education records yet. Click &ldquo;Add Education&rdquo; to create the first entry.
                  </p>
                )}
                {education.map((edu, eduIdx) => (
                  <div
                    key={edu.id}
                    className={styles.itemCard}
                    ref={eduIdx === education.length - 1 ? newEduAnchorRef : null}
                  >
                    <div className={styles.itemCardHeader}>
                      <span className={styles.orderBadge}>{eduIdx + 1}</span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => handleMoveEducation(eduIdx, "up")}
                          disabled={eduIdx === 0}
                          aria-label="Move education item up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => handleMoveEducation(eduIdx, "down")}
                          disabled={eduIdx === education.length - 1}
                          aria-label="Move education item down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconActionBtn} ${styles.deleteCatBtn}`}
                          onClick={() => handleDeleteEducation(edu.id)}
                          aria-label="Delete education item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          placeholder="e.g. University of the People"
                          onChange={(e) =>
                            handleEducationChange(edu.id, "institution", e.target.value)
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          placeholder="e.g. Computer Science"
                          onChange={(e) =>
                            handleEducationChange(edu.id, "field", e.target.value)
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Status Label</label>
                      <input
                        type="text"
                        value={edu.status}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "status", e.target.value)
                        }
                        className={styles.input}
                        placeholder="e.g. Current studies"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Program Description / Notes</label>
                      <textarea
                        value={edu.note || ""}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "note", e.target.value)
                        }
                        className={styles.textarea}
                        rows={2}
                        placeholder="Brief description of the program or studies"
                      />
                    </div>

                    <div className={styles.checkboxRow}>
                      <input
                        id={`current-${edu.id}`}
                        type="checkbox"
                        checked={Boolean(edu.current)}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "current", e.target.checked)
                        }
                        className={styles.checkbox}
                      />
                      <label htmlFor={`current-${edu.id}`} className={styles.checkboxLabel}>
                        Currently enrolled
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>

          {/* Journey column */}
          <div className={styles.rightCol}>
            <AdminCard
              title="Career Journey"
              subtitle="Milestones displayed on the About page timeline"
              actions={
                <button
                  type="button"
                  className={styles.addSkillBtn}
                  onClick={handleAddJourney}
                >
                  <Plus size={14} aria-hidden="true" />
                  <span>Add Milestone</span>
                </button>
              }
            >
              <div className={styles.journeyList}>
                {journey.length === 0 && (
                  <p className={styles.emptyState}>
                    No milestones yet. Click &ldquo;Add Milestone&rdquo; to create the first entry.
                  </p>
                )}
                {journey.map((item, jIdx) => (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.itemCardHeader}>
                      <span className={styles.orderBadge}>{jIdx + 1}</span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => handleMoveJourney(jIdx, "up")}
                          disabled={jIdx === 0}
                          aria-label="Move milestone up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.iconActionBtn}
                          onClick={() => handleMoveJourney(jIdx, "down")}
                          disabled={jIdx === journey.length - 1}
                          aria-label="Move milestone down"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconActionBtn} ${styles.deleteCatBtn}`}
                          onClick={() => handleDeleteJourney(item.id)}
                          aria-label="Delete milestone"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Milestone Label</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            handleJourneyChange(item.id, "label", e.target.value)
                          }
                          className={styles.input}
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label}>Institution / Organization</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) =>
                            handleJourneyChange(item.id, "institution", e.target.value)
                          }
                          className={styles.input}
                          placeholder="e.g. University of the People"
                        />
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Description</label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleJourneyChange(item.id, "description", e.target.value)
                        }
                        className={styles.textarea}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        </div>
      )}

      {/* ── TAB 4: FORMAL RESUME (PDF) ─────────────────────────────────── */}
      {activeTab === "resume" && (
        <div className={styles.tabContent}>
          <AdminCard
            title="Formal Resume Document (PDF)"
            subtitle="Upload and manage the downloadable PDF resume for recruiters and collaborators"
          >
            <div className={styles.resumeCard}>
              {resumeDoc ? (
                <div className={styles.resumeStatusBanner}>
                  <div className={styles.resumeFileDetails}>
                    <div className={styles.pdfIconBox}>
                      <FileText size={22} aria-hidden="true" />
                    </div>
                    <div className={styles.resumeMetaText}>
                      <span className={styles.resumeFilename}>
                        {resumeDoc.filename}
                      </span>
                      <span className={styles.resumeSubmeta}>
                        {(resumeDoc.sizeBytes / 1024).toFixed(1)} KB · Uploaded{" "}
                        {new Date(resumeDoc.uploadedAt).toLocaleDateString()} ·{" "}
                        <strong
                          style={{
                            color: resumeDoc.published ? "#01605A" : "#E53E3E",
                          }}
                        >
                          {resumeDoc.published ? "Published" : "Draft / Unpublished"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className={styles.resumeActionRow}>
                    <a
                      href={resumeDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadLink}
                    >
                      <Download size={14} aria-hidden="true" />
                      <span>Download / Preview</span>
                    </a>

                    <button
                      type="button"
                      className={`${styles.publishToggleBtn} ${
                        resumeDoc.published
                          ? styles.publishToggleActive
                          : styles.publishToggleInactive
                      }`}
                      onClick={handleTogglePublishResume}
                      disabled={isToggling}
                    >
                      {resumeDoc.published ? (
                        <>
                          <Eye size={14} aria-hidden="true" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={14} aria-hidden="true" />
                          <span>Unpublished</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className={styles.deleteResumeBtn}
                      onClick={handleDeleteResume}
                      disabled={isDeletingResume}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.uploadDropzone}>
                  <FileText size={36} style={{ color: "var(--color-text-subtle)" }} />
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "var(--color-text)" }}>
                      No resume document uploaded
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
                      Upload a formal PDF curriculum vitae (max 10 MB) to enable direct downloads on the public site.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload trigger */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "1rem" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelected}
                  className={styles.hiddenFileInput}
                  id="resume-file-input"
                />
                <label htmlFor="resume-file-input" className={styles.uploadTriggerBtn}>
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span>Uploading to Supabase Storage...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} aria-hidden="true" />
                      <span>{resumeDoc ? "Replace Resume PDF" : "Upload Resume PDF"}</span>
                    </>
                  )}
                </label>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", fontFamily: "var(--font-family-mono)" }}>
                  PDF format only · Max 10 MB · Validated with magic bytes
                </span>
              </div>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
