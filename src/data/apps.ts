/**
 * Applications Page Data — Asther Irakaza Personal Digital Portfolio
 *
 * Contains authentic application records and verified development directions.
 * Never invent fake metrics, user counts, download statistics, or fake URLs.
 */

export interface AppItem {
  id: string;
  name: string;
  category: string;
  description: string;
  problem: string;
  direction: string;
  technologies: string[];
  status: string;
  statusType: "showcase" | "in-development" | "prototype" | "architecture" | "concept";
  featured?: boolean;
  image?: string;
  secondaryImage?: string;
  href?: string;
  highlights: string[];
}

export const appsData: AppItem[] = [
  {
    id: "dandaza-plus",
    name: "Dandaza+",
    category: "Mobile & Digital Utility",
    description:
      "A focused mobile application engineered for organized daily reporting, structured activity tracking, and accessible operational utility.",
    problem:
      "Operational tracking and everyday reporting frequently rely on fragmented physical notes or overly complex desktop software, causing friction and delay.",
    direction:
      "Creating an intuitive mobile-first interface optimized for rapid data capture, structured record summaries, and clear status overviews.",
    technologies: ["Digital Tools", "Mobile UI", "Data Management", "Structured Reporting"],
    status: "Live / Showcase",
    statusType: "showcase",
    featured: true,
    image: "/projects/dandaza-screen.webp",
    secondaryImage: "/projects/dandaza-report.webp",
    highlights: [
      "Streamlined activity record entry",
      "Immediate report generation & overview",
      "Low-friction mobile navigation",
    ],
  },
  {
    id: "ese",
    name: "ESE — Encyclopédie Scolaire Électronique",
    category: "EdTech Platform",
    description:
      "An electronic educational encyclopedia platform designed to organize curriculum materials, structured academic references, and accessible student resources.",
    problem:
      "Secondary and post-secondary learners often face barriers accessing centralized, curriculum-aligned academic reference materials and verified study documents.",
    direction:
      "Architecting a performant Vue 3 web platform integrated with Supabase for role-based content access, structured PostgreSQL schema, and secure document storage.",
    technologies: ["Vue 3", "Supabase", "PostgreSQL", "Role-Based Access", "Storage & RLS"],
    status: "In Development",
    statusType: "in-development",
    featured: false,
    highlights: [
      "Curriculum reference organization",
      "Row-level security (RLS) & auth",
      "Structured academic cataloging",
    ],
  },
  {
    id: "asa",
    name: "ASA — AI Study Assistant",
    category: "AI / Education",
    description:
      "An intelligent academic study companion exploring conversational learning aids, topic breakdown workflows, and focused study assistance.",
    problem:
      "Students revising complex STEM and computer science subjects require active, conversational guidance to test comprehension and break down difficult concepts.",
    direction:
      "Developing a reactive assistant interface using Vue 3 and Pinia state management, paired with Supabase authentication and modular AI prompt pipelines.",
    technologies: ["Vue 3", "Pinia", "Supabase", "AI Integration", "Prompt Pipelines"],
    status: "In Development",
    statusType: "in-development",
    featured: false,
    highlights: [
      "Targeted study & revision modes",
      "Reactive conversation state management",
      "Student learning context tracking",
    ],
  },
];

export interface ProcessStage {
  step: string;
  title: string;
  summary: string;
  description: string;
}

export const productProcess: ProcessStage[] = [
  {
    step: "01",
    title: "Understand",
    summary: "Identify the real problem",
    description:
      "Every software application begins by observing an actual operational or educational friction point and the real people affected by it.",
  },
  {
    step: "02",
    title: "Design",
    summary: "Formulate experience & architecture",
    description:
      "Transforming functional needs into clean user flows, data models, and architectural boundaries before writing production code.",
  },
  {
    step: "03",
    title: "Build",
    summary: "Develop with disciplined tools",
    description:
      "Implementing the product with robust, accessible technologies—combining reactive frontends, resilient backends, and strict typing.",
  },
  {
    step: "04",
    title: "Improve",
    summary: "Test, refine, and iterate",
    description:
      "Evaluating interface responsiveness, data integrity, and real-world clarity to iteratively strengthen the product.",
  },
];

export interface TechStackGroup {
  name: string;
  description: string;
  technologies: string[];
}

export const applicationTechGroups: TechStackGroup[] = [
  {
    name: "Frontend",
    description: "Component architectures, responsive layout, and reactive state",
    technologies: ["React", "Next.js", "Vue 3", "TypeScript", "JavaScript", "HTML5", "CSS Modules"],
  },
  {
    name: "Backend & Data",
    description: "Persistent storage, relational modeling, and secure access",
    technologies: ["Supabase", "PostgreSQL", "Row-Level Security (RLS)", "Django"],
  },
  {
    name: "AI & Intelligent Systems",
    description: "Model integration, data processing, and contextual assistance",
    technologies: ["Python", "AI / ML Pipelines", "AI APIs"],
  },
  {
    name: "Prototyping & Hardware",
    description: "Physical computing and embedded interaction exploration",
    technologies: ["Arduino"],
  },
];
