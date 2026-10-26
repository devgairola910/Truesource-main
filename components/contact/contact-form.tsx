"use client";

import { FormEvent, useState } from "react";

type ContactState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialState: ContactState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export function ContactForm() {
  const [formState, setFormState] = useState<ContactState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setFeedback(payload.message ?? "Unable to send your inquiry right now.");
        return;
      }

      setStatus("success");
      setFeedback(payload.message ?? "Inquiry submitted successfully.");
      setFormState(initialState);
    } catch {
      setStatus("error");
      setFeedback("Network error. Please try again in a moment.");
    }
  }

  return (
    <form className="space-y-3" aria-label="Contact form" onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-[var(--text-muted)]">
          Name
          <input
            value={formState.name}
            onChange={(event) =>
              setFormState((current) => ({ ...current, name: event.target.value }))
            }
            type="text"
            required
            className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
            placeholder="Your full name"
          />
        </label>
        <label className="space-y-1 text-sm text-[var(--text-muted)]">
          Work Email
          <input
            value={formState.email}
            onChange={(event) =>
              setFormState((current) => ({ ...current, email: event.target.value }))
            }
            type="email"
            required
            className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
            placeholder="name@company.com"
          />
        </label>
      </div>
      <label className="space-y-1 text-sm text-[var(--text-muted)]">
        Company
        <input
          value={formState.company}
          onChange={(event) =>
            setFormState((current) => ({ ...current, company: event.target.value }))
          }
          type="text"
          required
          className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
          placeholder="Organization name"
        />
      </label>
      <label className="space-y-1 text-sm text-[var(--text-muted)]">
        Message
        <textarea
          value={formState.message}
          onChange={(event) =>
            setFormState((current) => ({ ...current, message: event.target.value }))
          }
          rows={5}
          required
          minLength={20}
          className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
          placeholder="Tell us about your content protection goals, channels, and review process."
        />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Sending..." : "Send Inquiry"}
        </button>
        {feedback ? (
          <p
            className={`text-sm ${
              status === "success" ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  );
}
