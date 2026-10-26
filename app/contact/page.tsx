import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionCard } from "@/components/ui/section-card";

export default function ContactPage() {
  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Contact
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Let us design the right integrity workflow for your team.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          Whether you are evaluating a pilot, improving an existing queue, or preparing a launch,
          we can help you define a focused implementation plan with clear scope, milestones, and
          measurable outcomes.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <SectionCard
          className="reveal-up"
          title="Send a Message"
          description="Share your goals and current challenges"
        >
          <ContactForm />
        </SectionCard>

        <SectionCard
          className="reveal-up"
          title="Other Ways to Reach Us"
          description="Response within one business day"
        >
          <div className="space-y-4 text-sm leading-7 text-[var(--text-muted)]">
            <div>
              <p className="font-semibold text-[var(--text-strong)]">Email</p>
              <p>hello@truesource.ai</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-strong)]">Partnerships</p>
              <p>partners@truesource.ai</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-strong)]">Office Hours</p>
              <p>Monday to Friday, 9:00 AM to 6:00 PM UTC</p>
            </div>
            <p>
              Looking for service details first? Visit the
              <Link href="/services" className="mx-1 font-semibold text-[var(--text-strong)] underline">
                Services page
              </Link>
              to review scope and delivery options.
            </p>
          </div>
        </SectionCard>
      </section>
    </>
  );
}
