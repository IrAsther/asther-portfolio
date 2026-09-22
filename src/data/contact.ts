/**
 * Contact Page Data & Configuration — Asther Irakaza Personal Digital Portfolio
 *
 * Contains only verified communication channels and direct contact details.
 * All entries here are confirmed from Asther's own profile screenshots.
 */

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
  platform: "github" | "linkedin" | "instagram" | "twitter" | "telegram" | "whatsapp";
}

export interface ContactConfig {
  email: string;
  socials: SocialLink[];
  affiliation: string;
  topics: string[];
}

export const contactConfig: ContactConfig = {
  email: "irast2007er@gmail.com",

  socials: [
    {
      label: "GitHub",
      handle: "IrAsther",
      url: "https://github.com/IrAsther",
      platform: "github",
    },
    {
      label: "LinkedIn",
      handle: "Asther Irakaza",
      url: "https://www.linkedin.com/in/asther-irakaza-641527377",
      platform: "linkedin",
    },
    {
      label: "Instagram",
      handle: "@asterletsa",
      url: "https://www.instagram.com/asterletsa/",
      platform: "instagram",
    },
    {
      label: "X / Twitter",
      handle: "@AIrast2007er",
      url: "https://x.com/AIrast2007er",
      platform: "twitter",
    },
    {
      label: "Telegram",
      handle: "@Irast2007er",
      url: "https://t.me/Irast2007er",
      platform: "telegram",
    },
    {
      label: "WhatsApp",
      handle: "+257 66 99 83 96",
      url: "https://wa.me/25766998396",
      platform: "whatsapp",
    },
  ],

  affiliation: "University of the People",

  topics: [
    "General Inquiry",
    "Software Application Build",
    "AI / Machine Learning Exploration",
    "Graphic & Interface Design",
    "Educational Technology",
  ],
};
