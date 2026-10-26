"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/chip";
import type { AlertRecord, AlertStatus } from "@/lib/types";

type ReviewWorkspaceProps = {
  initialAlerts: AlertRecord[];
};

function toPercent(score: number) {
  return `${Math.round(score * 100)}%`;
}

function toneForSeverity(severity: AlertRecord["severity"]) {
  if (severity === "critical") {
    return "danger" as const;
  }

  if (severity === "high") {
    return "warning" as const;
  }

  return "neutral" as const;
}

function labelForStatus(status: AlertStatus) {
  if (status === "confirmed") {
    return "Confirmed";
  }

  if (status === "dismissed") {
    return "Dismissed";
  }

  if (status === "whitelisted") {
    return "Whitelisted";
  }

  return "New";
}

function toneForStatus(status: AlertStatus) {
  if (status === "confirmed") {
    return "danger" as const;
  }

  if (status === "dismissed") {
    return "neutral" as const;
  }

  if (status === "whitelisted") {
    return "success" as const;
  }

  return "warning" as const;
}

export function ReviewWorkspace({ initialAlerts }: ReviewWorkspaceProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedId, setSelectedId] = useState(initialAlerts[0]?.id ?? "");

  const selectedAlert = useMemo(
    () => alerts.find((alert) => alert.id === selectedId) ?? alerts[0],
    [alerts, selectedId],
  );

  function updateStatus(status: AlertStatus) {
    if (!selectedAlert) {
      return;
    }

    setAlerts((current) =>
      current.map((alert) =>
        alert.id === selectedAlert.id ? { ...alert, status } : alert,
      ),
    );
  }

  if (!selectedAlert) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            onClick={() => setSelectedId(alert.id)}
            className={`w-full rounded-xl border p-3 text-left transition ${
              selectedAlert.id === alert.id
                ? "border-[var(--brand)] bg-[var(--surface-2)]"
                : "border-[var(--stroke)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
                {alert.id}
              </p>
              <div className="flex items-center gap-2">
                <Chip label={alert.severity} tone={toneForSeverity(alert.severity)} />
                <Chip
                  label={labelForStatus(alert.status)}
                  tone={toneForStatus(alert.status)}
                />
              </div>
            </div>
            <p className="text-sm font-semibold text-[var(--text-strong)]">{alert.title}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">{alert.sourceDomain}</p>
          </button>
        ))}
      </div>

      <aside className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4">
        <header className="mb-4 space-y-1">
          <h3 className="font-heading text-lg font-semibold text-[var(--text-strong)]">
            Evidence Panel
          </h3>
          <p className="text-sm text-[var(--text-muted)]">{selectedAlert.title}</p>
        </header>

        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-[var(--text-soft)]">
              Matched Asset
            </dt>
            <dd className="font-medium text-[var(--text-strong)]">
              {selectedAlert.matchedAssetTitle}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-[var(--text-soft)]">
              Source URL
            </dt>
            <dd className="break-all text-[var(--text-muted)]">{selectedAlert.sourceUrl}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-[var(--text-soft)]">
              Detected
            </dt>
            <dd className="text-[var(--text-muted)]">{selectedAlert.detectedAt}</dd>
          </div>
        </dl>

        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-[var(--text-strong)]">
            Confidence Breakdown
          </h4>
          {selectedAlert.evidence.map((signal) => (
            <div key={signal.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-soft)]">
                <span>{signal.label}</span>
                <span>{toPercent(signal.score)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-3)]">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: toPercent(signal.score) }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-lg bg-[var(--surface-2)] p-3 text-sm text-[var(--text-muted)]">
          {selectedAlert.recommendedAction}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => updateStatus("confirmed")}
            className="rounded-lg bg-[var(--danger)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => updateStatus("dismissed")}
            className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-2)] px-3 py-2 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={() => updateStatus("whitelisted")}
            className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
          >
            Whitelist Source
          </button>
        </div>
      </aside>
    </div>
  );
}
