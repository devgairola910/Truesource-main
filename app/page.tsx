import Link from "next/link";
import { SectionCard } from "@/components/ui/section-card";

const valuePoints = [
  {
    title: "Signal Layering",
    description:
      "We combine perceptual matching, embeddings, and contextual metadata so decisions are resilient when any single signal weakens.",
  },
  {
    title: "Reviewer Trust",
    description:
      "Every incident is explained with transparent evidence, confidence ranges, and source attribution to support fast, defensible triage.",
  },
  {
    title: "Scalable Scope",
    description:
      "A staged pipeline controls cloud cost by filtering cheaply first and spending deep analysis only where risk is meaningful.",
  },
];

import { HeroSection } from "@/components/layout/HeroSection";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-12 py-16 md:py-24 space-y-16 md:space-y-32">
      <HeroSection />

      <div className="space-y-12">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand)] text-center">Tactical Advantages</h3>
        <section className="grid gap-6 md:grid-cols-3">
          {valuePoints.map((point) => (
            <SectionCard
              key={point.title}
              className="reveal-up border border-[var(--stroke)]/50"
              title={point.title}
              description="Advantage Node"
            >
              <p className="text-sm leading-7 text-[var(--text-muted)] font-medium">{point.description}</p>
            </SectionCard>
          ))}
        </section>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          className="reveal-up border border-[var(--stroke)]/50"
          title="Operational Capacity"
          description="Core outcomes teams expect in the first release"
        >
          <ul className="space-y-3 text-sm leading-7 text-[var(--text-muted)] font-medium">
            <li className="flex gap-3">
               <span className="text-[var(--brand)]">01</span>
               <span>Upload and organize official images and videos as a source of truth.</span>
            </li>
            <li className="flex gap-3">
               <span className="text-[var(--brand)]">02</span>
               <span>Monitor selected public channels for suspicious media reuse patterns.</span>
            </li>
            <li className="flex gap-3">
               <span className="text-[var(--brand)]">03</span>
               <span>Review alerts with clear confidence breakdown and incident context.</span>
            </li>
            <li className="flex gap-3">
               <span className="text-[var(--brand)]">04</span>
               <span>Whitelist authorized domains to reduce noise and improve precision.</span>
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          className="reveal-up border border-[var(--stroke)]/50"
          title="Registry Entry"
          description="Suggested path through the site"
        >
          <ol className="space-y-4 text-sm leading-7 text-[var(--text-muted)] font-medium">
            <li className="flex items-center gap-4 group">
               <div className="h-8 w-8 rounded-lg bg-[var(--surface-1)] flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">01</div>
               <Link href="/about" className="hover:text-[var(--brand)] transition-colors">Learn who we are and our approach</Link>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="h-8 w-8 rounded-lg bg-[var(--surface-1)] flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">02</div>
               <Link href="/services" className="hover:text-[var(--brand)] transition-colors">Review capabilities and implementation scope</Link>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="h-8 w-8 rounded-lg bg-[var(--surface-1)] flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">03</div>
               <Link href="/blog" className="hover:text-[var(--brand)] transition-colors">Read practical insights from our team</Link>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="h-8 w-8 rounded-lg bg-[var(--surface-1)] flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--brand)] group-hover:text-white transition-colors">04</div>
               <Link href="/contact" className="hover:text-[var(--brand)] transition-colors">Reach out for onboarding or pilots</Link>
            </li>
          </ol>
        </SectionCard>
      </section>
    </div>
  );
}
