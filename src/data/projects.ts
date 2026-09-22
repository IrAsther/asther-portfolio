export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  problem?: string;
  direction?: string;
  technologies: string[];
  isPlaceholder?: boolean;
  status: string;
  statusType?: "showcase" | "active" | "architecture" | "planned";
  href?: string;
  image?: string;
  secondaryImage?: string;
  featured?: boolean;
}

export const featuredProjects: Project[] = [
  {
    id: "dandaza-plus",
    title: "Dandaza+",
    category: "Mobile & Digital Application",
    summary:
      "A digital platform providing streamlined user workflows, structured record reporting, and interactive mobile utilities.",
    problem:
      "Everyday organizational operations and record tracking often struggle with fragmented paperwork and complex software tools. Dandaza+ provides an accessible, mobile-first workflow for capturing, reporting, and managing structured activity data.",
    direction:
      "Lightweight mobile interface engineering focused on fast, clear record entry, instant reporting feedback, and intuitive daily productivity.",
    technologies: ["Digital Tools", "Mobile UI", "Data Management", "Structured Reporting"],
    status: "Project Showcase",
    statusType: "showcase",
    isPlaceholder: false,
    featured: true,
    href: "/projects",
    image: "/projects/dandaza-screen.webp",
    secondaryImage: "/projects/dandaza-report.webp",
  },
  {
    id: "ai-applied-system",
    title: "Applied AI / ML Solution",
    category: "Intelligent Systems",
    summary:
      "Engineering architecture and model integration for applied machine learning problem-solving.",
    problem:
      "Bridging machine learning models with functional user environments requires resilient ingestion pipelines, low-latency inference endpoints, and clear interpretability.",
    direction:
      "Developing end-to-end Python-based architectures integrating structured data preprocessing and responsive model serving.",
    technologies: ["Python", "AI / ML", "Data Pipelines", "Model Integration"],
    status: "Architecture In Progress",
    statusType: "architecture",
    isPlaceholder: true,
    href: "/projects",
  },
  {
    id: "web-platform-core",
    title: "Modern Web Application",
    category: "Full-Stack Development",
    summary:
      "Production-ready web platform built with modern component architectures, type safety, and responsive UX.",
    problem:
      "Delivering accessible, zero-CLS web interfaces with scalable component architecture and rigorous type-safety across multi-device viewports.",
    direction:
      "Next.js App Router foundation featuring CSS Modules, strict accessibility standards, dynamic theme transitions, and optimized assets.",
    technologies: ["TypeScript", "Next.js", "Modern CSS", "Web Architecture"],
    status: "Documentation In Progress",
    statusType: "architecture",
    isPlaceholder: true,
    href: "/projects",
  },
];
