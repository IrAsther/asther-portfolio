/**
 * AboutPortrait — re-exports HeroPortrait directly.
 *
 * This is intentional: both the Home Hero and About Hero use
 * the EXACT same portrait component, same CSS module, same
 * animations, same clip-path, same parallax behavior.
 *
 * Do NOT duplicate the implementation here.
 * The single source of truth is HeroPortrait.tsx.
 */
export { HeroPortrait as AboutPortrait } from "@/components/home/HeroPortrait";
