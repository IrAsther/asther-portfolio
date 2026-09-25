import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { siteConfig } from "@/data/siteConfig";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { ThemeScript } from "@/lib/theme/ThemeScript";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/* ── Display / Major Headings: Archivo Black (400 only) ─────────── */
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/* ── Body / UI: Inter (400, 500, 600, 700) ──────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL("https://asther.dev"),
  keywords: [
    "Asther Irakaza",
    "Software Developer",
    "AI/ML Enthusiast",
    "Portfolio",
    "Full Stack Developer",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skipLink">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="mainContent">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
