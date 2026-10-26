"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { getSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

const processingSteps = [
  { label: "Upload received", status: "done", time: "2h ago" },
  { label: "Perceptual hash generated", status: "done", time: "2h ago" },
  { label: "Embedding vectors computed", status: "done", time: "1h 55m ago" },
  { label: "Shot-level indexing", status: "done", time: "1h 40m ago" },
  { label: "Logo detection", status: "done", time: "1h 30m ago" },
  { label: "Watermark embedding", status: "done", time: "1h 20m ago" },
  { label: "Monitoring active", status: "active", time: "Now" },
];

const signals = [
  { label: "Perceptual Hash", value: "a7f3c9e2b1d4", confidence: 0.98 },
  { label: "Embedding Vector", value: "768-dim, normalized", confidence: 0.95 },
  { label: "Logo Patches", value: "3 detected regions", confidence: 0.88 },
  { label: "Watermark Payload", value: "TS-AST-1002-v1", confidence: 0.92 },
];

export default function AssetDetailPage() {
  const params = useParams();
  const assetId = params.id as string;
  const [data, setData] = useState<{ asset: any; linkedAlerts: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    async function fetchAsset() {
      const session = getSession();
      if (!session?.idToken) return;

      try {
        const res = await fetch(`/api/assets/${assetId}`, {
          headers: { "Authorization": `Bearer ${session.idToken}` }
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch asset", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAsset();
  }, [assetId]);

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-20 w-full" /><Skeleton className="h-[400px] w-full" /></div>;
  }

  if (!data?.asset) {
    return <div className="p-12 text-center text-[var(--text-soft)]">Asset not found.</div>;
  }

  const { asset, linkedAlerts } = data;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/assets" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[var(--text-soft)]">{asset.id}</span>
            <Badge variant={asset.status === "protected" ? "success" : "warning"}>{asset.status}</Badge>
            <Badge variant="default">{asset.kind}</Badge>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">{asset.title}</h1>
        </div>
        <Button variant="secondary" size="sm">Download</Button>
        <Button size="sm" variant="danger">Delete</Button>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "signals", label: "Detected Signals", count: signals.length },
          { id: "incidents", label: "Linked Incidents", count: linkedAlerts.length },
          { id: "timeline", label: "Processing Timeline" },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Preview */}
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-1)] aspect-video flex items-center justify-center">
            <div className="text-center space-y-2">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-[var(--text-soft)]">
                {asset.kind === "video" ? <><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16"/></> : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>}
              </svg>
              <p className="text-sm text-[var(--text-soft)]">{asset.kind === "video" ? "Video Preview" : "Image Preview"}</p>
            </div>
          </div>
          {/* Metadata */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[var(--text-strong)]">Asset Details</h3>
              {[
                ["Rights Owner", asset.rightsOwner],
                ["Distributed To", asset.distributedTo],
                ["Last Updated", asset.lastUpdated],
                ["Media Type", asset.kind],
                ["File Size", "24.5 MB"],
                ["Resolution", asset.kind === "video" ? "1920×1080" : "4096×2160"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[var(--text-soft)]">{label}</span>
                  <span className="font-medium text-[var(--text-strong)]">{val}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[var(--text-strong)]">Protection Status</h3>
              {[
                { label: "Fingerprinted", active: true },
                { label: "Watermarked", active: true },
                { label: "Monitoring Active", active: true },
                { label: "Shot-Indexed", active: asset.kind === "video" },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)]">{p.label}</span>
                  <span className={p.active ? "text-[var(--success)] font-semibold" : "text-[var(--text-soft)]"}>{p.active ? "✓ Active" : "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "signals" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {signals.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-strong)]">{s.label}</h3>
                <Badge variant="info">{Math.round(s.confidence * 100)}%</Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono bg-[var(--surface-1)] rounded-lg px-3 py-2">{s.value}</p>
              <Progress value={s.confidence * 100} />
            </div>
          ))}
        </div>
      )}

      {tab === "incidents" && (
        <div className="space-y-3">
          {linkedAlerts.length === 0 ? (
            <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-12 text-center">
              <p className="text-sm text-[var(--text-muted)]">No incidents linked to this asset yet.</p>
            </div>
          ) : linkedAlerts.map((a) => (
            <Link key={a.id} href={`/dashboard/incidents/${a.id}`} className="flex items-center gap-4 rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4 hover:shadow-sm transition group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[var(--text-soft)]">{a.id}</span>
                  <Badge variant={a.severity === "critical" ? "danger" : "warning"}>{a.severity}</Badge>
                </div>
                <p className="text-sm font-medium text-[var(--text-strong)] group-hover:text-[var(--brand)] truncate">{a.title}</p>
              </div>
              <span className="text-xs text-[var(--text-soft)]">{a.detectedAt}</span>
            </Link>
          ))}
        </div>
      )}

      {tab === "timeline" && (
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <div className="relative space-y-0">
            {processingSteps.map((s, i) => (
              <div key={s.label} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full shrink-0 ${s.status === "done" ? "bg-[var(--success)]" : s.status === "active" ? "bg-[var(--brand)]" : "bg-[var(--surface-3)]"}`}>
                    {s.status === "active" && <div className="h-3 w-3 rounded-full bg-[var(--brand)] animate-ping" />}
                  </div>
                  {i < processingSteps.length - 1 && <div className={`w-px flex-1 mt-1 ${s.status === "done" ? "bg-[var(--success)]" : "bg-[var(--stroke)]"}`} />}
                </div>
                <div className="flex-1 -mt-0.5">
                  <p className="text-sm font-medium text-[var(--text-strong)]">{s.label}</p>
                  <p className="text-xs text-[var(--text-soft)]">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
