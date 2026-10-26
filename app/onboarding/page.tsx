import Link from "next/link";
import { ProtectedPage } from "@/components/auth/protected-page";
import { SectionCard } from "@/components/ui/section-card";

const checklist = [
  "Define your first monitored public source set.",
  "Upload official media assets and ownership metadata.",
  "Set initial alert severity thresholds.",
  "Assign reviewer roles for triage and quality control.",
];

export default function OnboardingPage() {
  return (
    <ProtectedPage>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Onboarding
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Set up your workspace with a focused launch checklist.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          Use this checklist to configure the essentials. A strong initial setup improves detection
          quality and reduces noisy alerts during your first operational weeks.
        </p>
      </section>

      <SectionCard
        className="reveal-up"
        title="Launch Checklist"
        description="Complete these in order"
      >
        <ul className="space-y-2 text-sm leading-7 text-[var(--text-muted)]">
          {checklist.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/profile/setup"
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
          >
            Continue to Profile Setup
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
          >
            Go to Dashboard
          </Link>
        </div>
      </SectionCard>
    </ProtectedPage>
  );
}
