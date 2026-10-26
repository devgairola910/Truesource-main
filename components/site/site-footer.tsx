import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="mx-auto mb-6 mt-8 w-full max-w-6xl rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] px-5 py-5 text-sm text-[var(--text-muted)] md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <p className="font-semibold text-[var(--text-strong)]">TrueSource</p>
          <p>
            We help media teams detect unauthorized reuse faster with explainable evidence,
            responsible workflows, and measurable outcomes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1 transition hover:bg-[var(--surface-1)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-[var(--text-soft)]">
        Copyright {new Date().getFullYear()} TrueSource. Built for explainable content protection.
      </p>
    </footer>
  );
}
