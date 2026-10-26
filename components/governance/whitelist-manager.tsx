"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/chip";
import type { WhitelistDomain } from "@/lib/types";

type WhitelistManagerProps = {
  initialDomains: WhitelistDomain[];
};

export function WhitelistManager({ initialDomains }: WhitelistManagerProps) {
  const [domains, setDomains] = useState(initialDomains);
  const [domainInput, setDomainInput] = useState("");

  function addDomain() {
    const normalized = domainInput.trim().toLowerCase();
    if (!normalized) {
      return;
    }

    if (domains.some((entry) => entry.domain === normalized)) {
      return;
    }

    setDomains((current) => [
      {
        domain: normalized,
        owner: "Manual Review",
        reason: "Temporary reviewer approval",
      },
      ...current,
    ]);
    setDomainInput("");
  }

  function removeDomain(domain: string) {
    setDomains((current) => current.filter((entry) => entry.domain !== domain));
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-3">
        <p className="mb-2 text-sm font-semibold text-[var(--text-strong)]">
          Add authorized domain
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={domainInput}
            onChange={(event) => setDomainInput(event.target.value)}
            className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
            placeholder="example.com"
          />
          <button
            type="button"
            onClick={addDomain}
            className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {domains.map((entry) => (
          <article
            key={entry.domain}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2.5"
          >
            <div className="space-y-0.5">
              <p className="font-medium text-[var(--text-strong)]">{entry.domain}</p>
              <p className="text-xs text-[var(--text-soft)]">
                {entry.owner} - {entry.reason}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Chip label="authorized" tone="success" />
              <button
                type="button"
                onClick={() => removeDomain(entry.domain)}
                className="rounded-md border border-[var(--stroke)] px-2 py-1 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-2)]"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
