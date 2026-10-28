export interface SiteConfig {
  name: string;
  shortBrand: string;
  title: string;
  description: string;
  colors: {
    deepTeal: string;
    orange: string;
    warmPeach: string;
    brightOrange: string;
    cream: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Asther Irakaza",
  shortBrand: "ASTHER",
  title: "Software Developer & AI/ML Enthusiast",
  description: "Personal Digital Portfolio of Asther Irakaza — Software Developer & AI/ML Enthusiast.",
  colors: {
    deepTeal: "#01605A",
    orange: "#FF862D",
    warmPeach: "#FFD0A8",
    brightOrange: "#FF862D",
    cream: "#FFD0A8",
  },
};
