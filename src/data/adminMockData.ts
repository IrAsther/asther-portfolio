import {
  AdminProject,
  AdminApp,
  AdminSkillCategory,
  AdminEducationItem,
  AdminJourneyItem,
  AdminMediaAsset,
  AdminActivity,
  AdminSiteSettings,
} from "@/types/admin";

export const initialProjects: AdminProject[] = [
  {
    id: "proj-1",
    slug: "dandaza-plus",
    title: "Dandaza+",
    category: "Mobile Utility",
    summary:
      "A mobile utility that helps small merchants and teams record daily sales, expenses, debts, and transactions from one place without paper notebooks.",
    problem:
      "Daily business records in Burundi often get lost across scattered paper notebooks or slow spreadsheets. Dandaza+ gives shopkeepers a quick mobile interface to capture sales on the spot and generate clean daily summaries.",
    direction:
      "Built with a lightweight mobile-first interface designed for fast record entry and reliable local storage in low-connectivity settings.",
    technologies: ["Mobile UI", "Structured Reporting", "Local Data", "TypeScript"],
    status: "Active build",
    statusType: "active",
    published: true,
    featured: true,
    href: "/projects",
    image: "/projects/dandaza-screen.webp",
    secondaryImage: "/projects/dandaza-report.webp",
    updatedAt: "2026-10-24 14:30",
  },
  {
    id: "proj-2",
    slug: "ai-applied-system",
    title: "Applied Machine Learning Pipeline",
    category: "Data & ML",
    summary:
      "Data preprocessing and model serving experiments built with Python to test inference latency on structured datasets.",
    problem:
      "Bridging trained models with real applications often fails due to fragile data ingestion. This project focuses on building resilient data transformation pipelines and simple REST endpoints for fast inference.",
    direction:
      "Using Python with structured validation pipelines and lightweight API endpoints to keep inference response times predictable.",
    technologies: ["Python", "Data Pipelines", "Model Serving", "FastAPI"],
    status: "In progress",
    statusType: "architecture",
    published: true,
    featured: false,
    href: "/projects",
    image: "/design/scholarly-asa-ui.jpg",
    updatedAt: "2026-10-20 11:15",
  },
  {
    id: "proj-3",
    slug: "web-platform-core",
    title: "Component Web Architecture",
    category: "Frontend Architecture",
    summary:
      "A fast, accessible web foundation built with Next.js and pure CSS Modules, focusing on typography, layout performance, and zero layout shift.",
    problem:
      "Heavy UI frameworks often introduce unnecessary bundle weight and layout shift. This platform experiments with building custom, accessible components using strict semantic HTML and native CSS.",
    direction:
      "Next.js App Router, CSS Modules, and strict type safety with zero runtime CSS dependencies to ensure fast page loads on any device.",
    technologies: ["TypeScript", "Next.js", "CSS Modules", "Performance"],
    status: "In progress",
    statusType: "architecture",
    published: false,
    featured: false,
    href: "/projects",
    image: "/projects/dandaza-report.webp",
    updatedAt: "2026-10-18 09:45",
  },
];

export const initialApps: AdminApp[] = [
  {
    id: "app-1",
    slug: "dandaza-plus",
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
    published: true,
    featured: true,
    image: "/projects/dandaza-screen.webp",
    secondaryImage: "/projects/dandaza-report.webp",
    highlights: [
      "Streamlined activity record entry",
      "Immediate report generation & overview",
      "Low-friction mobile navigation",
    ],
    demoUrl: "https://dandaza.demo.internal",
    downloadUrl: "https://github.com/IrAsther/dandaza-plus/releases",
    githubUrl: "https://github.com/IrAsther",
    updatedAt: "2026-10-25 16:00",
  },
  {
    id: "app-2",
    slug: "ese",
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
    published: true,
    featured: false,
    image: "/design/ui-preview-1.png",
    highlights: [
      "Curriculum reference organization",
      "Row-level security (RLS) & auth",
      "Structured academic cataloging",
    ],
    githubUrl: "https://github.com/IrAsther/ese-platform",
    updatedAt: "2026-10-22 10:20",
  },
  {
    id: "app-3",
    slug: "asa",
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
    published: true,
    featured: false,
    image: "/design/scholarly-asa-ui.jpg",
    highlights: [
      "Targeted study & revision modes",
      "Reactive conversation state management",
      "Student learning context tracking",
    ],
    githubUrl: "https://github.com/IrAsther/asa-assistant",
    updatedAt: "2026-10-21 17:40",
  },
];

export const initialSkillCategories: AdminSkillCategory[] = [
  {
    id: "cat-1",
    name: "Programming Languages",
    skills: ["Python", "C", "JavaScript", "TypeScript", "HTML5", "CSS3"],
  },
  {
    id: "cat-2",
    name: "Web Frameworks & Libraries",
    skills: ["Next.js", "React", "Vue 3", "Django"],
  },
  {
    id: "cat-3",
    name: "Backend & Databases",
    skills: ["Supabase", "PostgreSQL", "Row-Level Security (RLS)"],
  },
  {
    id: "cat-4",
    name: "AI & Intelligent Systems",
    skills: ["Python", "AI / ML Pipelines", "AI Model Integration"],
  },
  {
    id: "cat-5",
    name: "Hardware & Design",
    skills: ["Arduino", "Photoshop", "Canva"],
  },
];

export const initialEducation: AdminEducationItem[] = [
  {
    id: "edu-1",
    institution: "University of the People",
    field: "Computer Science",
    status: "Current studies",
    note: "Online Bachelor of Science degree program focusing on software engineering, data structures, algorithms, and computational principles.",
    current: true,
  },
  {
    id: "edu-2",
    institution: "Institut des Technologies Numériques (ITN)",
    field: "Technology & Computer Science Studies",
    status: "Completed foundational studies",
    note: "University of Burundi. Immersive academic coursework in computer science foundations, information technology, and programming principles.",
    current: false,
  },
];

export const initialJourney: AdminJourneyItem[] = [
  {
    id: "j-1",
    label: "Secondary School",
    institution: "GISENYI School",
    description: "Foundational education and early formation of analytical thinking.",
  },
  {
    id: "j-2",
    label: "Secondary School",
    institution: "BUTARA School",
    description: "Continued academic development and growing interest in technology.",
  },
  {
    id: "j-3",
    label: "Technology Studies",
    institution: "Institut des Technologies Numériques",
    description: "Formal immersion in computer science and digital technologies at the University of Burundi.",
  },
  {
    id: "j-4",
    label: "Computer Science",
    institution: "University of the People",
    description: "Online Computer Science degree program — currently enrolled, building structured knowledge in software engineering.",
  },
];

export const initialMediaAssets: AdminMediaAsset[] = [
  {
    id: "med-1",
    filename: "dandaza-screen.webp",
    url: "/projects/dandaza-screen.webp",
    storagePath: "projects/dandaza-screen.webp",
    sizeBytes: 142500,
    mimeType: "image/webp",
    category: "projects",
    altText: "Dandaza+ mobile interface operational dashboard screen",
    createdAt: "2026-10-15",
  },
  {
    id: "med-2",
    filename: "dandaza-report.webp",
    url: "/projects/dandaza-report.webp",
    storagePath: "projects/dandaza-report.webp",
    sizeBytes: 138200,
    mimeType: "image/webp",
    category: "projects",
    altText: "Dandaza+ structured business reporting interface in FBu",
    createdAt: "2026-10-15",
  },
  {
    id: "med-3",
    filename: "scholarly-asa-ui.jpg",
    url: "/design/scholarly-asa-ui.jpg",
    storagePath: "general/scholarly-asa-ui.jpg",
    sizeBytes: 420000,
    mimeType: "image/jpeg",
    category: "design",
    altText: "Scholarly ASA desktop conversational AI web interface mockup",
    createdAt: "2026-10-18",
  },
  {
    id: "med-4",
    filename: "ui-preview-1.png",
    url: "/design/ui-preview-1.png",
    storagePath: "general/ui-preview-1.png",
    sizeBytes: 285000,
    mimeType: "image/png",
    category: "design",
    altText: "Mobile report view interface screen with day, week, month segmentation",
    createdAt: "2026-10-19",
  },
  {
    id: "med-5",
    filename: "Asther_logo.png",
    url: "/Asther_logo.png",
    storagePath: "general/Asther_logo.png",
    sizeBytes: 50658,
    mimeType: "image/png",
    category: "brand",
    altText: "Asther monogram circular geometry logo mark",
    createdAt: "2026-09-20",
  },
  {
    id: "med-6",
    filename: "hero-portrait-transparent.webp",
    url: "/hero-portrait-transparent.webp",
    storagePath: "general/hero-portrait-transparent.webp",
    sizeBytes: 31214,
    mimeType: "image/webp",
    category: "portraits",
    altText: "Asther Irakaza photographic portrait transparent cutout",
    createdAt: "2026-09-22",
  },
];

export const initialRecentActivity: AdminActivity[] = [
  {
    id: "act-1",
    action: "Updated Theme Tokens",
    entity: "Design System",
    title: "Applied Deep Teal (#01605A), Orange (#FF862D), and Warm Peach (#FFD0A8)",
    timestamp: "Just now",
    user: "Asther Irakaza",
  },
  {
    id: "act-2",
    action: "Published Project",
    entity: "Project",
    title: "Dandaza+ — Mobile Utility",
    timestamp: "2 hours ago",
    user: "Asther Irakaza",
  },
  {
    id: "act-3",
    action: "Updated Status",
    entity: "Application",
    title: "ESE Platform set to In Development",
    timestamp: "Yesterday",
    user: "Asther Irakaza",
  },
  {
    id: "act-4",
    action: "Added Media Asset",
    entity: "Media Library",
    title: "Uploaded scholarly-asa-ui.jpg (420 KB)",
    timestamp: "3 days ago",
    user: "Asther Irakaza",
  },
];

export const initialSettings: AdminSiteSettings = {
  siteName: "Asther Irakaza",
  shortBrand: "ASTHER",
  title: "Software Developer & AI/ML Enthusiast",
  description: "Personal Digital Portfolio of Asther Irakaza — Software Developer, AI/ML Enthusiast, and Graphic Designer.",
  contactEmail: "irast2007er@gmail.com",
  affiliation: "University of the People",
  socials: [
    { platform: "github", label: "GitHub", handle: "IrAsther", url: "https://github.com/IrAsther" },
    { platform: "linkedin", label: "LinkedIn", handle: "Asther Irakaza", url: "https://www.linkedin.com/in/asther-irakaza-641527377" },
    { platform: "instagram", label: "Instagram", handle: "@asterletsa", url: "https://www.instagram.com/asterletsa/" },
    { platform: "twitter", label: "X / Twitter", handle: "@AIrast2007er", url: "https://x.com/AIrast2007er" },
    { platform: "telegram", label: "Telegram", handle: "@Irast2007er", url: "https://t.me/Irast2007er" },
    { platform: "whatsapp", label: "WhatsApp", handle: "+257 66 99 83 96", url: "https://wa.me/25766998396" },
  ],
  seo: {
    metaTitle: "Asther Irakaza — Software Developer & AI/ML Enthusiast",
    metaDescription: "Explore engineering showcases, intelligent systems, and digital product designs by Asther Irakaza.",
    keywords: ["Asther Irakaza", "Software Developer", "Burundi", "Computer Science", "AI/ML", "Next.js"],
    ogImageUrl: "/projects/dandaza-screen.webp",
  },
  appearance: {
    primaryBrand: "#01605A",
    accentColor: "#FF862D",
    supportingColor: "#FFD0A8",
    themeDefault: "system",
  },
};
