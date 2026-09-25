/**
 * BrandWordmark — Renders the provided brand logo PNG
 */
import Image from "next/image";

export type WordmarkSize = "header" | "hero";

interface BrandWordmarkProps {
  size?: WordmarkSize;
  as?: React.ElementType;
  className?: string;
}

export function BrandWordmark({
  size = "header",
  as: Component = "span",
  className = "",
}: BrandWordmarkProps) {
  const dim = size === "hero" ? 160 : 80;

  return (
    <Component className={className}>
      <Image
        src="/Asther_logo.png"
        alt="Asther Logo"
        width={dim}
        height={dim}
        priority
        style={{ objectFit: "contain", height: "auto" }}
      />
    </Component>
  );
}
