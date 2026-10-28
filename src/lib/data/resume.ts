/**
 * Data Access Layer — Resume & Skills
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

export interface ResumeDataDTO {
  profile: ResumeProfile;
  skillGroups: ResumeSkillGroup[];
  education: ResumeEducationItem[];
  journey: JourneyMilestone[];
}

/**
 * Public query: Fetch all resume information (profile, skills, education, journey).
 */
export async function getResumeData(): Promise<ResumeDataDTO> {
  const fallback: ResumeDataDTO = {
    profile: resumeProfile,
    skillGroups: resumeSkillGroups,
    education: resumeEducation,
    journey: journey,
  };

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = await createClient();

    // Query skill categories and skills
    const [categoriesRes, skillsRes, educationRes, journeyRes] = await Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
      supabase.from("journey_milestones").select("*").order("sort_order", { ascending: true }),
    ]);

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

    let educationList = fallback.education;
    if (educationRes.data && educationRes.data.length > 0) {
      educationList = educationRes.data.map((row) => ({
        institution: row.institution,
        field: row.field,
        status: row.status,
        note: row.note ?? undefined,
        current: row.current,
      }));
    }

    let journeyList = fallback.journey;
    if (journeyRes.data && journeyRes.data.length > 0) {
      journeyList = journeyRes.data.map((row) => ({
        id: row.slug,
        label: row.label,
        institution: row.institution,
        description: row.description,
      }));
    }

    return {
      profile: resumeProfile,
      skillGroups,
      education: educationList,
      journey: journeyList,
    };
  } catch {
    return fallback;
  }
}
