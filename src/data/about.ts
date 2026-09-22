/**
 * About Page Data — Asther Irakaza Personal Digital Portfolio
 *
 * Contains only verified, authentic information.
 * Do NOT add invented dates, achievements, titles, or statistics.
 */

// ─── Education ────────────────────────────────────────────────────────────────

export interface EducationEntry {
  institution: string;
  field: string;
  note?: string;
  current?: boolean;
}

export const education: EducationEntry[] = [
  {
    institution: "University of the People",
    field: "Computer Science",
    current: true,
  },
  {
    institution: "Institut des Technologies Numériques (ITN)",
    field: "Technology & Computer Science Studies",
    note: "University of Burundi",
  },
];

// ─── Journey Milestones ───────────────────────────────────────────────────────

export interface JourneyMilestone {
  id: string;
  label: string;
  institution: string;
  description: string;
}

export const journey: JourneyMilestone[] = [
  {
    id: "gisenyi",
    label: "Secondary School",
    institution: "GISENYI School",
    description:
      "Foundational education and early formation of analytical thinking.",
  },
  {
    id: "butara",
    label: "Secondary School",
    institution: "BUTARA School",
    description:
      "Continued academic development and growing interest in technology.",
  },
  {
    id: "itn",
    label: "Technology Studies",
    institution: "Institut des Technologies Numériques",
    description:
      "Formal immersion in computer science and digital technologies at the University of Burundi.",
  },
  {
    id: "uopeople",
    label: "Computer Science",
    institution: "University of the People",
    description:
      "Online Computer Science degree program — currently enrolled, building structured knowledge in software engineering and algorithms.",
  },
  {
    id: "ai-tech",
    label: "AI & Technology",
    institution: "Continuous Learning",
    description:
      "Ongoing exploration of artificial intelligence, machine learning, and emerging software technologies through self-directed study and community engagement.",
  },
];

// ─── Technologies ─────────────────────────────────────────────────────────────

export interface TechGroup {
  category: string;
  items: string[];
}

export const technologies: TechGroup[] = [
  {
    category: "Programming Languages",
    items: ["Python", "C", "JavaScript", "TypeScript"],
  },
  {
    category: "Web",
    items: ["HTML", "CSS", "React", "Next.js", "Vue", "Django"],
  },
  {
    category: "Backend & Data",
    items: ["Supabase"],
  },
  {
    category: "Applied Technology",
    items: ["AI / ML", "Arduino"],
  },
];

// ─── Values ───────────────────────────────────────────────────────────────────

export interface Value {
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    title: "Practical Impact",
    description:
      "Building useful technology rather than technology for its own sake. The measure of good software is what it enables people to do.",
  },
  {
    title: "Continuous Learning",
    description:
      "Software, AI, and design are evolving disciplines. Staying curious and deliberately building knowledge is a professional responsibility, not a hobby.",
  },
  {
    title: "Human-Centered Thinking",
    description:
      "Technology should make people's work, learning, or access to information better — not harder. Design and engineering decisions both start with this question.",
  },
  {
    title: "Craft & Creativity",
    description:
      "Engineering and visual communication are not separate disciplines. The combination of both produces digital products that work and feel right.",
  },
];

// ─── Current Focus Areas ──────────────────────────────────────────────────────

export interface FocusArea {
  label: string;
}

export const currentFocus: FocusArea[] = [
  { label: "Software development fundamentals and best practices" },
  { label: "Applied AI / ML exploration" },
  { label: "Building complete digital products end-to-end" },
  { label: "Educational technology and accessible digital tools" },
  { label: "Combining software engineering with visual design" },
  { label: "Learning systems: algorithms, data structures, and architecture" },
];
