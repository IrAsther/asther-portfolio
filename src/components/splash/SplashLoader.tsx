"use client";

/**
 * SplashLoader — dynamic import wrapper
 *
 * Ensures SplashScreen is:
 *  1. Client-side only (ssr: false) — uses sessionStorage which doesn't exist on server
 *  2. Code-split from the main homepage bundle
 *  3. Loaded with no fallback (nothing visible until ready — the stage fades in anyway)
 */

import dynamic from "next/dynamic";

export const SplashLoader = dynamic(
  () => import("./SplashScreen").then((m) => m.SplashScreen),
  { ssr: false, loading: () => null }
);

