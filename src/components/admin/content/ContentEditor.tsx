"use client";

import React, { useState } from "react";
import {
  Save,
  Plus,
  X,
  GraduationCap,
  Code2,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Button } from "@/components/ui/Button";
import {
  initialSkillCategories,
  initialEducation,
  initialJourney,
} from "@/data/adminMockData";
import {
  AdminSkillCategory,
  AdminEducationItem,
  AdminJourneyItem,
} from "@/types/admin";
import styles from "./ContentEditor.module.css";

export function ContentEditor() {
  const [skills, setSkills] =
    useState<AdminSkillCategory[]>(initialSkillCategories);
  const [education, setEducation] =
    useState<AdminEducationItem[]>(initialEducation);
  const [journey, setJourney] =
    useState<AdminJourneyItem[]>(initialJourney);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState<Record<string, string>>(
    {}
  );

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 5000);
  };

  /* ── Skills helpers ── */
  const handleAddSkill = (catId: string) => {
    const value = (newSkillInput[catId] || "").trim();
    if (!value) return;
    setSkills((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, skills: [...cat.skills, value] }
          : cat
      )
    );
    setNewSkillInput((prev) => ({ ...prev, [catId]: "" }));
    showFeedback("Skill added to local prototype state.");
  };

  const handleRemoveSkill = (catId: string, skill: string) => {
    setSkills((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? { ...cat, skills: cat.skills.filter((s) => s !== skill) }
          : cat
      )
    );
  };

  /* ── Education helpers ── */
  const handleEducationChange = (
    id: string,
    field: keyof AdminEducationItem,
    value: string | boolean
  ) => {
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  /* ── Journey helpers ── */
  const handleJourneyChange = (
    id: string,
    field: keyof AdminJourneyItem,
    value: string
  ) => {
    setJourney((prev) =>
      prev.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );
  };

  const handleAddJourneyItem = () => {
    const newItem: AdminJourneyItem = {
      id: `j-${Date.now()}`,
      label: "New Step",
      institution: "",
      description: "",
    };
    setJourney((prev) => [...prev, newItem]);
  };

  const handleRemoveJourneyItem = (id: string) => {
    setJourney((prev) => prev.filter((j) => j.id !== id));
  };

  const handleSave = () => {
    showFeedback(
      "All bio & resume content validated in local prototype state. (Backend persistence will be connected in next phase)"
    );
  };

  return (
    <div className={styles.editorLayout}>
      <AdminNotice />

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Bio & Resume Editor</h1>
          <p className={styles.pageSubtitle}>
            Manage skills, education timeline, and career journey displayed on the public About and Resume pages.
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

      {/* Two column layout */}
      <div className={styles.columnsGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          {/* Skills section */}
          <AdminCard
            title="Skills & Technologies"
            subtitle="Manage skill categories displayed on the About page"
            actions={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  color: "var(--color-text-subtle)",
                  fontFamily: "var(--font-family-mono)",
                }}
              >
                <Code2 size={12} />
                {skills.reduce((acc, c) => acc + c.skills.length, 0)} total
              </div>
            }
          >
            <div className={styles.skillsGrid}>
              {skills.map((category) => (
                <div key={category.id} className={styles.skillCategory}>
                  <h4 className={styles.skillCategoryName}>
                    {category.name}
                  </h4>
                  <div className={styles.skillTagList}>
                    {category.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>
                        <span>{skill}</span>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => handleRemoveSkill(category.id, skill)}
                          aria-label={`Remove ${skill} from ${category.name}`}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className={styles.addSkillRow}>
                    <input
                      type="text"
                      placeholder="Add skill & press Enter"
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
                      className={styles.skillInput}
                      aria-label={`Add skill to ${category.name}`}
                    />
                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={() => handleAddSkill(category.id)}
                      aria-label="Add skill"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Education section */}
          <AdminCard
            title="Education"
            subtitle="Academic institutions and degree programs"
            actions={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.75rem",
                  color: "var(--color-text-subtle)",
                  fontFamily: "var(--font-family-mono)",
                }}
              >
                <GraduationCap size={12} />
                {education.length} records
              </div>
            }
          >
            <div className={styles.educationList}>
              {education.map((edu) => (
                <div key={edu.id} className={styles.educationItem}>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor={`inst-${edu.id}`}>
                        Institution
                      </label>
                      <input
                        id={`inst-${edu.id}`}
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "institution",
                            e.target.value
                          )
                        }
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label} htmlFor={`field-${edu.id}`}>
                        Field of Study
                      </label>
                      <input
                        id={`field-${edu.id}`}
                        type="text"
                        value={edu.field}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "field", e.target.value)
                        }
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup} style={{ marginTop: "10px" }}>
                    <label className={styles.label} htmlFor={`status-${edu.id}`}>
                      Status
                    </label>
                    <input
                      id={`status-${edu.id}`}
                      type="text"
                      value={edu.status}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "status", e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>
                  {edu.note !== undefined && (
                    <div className={styles.fieldGroup} style={{ marginTop: "10px" }}>
                      <label className={styles.label} htmlFor={`note-${edu.id}`}>
                        Note / Description
                      </label>
                      <textarea
                        id={`note-${edu.id}`}
                        value={edu.note || ""}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "note", e.target.value)
                        }
                        className={styles.textarea}
                        rows={3}
                      />
                    </div>
                  )}
                  <div className={styles.checkboxRow} style={{ marginTop: "8px" }}>
                    <input
                      id={`current-${edu.id}`}
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "current", e.target.checked)
                      }
                      className={styles.checkbox}
                    />
                    <label
                      htmlFor={`current-${edu.id}`}
                      className={styles.checkboxLabel}
                    >
                      Currently enrolled
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Journey / Timeline section */}
          <AdminCard
            title="Career Journey"
            subtitle="Timeline steps shown on the About page"
            actions={
              <button
                type="button"
                className={styles.addStepBtn}
                onClick={handleAddJourneyItem}
              >
                <Plus size={13} />
                <span>Add Step</span>
              </button>
            }
          >
            <div className={styles.journeyList}>
              {journey.map((item, index) => (
                <div key={item.id} className={styles.journeyItem}>
                  <div className={styles.journeyNumberBadge}>{index + 1}</div>
                  <div className={styles.journeyFields}>
                    <div className={styles.journeyTopRow}>
                      <div className={styles.fieldGroup}>
                        <label
                          className={styles.label}
                          htmlFor={`jlabel-${item.id}`}
                        >
                          Label
                        </label>
                        <input
                          id={`jlabel-${item.id}`}
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            handleJourneyChange(item.id, "label", e.target.value)
                          }
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label
                          className={styles.label}
                          htmlFor={`jinst-${item.id}`}
                        >
                          Institution
                        </label>
                        <input
                          id={`jinst-${item.id}`}
                          type="text"
                          value={item.institution}
                          onChange={(e) =>
                            handleJourneyChange(
                              item.id,
                              "institution",
                              e.target.value
                            )
                          }
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup} style={{ marginTop: "8px" }}>
                      <label
                        className={styles.label}
                        htmlFor={`jdesc-${item.id}`}
                      >
                        Description
                      </label>
                      <textarea
                        id={`jdesc-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          handleJourneyChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        className={styles.textarea}
                        rows={2}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                      <button
                        type="button"
                        className={styles.removeStepBtn}
                        onClick={() => handleRemoveJourneyItem(item.id)}
                        aria-label={`Remove step: ${item.institution}`}
                      >
                        <Trash2Icon size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Quick guide */}
          <div className={styles.guideCard}>
            <div className={styles.guideHeader}>
              <BookOpen size={14} style={{ color: "#01605A" }} />
              <span className={styles.guideTitle}>
                Public Page Mapping
              </span>
            </div>
            <ul className={styles.guideList}>
              <li>
                <strong>Skills</strong> → About page skills grid
              </li>
              <li>
                <strong>Education</strong> → Resume &amp; About education
                section
              </li>
              <li>
                <strong>Journey</strong> → About page timeline
              </li>
            </ul>
            <p className={styles.guideNote}>
              Changes here are reflected in the public portfolio once backend
              persistence is connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline icon since lucide-react's Trash2 is already imported elsewhere
function Trash2Icon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
