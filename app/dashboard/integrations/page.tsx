"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrations = [
  { name: "Google Cloud Vision API", desc: "Image analysis and logo detection", status: "connected", icon: "☁️" },
  { name: "BigQuery Vector Search", desc: "Embedding similarity retrieval", status: "connected", icon: "🔍" },
  { name: "Cloud Storage", desc: "Asset and evidence archival", status: "connected", icon: "📦" },
  { name: "Pub/Sub", desc: "Event-driven pipeline messaging", status: "connected", icon: "📡" },
  { name: "Webhook Notifications", desc: "External alert delivery", status: "configured", icon: "🔔" },
  { name: "Slack Integration", desc: "Team notifications and alerts", status: "not_connected", icon: "💬" },
];

const webhooks = [
  { url: "https://hooks.apex.com/truesource/alerts", events: "incident.created, incident.confirmed", status: "active" },
  { url: "https://legal.apex.com/api/intake", events: "incident.escalated", status: "active" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Integrations</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Connected services and webhook configuration</p>
      </div>

      {/* Integration cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => (
          <div key={i.name} className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{i.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text-strong)]">{i.name}</p>
                <p className="text-xs text-[var(--text-soft)]">{i.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={i.status === "connected" ? "success" : i.status === "configured" ? "info" : "default"}>
                {i.status === "connected" ? "Connected" : i.status === "configured" ? "Configured" : "Not Connected"}
              </Badge>
              <Button size="sm" variant={i.status === "not_connected" ? "primary" : "ghost"}>
                {i.status === "not_connected" ? "Connect" : "Configure"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Webhooks */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">Webhooks</h2>
          <Button size="sm">Add Webhook</Button>
        </div>
        {webhooks.map((wh) => (
          <div key={wh.url} className="flex items-center gap-4 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-[var(--text-strong)] truncate">{wh.url}</p>
              <p className="text-xs text-[var(--text-soft)] mt-0.5">Events: {wh.events}</p>
            </div>
            <Badge variant="success">{wh.status}</Badge>
            <Button size="sm" variant="ghost">Edit</Button>
          </div>
        ))}
      </div>

      {/* API Key */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-3">
        <h2 className="text-base font-semibold text-[var(--text-strong)]">API Access</h2>
        <p className="text-sm text-[var(--text-muted)]">Use the API key to integrate TrueSource with your own systems.</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm font-mono text-[var(--text-soft)]">
            ts_live_••••••••••••••••••••••4a7f
          </div>
          <Button size="sm" variant="outline">Regenerate</Button>
          <Button size="sm" variant="ghost">Copy</Button>
        </div>
      </div>
    </div>
  );
}
