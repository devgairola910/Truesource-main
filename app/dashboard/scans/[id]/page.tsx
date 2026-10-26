"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const scanDetails = {
  id: "SCAN-847",
  status: "completed",
  started: "28m ago",
  duration: "4m 12s",
  totalPages: 12400,
  candidates: 48,
  deepAnalyzed: 12,
  matches: 3,
  sources: [
    { domain: "streamclips.watch", pages: 3200, candidates: 18, matches: 1 },
    { domain: "sports-trends.blog", pages: 2800, candidates: 12, matches: 1 },
    { domain: "fan-news-hub.io", pages: 4100, candidates: 14, matches: 1 },
    { domain: "game-recap.tv", pages: 2300, candidates: 4, matches: 0 },
  ],
};

export default function ScanDetailPage() {
  const params = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/scans" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text-strong)]">{params.id ?? scanDetails.id}</h1>
            <Badge variant="success">{scanDetails.status}</Badge>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Started {scanDetails.started} · Duration {scanDetails.duration}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Pages Scanned", value: scanDetails.totalPages.toLocaleString() },
          { label: "Candidates Found", value: scanDetails.candidates.toString() },
          { label: "Deep Analyzed", value: scanDetails.deepAnalyzed.toString() },
          { label: "Matches", value: scanDetails.matches.toString() },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 text-center">
            <p className="text-2xl font-bold text-[var(--text-strong)]">{s.value}</p>
            <p className="text-xs text-[var(--text-soft)] mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--stroke)]">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">Source Breakdown</h2>
        </div>
        {scanDetails.sources.map((src) => (
          <div key={src.domain} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--stroke)] last:border-0">
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-strong)]">{src.domain}</p>
              <p className="text-xs text-[var(--text-soft)]">{src.pages.toLocaleString()} pages · {src.candidates} candidates</p>
            </div>
            <Badge variant={src.matches > 0 ? "danger" : "success"}>{src.matches} matches</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
