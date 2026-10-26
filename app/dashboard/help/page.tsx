"use client";

import Link from "next/link";

const sections = [
  {
    title: "Getting Started",
    items: [
      { label: "Quick start guide", desc: "Learn how to set up your workspace and upload your first asset" },
      { label: "Understanding the dashboard", desc: "Overview of KPIs, activity feed, and review queue" },
      { label: "Uploading assets", desc: "How to register official media for protection" },
    ],
  },
  {
    title: "Detection & Monitoring",
    items: [
      { label: "How detection works", desc: "Understanding perceptual hashing, embeddings, and signal layering" },
      { label: "Scan configuration", desc: "Setting up and scheduling web scans" },
      { label: "Interpreting confidence scores", desc: "What the signal breakdown means for review decisions" },
    ],
  },
  {
    title: "Incident Management",
    items: [
      { label: "Reviewing incidents", desc: "How to confirm, dismiss, or whitelist detected incidents" },
      { label: "Evidence and audit trail", desc: "Understanding evidence snapshots and decision logging" },
      { label: "Escalation workflows", desc: "When and how to escalate incidents for legal review" },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Team roles and permissions", desc: "Understanding admin, reviewer, analyst, and viewer roles" },
      { label: "API and integrations", desc: "Connecting TrueSource with your existing tools" },
      { label: "Domain allowlisting", desc: "Reducing noise by allowlisting authorized partners" },
    ],
  },
];

const shortcuts = [
  { keys: "⌘ K", action: "Open search" },
  { keys: "⌘ U", action: "Upload asset" },
  { keys: "⌘ I", action: "Go to incidents" },
  { keys: "Esc", action: "Close modal / dialog" },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Help & Documentation</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Learn how to use TrueSource effectively</p>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <div className="relative max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search documentation…" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] py-3 pl-12 pr-4 text-sm text-[var(--text-strong)] input-focus-ring" />
        </div>
      </div>

      {/* Documentation sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
            <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">{section.title}</h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button key={item.label} className="w-full text-left rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-3 hover:bg-[var(--brand-surface)] hover:border-[var(--brand)]/20 transition group">
                  <p className="text-sm font-medium text-[var(--text-strong)] group-hover:text-[var(--brand)]">{item.label}</p>
                  <p className="text-xs text-[var(--text-soft)] mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Keyboard shortcuts */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Keyboard Shortcuts</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between rounded-lg bg-[var(--surface-1)] px-4 py-2.5">
              <span className="text-sm text-[var(--text-muted)]">{s.action}</span>
              <kbd className="rounded border border-[var(--stroke)] bg-[var(--surface-2)] px-2 py-0.5 text-xs font-mono text-[var(--text-soft)]">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Contact support */}
      <div className="rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-surface)] p-6 text-center">
        <h2 className="text-base font-semibold text-[var(--text-strong)]">Need more help?</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Our team is here to help with onboarding, configuration, or technical questions.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 mt-4 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
