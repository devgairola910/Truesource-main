"use client";

import { FormEvent, useState } from "react";
import { ProtectedPage } from "@/components/auth/protected-page";
import { SectionCard } from "@/components/ui/section-card";
import { getSession, setSession } from "@/lib/auth-client";

export default function ProfileSetupPage() {
  const [fullName, setFullName] = useState(() => getSession()?.name ?? "");
  const [company, setCompany] = useState(() => getSession()?.company ?? "");
  const [role, setRole] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const session = getSession();
    if (!session) {
      setStatusMessage("Session not found. Please log in again.");
      return;
    }

    setSession({
      ...session,
      name: fullName.trim(),
      company: company.trim(),
    });

    setStatusMessage("Profile details saved successfully.");
  }

  return (
    <ProtectedPage>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Profile Setup
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Customize your profile and notification context.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          Keep your profile details updated so collaborators and workflow notifications remain
          accurate. This setup helps team routing and reviewer assignment quality.
        </p>
      </section>

      <SectionCard
        className="reveal-up"
        title="Your Details"
        description="Update profile basics"
      >
        <form onSubmit={handleSave} className="space-y-3">
          <label className="space-y-1 text-sm text-[var(--text-muted)]">
            Full Name
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
              placeholder="Your full name"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-[var(--text-muted)]">
              Company
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                required
                className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
                placeholder="Organization"
              />
            </label>
            <label className="space-y-1 text-sm text-[var(--text-muted)]">
              Role
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
                placeholder="Rights Manager"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
          >
            Save Profile
          </button>

          {statusMessage ? <p className="text-sm text-emerald-700">{statusMessage}</p> : null}
        </form>
      </SectionCard>
    </ProtectedPage>
  );
}
