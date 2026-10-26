import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

const services = [
  {
    title: "Asset Registry and Ownership Mapping",
    details:
      "Create a canonical library of official images and videos with rights metadata, distribution context, and lifecycle controls. This foundation ensures downstream matching decisions are grounded in verified source assets.",
    includes: [
      "Structured asset ingestion and metadata tagging",
      "Version tracking for campaign and broadcast variants",
      "Governance rules for archival and ownership updates",
    ],
  },
  {
    title: "Fingerprinting and Matching Pipeline",
    details:
      "Deploy layered detection logic using perceptual hashes, vector embeddings, and shot-level segmentation for videos. This approach improves resilience against cropping, compression, and short-clip extraction.",
    includes: [
      "Image and video signature generation",
      "Staged retrieval for cost-efficient deep analysis",
      "Configurable risk scoring and threshold tuning",
    ],
  },
  {
    title: "Incident Review and Operations",
    details:
      "Provide an analyst-friendly queue with evidence panels, action controls, and source whitelisting. Review teams can confirm, dismiss, or suppress incidents with full traceability.",
    includes: [
      "Explainable confidence breakdowns",
      "Decision history and reviewer feedback loops",
      "Authorized domain suppression workflows",
    ],
  },
  {
    title: "Metrics and Performance Instrumentation",
    details:
      "Track precision, false positive ratio, triage speed, and scan throughput to maintain operational quality over time. Teams can use these metrics for tuning and stakeholder reporting.",
    includes: [
      "KPI dashboards with target benchmarks",
      "Queue health and reviewer productivity visibility",
      "Pilot reporting for launch readiness decisions",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Services
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Focused capabilities for end-to-end content integrity.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          Our service model is structured around the full detection loop: source asset integrity,
          candidate discovery, explainable matching, and reviewer execution. Each service is
          modular, so teams can start narrow and scale as evidence quality and operational goals
          mature.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <SectionCard
            key={service.title}
            className="reveal-up"
            title={service.title}
            description="Service module"
          >
            <p className="text-sm leading-7 text-[var(--text-muted)]">{service.details}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--text-muted)]">
              {service.includes.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        className="reveal-up"
        title="Need a tailored rollout plan?"
        description="Talk to us about your use case"
      >
        <p className="mb-4 text-sm leading-7 text-[var(--text-muted)]">
          Every organization has different content velocity, partner policies, and risk tolerance.
          We can propose a phased implementation plan aligned to your team size, legal workflow,
          and monitored source priorities.
        </p>
        <Link
          href="/contact"
          className="inline-flex rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
        >
          Request a Consultation
        </Link>
      </SectionCard>
    </>
  );
}
