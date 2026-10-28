/**
 * Data Access Layer — Site Settings
 *
 * Server-only module.
 * Queries Supabase site_settings with fallback to static siteConfig.
 */

import "server-only";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { siteConfig } from "@/data/siteConfig";

export interface SiteSettingsDTO {
  siteName: string;
  shortBrand: string;
  title: string;
  description: string;
  contactEmail: string;
  affiliation: string;
  appearance: {
    primaryBrand: string;
    accentColor: string;
    supportingColor: string;
    themeDefault: string;
  };
}

const defaultSettings: SiteSettingsDTO = {
  siteName: "Asther Irakaza",
  shortBrand: "Asther",
  title: siteConfig.title,
  description: siteConfig.description,
  contactEmail: "asther.irakaza@example.com",
  affiliation: "University of the People",
  appearance: {
    primaryBrand: "#01605A",
    accentColor: "#FF862D",
    supportingColor: "#FFD0A8",
    themeDefault: "dark",
  },
};

/**
 * Public query: Fetch site configuration and appearance settings.
 */
export async function getSiteSettings(): Promise<SiteSettingsDTO> {
  if (!isSupabaseConfigured()) {
    return defaultSettings;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "site_config")
      .single();

    if (error || !data || !data.value) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...(data.value as Partial<SiteSettingsDTO>),
    };
  } catch {
    return defaultSettings;
  }
}
