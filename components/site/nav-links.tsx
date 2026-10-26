"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Info, Lightbulb, PenTool, Mail } from "@/components/ui/icons";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
  { href: "/services", label: "Services", icon: Lightbulb },
  { href: "/blog", label: "Blog", icon: PenTool },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-wrap gap-2">
      {navigationItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-ink)] shadow-md"
                : "border-transparent bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-strong)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
