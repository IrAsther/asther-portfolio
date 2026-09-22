export interface NavItem {
  label: string;
  href: string;
}

export const navigationItems: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Apps", href: "/apps" },
  { label: "Resume", href: "/resume" },
  { label: "Design", href: "/design" },
  { label: "Contact", href: "/contact" },
];
