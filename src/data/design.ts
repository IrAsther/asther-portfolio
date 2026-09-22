/**
 * Graphic Design Portfolio Data — Asther Irakaza Personal Digital Portfolio
 *
 * Contains authentic design assets, visual identity records, and design philosophy.
 * Never invent fake clients, awards, agencies, or commercial contracts.
 */

export interface DesignWork {
  id: string;
  title: string;
  category: "UI / Interface Design" | "Editorial & Document Layout" | "Branding & Visual Patterns";
  categoryKey: "ui" | "editorial" | "branding";
  description: string;
  image: string;
  width: number;
  height: number;
  aspectRatio: string;
  tools: string[];
  featured?: boolean;
  alt: string;
}

export const designWorks: DesignWork[] = [
  {
    id: "scholarly-asa-ui",
    title: "Scholarly ASA — AI Assistant Web Interface",
    category: "UI / Interface Design",
    categoryKey: "ui",
    description:
      "Full desktop web interface design for Scholarly ASA (AI Study Assistant). Designed with a clean editorial aesthetic, structured prompt curation cards, and calm conversational typography.",
    image: "/design/scholarly-asa-ui.jpg",
    width: 1600,
    height: 1426,
    aspectRatio: "16 / 14",
    tools: ["UI Design", "Canva", "Photoshop"],
    featured: true,
    alt: "Scholarly ASA desktop web application interface showing study curation prompts, conversation history, and search bar",
  },
  {
    id: "dandaza-dashboard",
    title: "Dandaza+ Mobile Dashboard UI",
    category: "UI / Interface Design",
    categoryKey: "ui",
    description:
      "Clean mobile operational dashboard with high-contrast metric cards, instant revenue reporting in Burundian Francs (FBu), and quick-action buttons.",
    image: "/design/dandaza-dashboard-ui.png",
    width: 720,
    height: 1600,
    aspectRatio: "9 / 16",
    tools: ["Mobile UI", "Photoshop", "Interface Design"],
    alt: "Dandaza+ mobile interface dashboard showing daily metrics, revenue cards, and quick action buttons",
  },
  {
    id: "dandaza-pdf-report",
    title: "Dandaza+ Structured Document & PDF Invoice Layout",
    category: "Editorial & Document Layout",
    categoryKey: "editorial",
    description:
      "Structured typographical document layout for daily business reporting ('Raporo y'Umusi'). Combines clean tabular data, financial totals, and printable mobile actions.",
    image: "/design/ui-preview-2.png",
    width: 720,
    height: 1600,
    aspectRatio: "9 / 16",
    tools: ["Document Design", "Canva", "Photoshop"],
    alt: "Dandaza+ structured business document showing formatted financial tables, invoice totals, and print controls",
  },
  {
    id: "dandaza-report-ui",
    title: "Dandaza+ Multi-Period Report View",
    category: "UI / Interface Design",
    categoryKey: "ui",
    description:
      "Time-segmented reporting interface with day, week, and month tabs ('Umusi', 'Indwi', 'Ukwezi'), category breakdown tiles, and export actions.",
    image: "/design/ui-preview-1.png",
    width: 720,
    height: 1600,
    aspectRatio: "9 / 16",
    tools: ["Interface Design", "Photoshop"],
    alt: "Dandaza+ reporting interface screen with day, week, month tabs and status summaries in FBu",
  },
  {
    id: "dandaza-settings-ui",
    title: "Dandaza+ Configuration & Localization Screen",
    category: "UI / Interface Design",
    categoryKey: "ui",
    description:
      "Settings screen architecture featuring bilingual language selection (Français / Kirundi), cloud backup state, and account recovery controls.",
    image: "/design/dandaza-settings-ui.png",
    width: 720,
    height: 1600,
    aspectRatio: "9 / 16",
    tools: ["Mobile UI", "Photoshop"],
    alt: "Dandaza+ settings screen with language toggles between French and Kirundi and backup options",
  },
  {
    id: "dandaza-logo-mark",
    title: "Dandaza+ App Icon & Brand Identity Mark",
    category: "Branding & Visual Patterns",
    categoryKey: "branding",
    description:
      "Minimalist application icon combining a commerce shopping bag silhouette with a stylized 'D+' monogram in vivid blue and green.",
    image: "/design/dandaza-logo.png",
    width: 720,
    height: 1600,
    aspectRatio: "9 / 16",
    tools: ["Logo Design", "Photoshop", "Brand Identity"],
    alt: "Dandaza+ application logo icon mark featuring shopping bag silhouette with D+ monogram",
  },
  {
    id: "abstract-wave-pattern",
    title: "Organic Wave & Fluid Brand Pattern",
    category: "Branding & Visual Patterns",
    categoryKey: "branding",
    description:
      "Custom abstract visual asset exploring fluid, organic contours in the portfolio's Bright Orange (#FD5E02) and Cream (#FCF5E3) palette.",
    image: "/design/pattern-1.jpg",
    width: 736,
    height: 1104,
    aspectRatio: "2 / 3",
    tools: ["Pattern Design", "Canva", "Photoshop"],
    alt: "Abstract organic fluid wave pattern in orange and cream brand colors",
  },
  {
    id: "geometric-brand-pattern",
    title: "Geometric Modular Arc Composition",
    category: "Branding & Visual Patterns",
    categoryKey: "branding",
    description:
      "Rhythmic geometric pattern using circular arcs and quadrant segments in deep forest teal, golden amber, and warm cream.",
    image: "/design/pattern-2.jpg",
    width: 736,
    height: 1104,
    aspectRatio: "2 / 3",
    tools: ["Vector Pattern", "Canva"],
    alt: "Geometric arc pattern in deep teal and warm amber on cream background",
  },
];

export interface DesignPrinciple {
  number: string;
  title: string;
  summary: string;
  description: string;
}

export const designPrinciples: DesignPrinciple[] = [
  {
    number: "01",
    title: "Clarity",
    summary: "Information over decoration",
    description:
      "Visual design should make complex systems and dense data intuitively legible. If an element does not clarify or guide, it does not belong.",
  },
  {
    number: "02",
    title: "Hierarchy",
    summary: "Typography & spatial rhythm",
    description:
      "Deliberate type scaling, proportional whitespace, and intentional contrast direct user attention naturally from primary ideas to supporting details.",
  },
  {
    number: "03",
    title: "Consistency",
    summary: "Coherent design systems",
    description:
      "Visual rules, color tokens, and spatial grids must remain unified across interfaces, print layouts, and digital branding assets.",
  },
  {
    number: "04",
    title: "Purpose",
    summary: "Aesthetics serving real goals",
    description:
      "Every color, border, and compositional choice serves a communicative or operational purpose—strengthening the real-world product experience.",
  },
];

export interface DesignTool {
  name: string;
  category: string;
  purpose: string;
  experienceContext: string;
}

export const designTools: DesignTool[] = [
  {
    name: "Adobe Photoshop",
    category: "Raster & Image Composition",
    purpose: "Image manipulation, asset extraction, digital compositions, and visual mockups.",
    experienceContext: "Primary tool for pixel-level asset preparation, contrast balancing, and graphic creation.",
  },
  {
    name: "Canva",
    category: "Layout & Rapid Prototyping",
    purpose: "Brand presentation decks, digital posters, social assets, and typographic layouts.",
    experienceContext: "Applied for fast visual ideation, layout experiments, and editorial document styling.",
  },
  {
    name: "CSS Design Systems & SVG",
    category: "Code-Level Design Craft",
    purpose: "Design token orchestration, responsive CSS grids, vector iconography, and micro-interactions.",
    experienceContext: "Bridging visual mockups directly into production-grade, accessible web interfaces.",
  },
];
