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
    category: "Mobile Utility",
    summary:
      "A mobile utility that helps small merchants and teams record daily sales, expenses, debts, and transactions from one place without paper notebooks.",
    problem:
      "Daily business records in Burundi often get lost across scattered paper notebooks or slow spreadsheets. Dandaza+ gives shopkeepers a quick mobile interface to capture sales on the spot and generate clean daily summaries.",
    direction:
      "Built with a lightweight mobile-first interface designed for fast record entry and reliable local storage in low-connectivity settings.",
    technologies: ["Mobile UI", "Structured Reporting", "Local Data"],
    status: "Active build",
    statusType: "active",
    isPlaceholder: false,
    featured: true,
    href: "/projects",
    image: "/projects/dandaza-screen.webp",
    secondaryImage: "/projects/dandaza-report.webp",
  },
  {
    id: "ai-applied-system",
    title: "Applied Machine Learning Pipeline",
    category: "Data & ML",
    summary:
      "Data preprocessing and model serving experiments built with Python to test inference latency on structured datasets.",
    problem:
      "Bridging trained models with real applications often fails due to fragile data ingestion. This project focuses on building resilient data transformation pipelines and simple REST endpoints for fast inference.",
    direction:
      "Using Python with structured validation pipelines and lightweight API endpoints to keep inference response times predictable.",
    technologies: ["Python", "Data Pipelines", "Model Serving"],
    status: "In progress",
    statusType: "architecture",
    isPlaceholder: true,
    href: "/projects",
  },
  {
    id: "web-platform-core",
    title: "Component Web Architecture",
    category: "Frontend Architecture",
    summary:
      "A fast, accessible web foundation built with Next.js and pure CSS Modules, focusing on typography, layout performance, and zero layout shift.",
    problem:
      "Heavy UI frameworks often introduce unnecessary bundle weight and layout shift. This platform experiments with building custom, accessible components using strict semantic HTML and native CSS.",
    direction:
      "Next.js App Router, CSS Modules, and strict type safety with zero runtime CSS dependencies to ensure fast page loads on any device.",
    technologies: ["TypeScript", "Next.js", "CSS Modules"],
    status: "In progress",
    statusType: "architecture",
    isPlaceholder: true,
    href: "/projects",
  },
];
