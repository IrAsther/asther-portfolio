/**
 * lib/fonts.ts
 *
 * Centralised next/font/google instances.
 * Import from here — never instantiate next/font inside components
 * because each call creates a separate font request.
 *
 * Archivo Black — 400 only (Display, major headings, wordmark)
 * Inter — 400, 500, 600, 700 (Body, UI, controls, navigation)
 */
import { Archivo_Black, Inter } from "next/font/google";

export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-archivo-black",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
