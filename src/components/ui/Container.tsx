import React from "react";
import styles from "./Container.module.css";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  size?: "default" | "narrow" | "wide";
  className?: string;
}

export function Container({
  children,
  as: Component = "div",
  size = "default",
  className = "",
  ...props
}: ContainerProps) {
  const sizeClass = size === "narrow" ? styles.narrow : size === "wide" ? styles.wide : "";
  const combinedClassName = `${styles.container} ${sizeClass} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}
