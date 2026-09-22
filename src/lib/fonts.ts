/**
 * lib/fonts.ts
 *
 * Centralised next/font/google instances.
 * Import from here — never instantiate next/font inside components
 * because each call creates a separate font request.
 *
 * spaceGrotesk — used exclusively for the BrandWordmark.
 * Geometric, clean, highly legible at all weights.
 * ExtraBold (800) gives the premium tech-brand presence required.
 */
import { Space_Grotesk } from "next/font/google";

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],   // Space Grotesk max is 700; use 700 for the wordmark
  display: "swap",
  variable: "--font-space-grotesk",
});
