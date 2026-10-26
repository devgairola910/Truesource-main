"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth-client";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("8w");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const session = getSession();
      if (!session) return;
      try {
        const response = await fetch("/api/analytics", {
          headers: { "Authorization": `Bearer ${session.idToken}` }
        });
        const resData = await response.json();
        setData(resData);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [period]);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-[var(--text-soft)] animate-pulse">Loading analytics...</div>;
  }

  const { kpis, topSources, chartData } = data;

  // Find max value safely to avoid Infinity with empty arrays
  const maxDetection = chartData.detections.length > 0 ? Math.max(...chartData.detections, 1) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Analytics</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Detection performance and operational metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "4w", "8w", "6m"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition", period === p ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-1)] text-[var(--text-muted)] hover:bg-[var(--surface-2)]")}>{p}</button>
          ))}
          <Button size="sm" variant="outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k: any) => (
          <div key={k.id} className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)]">{k.label}</p>
            <p className="text-2xl font-bold text-[var(--text-strong)] mt-2">{k.value}</p>
            <p className="text-xs text-[var(--text-soft)] mt-1">Target: {k.target}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detections chart */}
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Daily Detections</h2>
          <div className="flex items-end gap-2 h-40">
            {chartData.detections.map((v: number, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--text-soft)]">{v}</span>
                <div className="w-full rounded-t bg-[var(--brand)] hover:bg-[var(--brand-light)] transition" style={{ height: `${(v / maxDetection) * 100}%`, minHeight: '4px' }} />
                <span className="text-[10px] text-[var(--text-soft)]">{chartData.labels[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Precision chart */}
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Precision Trend (%)</h2>
          <div className="relative h-40">
            <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartData.precision.map((v: number, i: number) => `${(i / (chartData.precision.length - 1)) * 200},${Math.max(0, 100 - ((v - 50) / 50) * 100)}`).join(" ")}
              />
              <polyline
                fill="url(#gradient)"
                stroke="none"
                points={`0,100 ${chartData.precision.map((v: number, i: number) => `${(i / (chartData.precision.length - 1)) * 200},${Math.max(0, 100 - ((v - 50) / 50) * 100)}`).join(" ")} 200,100`}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-[var(--text-soft)]">
              {chartData.labels.map((w: string) => <span key={w}>{w}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Top sources */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Top Infringing Sources</h2>
        <div className="space-y-3">
          {topSources.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--text-soft)]">No active infringements detected yet.</div>
          ) : (
            topSources.map((src: any, i: number) => (
              <div key={src.domain} className="flex items-center gap-4">
                <span className="w-6 text-xs font-semibold text-[var(--text-soft)] text-right">#{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-strong)]">{src.domain}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 flex-1 rounded-full bg-[var(--surface-3)] max-w-[200px]">
                      <div className="h-full rounded-full bg-[var(--danger)]" style={{ width: `${(src.incidents / Math.max(topSources[0].incidents, 1)) * 100}%` }} />
                    </div>
                    <span className="text-xs text-[var(--text-soft)]">{src.incidents} incidents</span>
                  </div>
                </div>
                <Badge variant={src.confirmed > 0 ? "danger" : "default"}>{src.confirmed} confirmed</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
