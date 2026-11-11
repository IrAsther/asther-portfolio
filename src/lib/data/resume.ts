/**
 * Data Access Layer — Resume, Bio & Skills
 *
 * Server-only module.
 * Queries Supabase when configured, with seamless fallback to static verified
 * data in `src/data/resume.ts` and `src/data/about.ts`.
 */

import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  resumeProfile,
  resumeSkillGroups,
  resumeEducation,
  type ResumeProfile,
  type ResumeSkillGroup,
  type ResumeEducationItem,
} from "@/data/resume";
import { journey, type JourneyMilestone } from "@/data/about";
import type {
  AdminSkillCategory,
  AdminEducationItem,
  AdminJourneyItem,
  AdminBioProfile,
  AdminResumeDocument,
  AdminContentData,
} from "@/types/admin";

export interface ResumeDocumentDTO {
  url: string;
  storagePath: string;
  filename: string;
  sizeBytes: number;
  uploadedAt: string;
  published: boolean;
}

export interface ResumeDataDTO {
  profile: ResumeProfile;
  skillGroups: ResumeSkillGroup[];
  education: ResumeEducationItem[];
  journey: JourneyMilestone[];
  resumeDocument: ResumeDocumentDTO | null;
}

const defaultResumeDoc: ResumeDocumentDTO | null = null;

/**
 * Public query: Fetch all resume and bio information (profile, skills, education, journey, active resume document).
 */
export async function getResumeData(): Promise<ResumeDataDTO> {
  const fallback: ResumeDataDTO = {
    profile: resumeProfile,
    skillGroups: resumeSkillGroups,
    education: resumeEducation,
    journey: journey,
    resumeDocument: defaultResumeDoc,
  };

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = await createClient();

    // Query skill categories, skills, education, journey, profile content, and resume document
    const [
      categoriesRes,
      skillsRes,
      educationRes,
      journeyRes,
      profileRes,
      resumeDocRes,
    ] = await Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
      supabase.from("journey_milestones").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("page_content")
        .select("content")
        .eq("page_slug", "about")
        .eq("section_key", "profile")
        .eq("published", true)
        .maybeSingle(),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "resume_document")
        .maybeSingle(),
    ]);

    // 1. Skill Groups
    let skillGroups = fallback.skillGroups;
    if (categoriesRes.data && categoriesRes.data.length > 0 && skillsRes.data) {
      const skillsByCat = new Map<string, string[]>();
      for (const skill of skillsRes.data) {
        const list = skillsByCat.get(skill.category_id) ?? [];
        list.push(skill.name);
        skillsByCat.set(skill.category_id, list);
      }

      skillGroups = categoriesRes.data.map((cat) => ({
        category: cat.name,
        skills: skillsByCat.get(cat.id) ?? [],
      }));
    }

    // 2. Education List
    let educationList = fallback.education;
    if (educationRes.data && educationRes.data.length > 0) {
      educationList = educationRes.data.map((row) => ({
        institution: row.institution,
        field: row.field,
        status: row.status,
        note: row.note ?? undefined,
        current: Boolean(row.current),
      }));
    }

    // 3. Journey List
    let journeyList = fallback.journey;
    if (journeyRes.data && journeyRes.data.length > 0) {
      journeyList = journeyRes.data.map((row) => ({
        id: row.slug || row.id,
        label: row.label,
        institution: row.institution,
        description: row.description,
      }));
    }

    // 4. Bio Profile
    let profile = fallback.profile;
    if (profileRes.data && profileRes.data.content) {
      const c = profileRes.data.content as Partial<ResumeProfile>;
      profile = {
        name: c.name || fallback.profile.name,
        role: c.role || fallback.profile.role,
        subtitles: Array.isArray(c.subtitles) && c.subtitles.length > 0 ? c.subtitles : fallback.profile.subtitles,
        positioning: c.positioning || fallback.profile.positioning,
        summary: c.summary || fallback.profile.summary,
        contact: {
          github: (c as { github?: string }).github || fallback.profile.contact.github,
          contactRoute: fallback.profile.contact.contactRoute,
          portfolioRoute: fallback.profile.contact.portfolioRoute,
          educationAffiliation:
            (c as { educationAffiliation?: string }).educationAffiliation ||
            fallback.profile.contact.educationAffiliation,
        },
      };
    }

    // 5. Resume Document
    let resumeDocument = fallback.resumeDocument;
    if (resumeDocRes.data && resumeDocRes.data.value) {
      const doc = resumeDocRes.data.value as Partial<ResumeDocumentDTO>;
      if (doc.url && doc.published) {
        resumeDocument = {
          url: doc.url,
          storagePath: doc.storagePath || "",
          filename: doc.filename || "Asther_Irakaza_CV.pdf",
          sizeBytes: doc.sizeBytes || 0,
          uploadedAt: doc.uploadedAt || "",
          published: Boolean(doc.published),
        };
      }
    }

    return {
      profile,
      skillGroups,
      education: educationList,
      journey: journeyList,
      resumeDocument,
    };
  } catch (err) {
    console.error("[getResumeData] Error fetching resume data:", err);
    return fallback;
  }
}

/**
 * Admin query: Fetch all content editor data for the Admin Bio & Resume Editor.
 */
export async function getAdminContentData(): Promise<AdminContentData> {
  const defaultProfile: AdminBioProfile = {
    name: resumeProfile.name,
    role: resumeProfile.role,
    subtitles: resumeProfile.subtitles,
    positioning: resumeProfile.positioning,
    summary: resumeProfile.summary,
    github: resumeProfile.contact.github,
    educationAffiliation: resumeProfile.contact.educationAffiliation,
  };

  const defaultSkills: AdminSkillCategory[] = resumeSkillGroups.map((group, idx) => ({
    id: `cat-${idx + 1}`,
    name: group.category,
    skills: group.skills,
  }));

  const defaultEducation: AdminEducationItem[] = resumeEducation.map((edu, idx) => ({
    id: `edu-${idx + 1}`,
    institution: edu.institution,
    field: edu.field,
    status: edu.status,
    note: edu.note,
    current: Boolean(edu.current),
  }));

  const defaultJourney: AdminJourneyItem[] = journey.map((j) => ({
    id: j.id,
    label: j.label,
    institution: j.institution,
    description: j.description,
  }));

  if (!isSupabaseConfigured()) {
    return {
      profile: defaultProfile,
      skills: defaultSkills,
      education: defaultEducation,
      journey: defaultJourney,
      resumeDocument: null,
    };
  }

  try {
    const supabase = await createClient();

    const [
      categoriesRes,
      skillsRes,
      educationRes,
      journeyRes,
      profileRes,
      resumeDocRes,
    ] = await Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
      supabase.from("journey_milestones").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("page_content")
        .select("content")
        .eq("page_slug", "about")
        .eq("section_key", "profile")
        .maybeSingle(),
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "resume_document")
        .maybeSingle(),
    ]);

    // Skills & Categories
    let skills = defaultSkills;
    if (categoriesRes.data && categoriesRes.data.length > 0) {
      const skillsByCat = new Map<string, string[]>();
      if (skillsRes.data) {
        for (const s of skillsRes.data) {
          const list = skillsByCat.get(s.category_id) ?? [];
          list.push(s.name);
          skillsByCat.set(s.category_id, list);
        }
      }

      skills = categoriesRes.data.map((cat) => ({
        id: cat.id,
        name: cat.name,
        skills: skillsByCat.get(cat.id) ?? [],
      }));
    }

    // Education
    let education = defaultEducation;
    if (educationRes.data && educationRes.data.length > 0) {
      education = educationRes.data.map((e) => ({
        id: e.id,
        institution: e.institution,
        field: e.field,
        status: e.status,
        note: e.note ?? undefined,
        current: Boolean(e.current),
      }));
    }

    // Journey
    let journeyList = defaultJourney;
    if (journeyRes.data && journeyRes.data.length > 0) {
      journeyList = journeyRes.data.map((j) => ({
        id: j.id,
        label: j.label,
        institution: j.institution,
        description: j.description,
      }));
    }

    // Profile
    let profile = defaultProfile;
    if (profileRes.data && profileRes.data.content) {
      const c = profileRes.data.content as Partial<AdminBioProfile>;
      profile = {
        name: c.name || defaultProfile.name,
        role: c.role || defaultProfile.role,
        subtitles: Array.isArray(c.subtitles) && c.subtitles.length > 0 ? c.subtitles : defaultProfile.subtitles,
        positioning: c.positioning || defaultProfile.positioning,
        summary: c.summary || defaultProfile.summary,
        github: c.github || defaultProfile.github,
        educationAffiliation: c.educationAffiliation || defaultProfile.educationAffiliation,
      };
    }

    // Resume Document
    let resumeDocument: AdminResumeDocument | null = null;
    if (resumeDocRes.data && resumeDocRes.data.value) {
      const doc = resumeDocRes.data.value as Partial<AdminResumeDocument>;
      if (doc.url) {
        resumeDocument = {
          url: doc.url,
          storagePath: doc.storagePath || "",
          filename: doc.filename || "Asther_Irakaza_CV.pdf",
          sizeBytes: doc.sizeBytes || 0,
          uploadedAt: doc.uploadedAt || "",
          published: Boolean(doc.published),
        };
      }
    }

    return {
      profile,
      skills,
      education,
      journey: journeyList,
      resumeDocument,
    };
  } catch (err) {
    console.error("[getAdminContentData] Error fetching admin content data:", err);
    return {
      profile: defaultProfile,
      skills: defaultSkills,
      education: defaultEducation,
      journey: defaultJourney,
      resumeDocument: null,
    };
  }
}
