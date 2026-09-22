/**
 * Resume / Curriculum Vitae Data — Asther Irakaza Personal Digital Portfolio
 *
 * Contains only verified, authentic information.
 * Never invent employers, job titles, years of employment, clients, salaries,
 * awards, certifications, publications, or metrics.
 */

export interface ResumeProfile {
  name: string;
  role: string;
  subtitles: string[];
  positioning: string;
  summary: string;
  contact: {
    github: string;
    contactRoute: string;
    portfolioRoute: string;
    educationAffiliation: string;
  };
}

export const resumeProfile: ResumeProfile = {
  name: "Asther Irakaza",
  role: "Software Developer",
  subtitles: [
    "Computer Science Student",
    "AI/ML Enthusiast",
    "Graphic Designer",
  ],
  positioning:
    "Computer Science Student @ University of the People | Aspiring Software Developer | AI & Machine Learning Enthusiast | Graphic Designer | Building Technology for Real-World Impact",
  summary:
    "Software developer and computer science student with a focused commitment to building functional web applications, intelligent systems, and accessible digital utilities. Combines formal academic study with hands-on application engineering—integrating modern frontend architectures, relational databases, AI model pipelines, and human-centered design principles to solve practical operational and educational challenges.",
  contact: {
    github: "https://github.com/IrAsther",
    contactRoute: "/contact",
    portfolioRoute: "/",
    educationAffiliation: "University of the People",
  },
};

export interface ResumeSkillGroup {
  category: string;
  skills: string[];
}

export const resumeSkillGroups: ResumeSkillGroup[] = [
  {
    category: "Programming Languages",
    skills: ["Python", "C", "JavaScript", "TypeScript", "HTML5", "CSS3"],
  },
  {
    category: "Web Frameworks & Libraries",
    skills: ["Next.js", "React", "Vue 3", "Django"],
  },
  {
    category: "Backend & Databases",
    skills: ["Supabase", "PostgreSQL", "Row-Level Security (RLS)"],
  },
  {
    category: "AI & Intelligent Systems",
    skills: ["Python", "AI / ML Pipelines", "AI Model Integration"],
  },
  {
    category: "Hardware & Prototyping",
    skills: ["Arduino"],
  },
  {
    category: "Design & Creative Tools",
    skills: ["Photoshop", "Canva"],
  },
];

export interface ResumeEducationItem {
  institution: string;
  field: string;
  status: string;
  note?: string;
  current?: boolean;
}

export const resumeEducation: ResumeEducationItem[] = [
  {
    institution: "University of the People",
    field: "Computer Science",
    status: "Current studies",
    note: "Online Bachelor of Science degree program focusing on software engineering, data structures, algorithms, and computational principles.",
    current: true,
  },
  {
    institution: "Institut des Technologies Numériques (ITN)",
    field: "Technology & Computer Science Studies",
    status: "Completed foundational studies",
    note: "University of Burundi. Immersive academic coursework in computer science foundations, information technology, and programming principles.",
    current: false,
  },
];

export interface ResumeProjectItem {
  id: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  technologies: string[];
  focusAreas: string[];
}

export const resumeProjects: ResumeProjectItem[] = [
  {
    id: "dandaza-plus",
    title: "Dandaza+",
    category: "Mobile & Digital Utility",
    status: "Project Showcase",
    summary:
      "A practical mobile application created to streamline operational daily reporting, structured record keeping, and lightweight data management.",
    technologies: ["Digital Tools", "Mobile UI", "Data Management", "Structured Reporting"],
    focusAreas: [
      "Low-friction record input workflows",
      "Immediate operational status reporting",
      "Human-centered interface ergonomics",
    ],
  },
  {
    id: "ese",
    title: "ESE — Encyclopédie Scolaire Électronique",
    category: "EdTech Platform",
    status: "In Development",
    summary:
      "An electronic educational encyclopedia platform designed to organize curriculum materials, structured academic references, and accessible student resources.",
    technologies: ["Vue 3", "Supabase", "PostgreSQL", "Role-Based Access", "Storage & RLS"],
    focusAreas: [
      "Curriculum-aligned reference cataloging",
      "Row-level security (RLS) and auth",
      "Accessible academic resource sharing",
    ],
  },
  {
    id: "asa",
    title: "ASA — AI Study Assistant",
    category: "AI / Education",
    status: "In Development",
    summary:
      "An intelligent academic study companion exploring conversational revision aids, topic breakdown workflows, and focused learning support.",
    technologies: ["Vue 3", "Pinia", "Supabase", "AI Integration", "Prompt Pipelines"],
    focusAreas: [
      "Modular prompt pipelines for concept revision",
      "Reactive state management for study sessions",
      "Student learning context tracking",
    ],
  },
];

export interface ResumeDirectionTheme {
  title: string;
  summary: string;
  description: string;
}

export const resumeDirections: ResumeDirectionTheme[] = [
  {
    title: "Software Development",
    summary: "Reliable, typed web platforms and applications",
    description:
      "Building resilient web platforms and tools with strict component architectures, accessible design systems, and responsive user experiences.",
  },
  {
    title: "AI & Machine Learning",
    summary: "Intelligent systems and practical AI integration",
    description:
      "Experimenting with applied machine learning pipelines, conversational study aids, and contextual intelligence to solve everyday problems.",
  },
  {
    title: "Education Technology",
    summary: "Accessible tools for student learning",
    description:
      "Designing platforms and electronic encyclopedias that eliminate barriers to verified educational materials for secondary and university students.",
  },
  {
    title: "Digital Product Design",
    summary: "Combining engineering with visual clarity",
    description:
      "Applying graphic design craft (Photoshop, Canva) to technical workflows, ensuring software looks, communicates, and feels right.",
  },
];
