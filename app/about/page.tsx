import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

const principles = [
  {
    title: "Evidence Before Assumption",
    detail:
      "We design every detection workflow around transparent proof. Reviewers see why an incident is flagged, not just a black-box score.",
  },
  {
    title: "Operational Practicality",
    detail:
      "Our focus is day-to-day usability: low review friction, clear status handling, and measurable queue health.",
  },
  {
    title: "Scoped Reliability",
    detail:
      "We prioritize strong performance in clearly defined scenarios and monitored sources, then expand responsibly.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          About
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Built for teams who need trustable decisions at scale.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          TrueSource started from a simple challenge: identifying unauthorized media reuse is
          easy to discuss, but hard to operationalize. Teams often face noisy alerts, weak
          attribution, and workflows that do not align with real review pressure. We built
          TrueSource to solve this gap with explainable signals, clear reviewer actions, and
          practical performance targets that organizations can actually adopt.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {principles.map((item) => (
          <SectionCard
            key={item.title}
            className="reveal-up"
            title={item.title}
            description="Core principle"
          >
            <p className="text-sm leading-7 text-[var(--text-muted)]">{item.detail}</p>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        className="reveal-up"
        title="How We Work"
        description="Our typical implementation rhythm"
      >
        <div className="space-y-4 text-sm leading-7 text-[var(--text-muted)]">
          <p>
            We begin with an onboarding workshop to map your official media lifecycle, known
            distribution partners, and infringement risk patterns. This lets us define a focused
            monitored source set and clear success metrics before deployment.
          </p>
          <p>
            Next, we configure your registry and matching stack with layered evidence signals such
            as perceptual similarity, embedding distance, and optional watermark checks. Our goal is
            to maximize signal confidence while controlling analyst effort.
          </p>
          <p>
            Finally, we launch review operations with incident triage playbooks, domain
            whitelisting governance, and KPI dashboards so your team can continuously tune
            precision, speed, and workload balance.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        className="reveal-up"
        title="Continue Exploring"
        description="Navigate to related pages"
      >
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/services" className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-strong)] hover:bg-[var(--surface-3)]">
            View Services
          </Link>
          <Link href="/blog" className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-strong)] hover:bg-[var(--surface-3)]">
            Read Blog
          </Link>
          <Link href="/contact" className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 font-semibold text-[var(--text-strong)] hover:bg-[var(--surface-3)]">
            Contact Us
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
