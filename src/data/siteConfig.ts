export interface SiteConfig {
  name: string;
  shortBrand: string;
  title: string;
  description: string;
  colors: {
    deepTeal: string;
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
    deepTeal: "#023341",
    brightOrange: "#FD5E02",
    cream: "#FCF5E3",
  },
};
