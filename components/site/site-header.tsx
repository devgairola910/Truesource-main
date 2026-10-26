import Link from "next/link";
import { AuthActions } from "@/components/auth/auth-actions";
import { Chip } from "@/components/ui/chip";
import { NavLinks } from "@/components/site/nav-links";

export function SiteHeader() {
  return (
    <header className="mx-auto mt-6 w-full max-w-6xl rounded-2xl glass-panel px-6 py-5 shadow-sm md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="space-y-1 hover:opacity-80 transition-opacity">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--brand)] font-semibold">
            TrueSource
          </p>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-strong)] md:text-3xl tracking-tight">
            Content Integrity Platform
          </h1>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Chip label="Public Demo" tone="success" />
          <Chip label="MVP" />
          <AuthActions />
        </div>
      </div>
      <div className="mt-6 border-t border-[var(--stroke)] pt-4">
        <NavLinks />
      </div>
    </header>
  );
}
