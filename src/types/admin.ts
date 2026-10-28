export type ProjectStatusType = "showcase" | "active" | "architecture" | "planned";

export interface AdminProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  direction: string;
  technologies: string[];
  status: string;
  statusType: ProjectStatusType;
  published: boolean;
  featured: boolean;
  isPlaceholder?: boolean;
  href: string;
  image: string;
  secondaryImage?: string;
  sortOrder?: number;
  updatedAt: string;
}

export type AppStatusType = "showcase" | "in-development" | "prototype" | "architecture" | "concept";

export interface AdminApp {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  problem: string;
  direction: string;
  technologies: string[];
  status: string;
  statusType: AppStatusType;
  published: boolean;
  featured: boolean;
  highlights: string[];
  image: string;
  secondaryImage?: string;
  demoUrl?: string;
  downloadUrl?: string;
  githubUrl?: string;
  sortOrder?: number;
  updatedAt: string;
}

export interface AdminSkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface AdminEducationItem {
  id: string;
  institution: string;
  field: string;
  status: string;
  note?: string;
  current: boolean;
}

export interface AdminJourneyItem {
  id: string;
  label: string;
  institution: string;
  description: string;
}

export interface AdminMediaAsset {
  id: string;
  filename: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  category: "projects" | "design" | "brand" | "portraits";
  altText: string;
  createdAt: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  entity: string;
  title: string;
  timestamp: string;
  user: string;
}

export interface AdminSiteSettings {
  siteName: string;
  shortBrand: string;
  title: string;
  description: string;
  contactEmail: string;
  affiliation: string;
  socials: {
    platform: string;
    label: string;
    handle: string;
    url: string;
  }[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImageUrl: string;
  };
  appearance: {
    primaryBrand: string;
    accentColor: string;
    supportingColor: string;
    themeDefault: "light" | "dark" | "system";
  };
}
