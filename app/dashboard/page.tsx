"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPercent } from "@/lib/utils";
import type { AlertRecord, KpiRecord } from "@/lib/types";
import { getSession, onAuthChange } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

const trendIcon = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const chartData = [42, 58, 35, 72, 65, 88, 76, 54, 91, 68, 82, 95, 78, 63, 87, 71, 93, 84, 67, 79, 96, 85, 74, 89];

export default function DashboardPage() {
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);
  const [activeChart, setActiveChart] = useState<"detections" | "scans">("detections");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const maxChart = Math.max(...chartData);

  const fetchData = async () => {
    if (!session?.idToken) return;
    const headers = {
      "Authorization": `Bearer ${session.idToken}`
    };

    try {
      const response = await fetch("/api/dashboard", { headers });
      const resData = await response.json();
      setData(resData.snapshot);
    } catch (error) {
      console.error("Dashboard synchronization failure:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session?.idToken]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center h-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const alerts: AlertRecord[] = data.recentAlerts || [];
  const metrics = data.metrics || [];
  const assetStats = data.assetStats || { total: 0, images: 0, videos: 0 };
  const recentAssets = data.recentAssets || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <section className="reveal-up space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-[var(--text-strong)] tracking-tight">
            Welcome back, {session?.name?.split(' ')[0] || 'User'}
          </h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--success-surface)] border border-[var(--success)]/20">
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--success)]">Live Protection Active</span>
          </div>
        </div>
        <p className="text-[var(--text-muted)] max-w-2xl">
          Here's a tactical overview of your protected assets and recent global detections.
        </p>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m: any, i: number) => (
          <div
            key={m.label}
            className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-2 shadow-sm hover:shadow-md transition-all group"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)] group-hover:text-[var(--brand)] transition-colors">{m.label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-[var(--text-strong)] tracking-tighter">{m.value}</p>
            </div>
            <div className="pt-2">
              <div className="h-1 w-full bg-[var(--stroke)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: '65%', opacity: 0.6 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Main Chart Card */}
          <div className="reveal-up rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-strong)]">Detection Telemetry</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-soft)] mt-1">Global signal matches across indexed domains</p>
              </div>
              <div className="flex rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-1">
                <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-[var(--surface-2)] text-[var(--brand)] shadow-sm">24H View</button>
                <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg text-[var(--text-muted)] hover:text-[var(--text-strong)] transition">7D View</button>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-64">
              {chartData.map((val, i) => (
                <div key={i} className="flex-1 group relative flex flex-col items-center">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--brand)] to-indigo-400 opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-x-110"
                    style={{ height: `${(val / maxChart) * 100}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--surface-3)] text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition shadow-xl pointer-events-none">
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)]">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span className="text-[var(--brand)]">Live Now</span>
            </div>
          </div>

          {/* Recently Synced Assets */}
          <div className="reveal-up space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-strong)]">Recently Synced</h2>
              <Link href="/dashboard/assets" className="text-[10px] font-black uppercase tracking-widest text-[var(--brand)] hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {recentAssets.slice(0, 4).map((asset: any) => (
                <Link key={asset.id} href={`/dashboard/assets/${asset.id}`} className="group relative aspect-square rounded-2xl border border-[var(--stroke)] bg-[var(--surface-1)] overflow-hidden transition-all hover:border-[var(--brand)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-2xl">{asset.kind === 'video' ? '🎬' : '🖼️'}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/20 to-transparent">
                    <p className="text-[9px] font-bold text-white truncate">{asset.title}</p>
                  </div>
                </Link>
              ))}
              {recentAssets.length === 0 && (
                <div className="col-span-2 py-8 text-center rounded-2xl border border-dashed border-[var(--stroke)]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">No recent assets</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="reveal-up rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)]">Tactical Actions</h2>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/assets/upload">
                <Button className="w-full justify-start gap-3 h-12 rounded-xl transition-all hover:scale-[1.01]">
                  <span className="text-lg">📁</span>
                  <span className="text-xs font-black uppercase tracking-widest">Register New Asset</span>
                </Button>
              </Link>
              <Link href="/dashboard/scans/leak-check">
                <Button variant="secondary" className="w-full justify-start gap-3 h-12 rounded-xl transition-all hover:scale-[1.01]">
                  <span className="text-lg">🔍</span>
                  <span className="text-xs font-black uppercase tracking-widest">Instant Leak Check</span>
                </Button>
              </Link>
              <Link href="/dashboard/scans/autonomous">
                <Button 
                  className="w-full justify-start gap-3 h-12 rounded-xl transition-all hover:scale-[1.01] bg-[var(--success)] text-white hover:bg-[#047857] border-none shadow-[0_4px_14px_0_rgba(5,150,105,0.3)]"
                >
                  <span className="text-lg">🌐</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    Autonomous Web Scan
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Alerts Feed */}
          <div className="reveal-up rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)]">Critical Signals</h2>
              <Badge variant="danger" className="text-[9px] font-black uppercase tracking-widest">{alerts.length}</Badge>
            </div>
            <div className="space-y-2">
              {alerts.length > 0 ? (
                alerts.map((item) => (
                  <Link key={item.id} href={`/dashboard/incidents/${item.id}`} className="flex items-start gap-4 rounded-2xl px-4 py-4 border border-transparent hover:border-[var(--stroke)] hover:bg-[var(--surface-1)] transition-all group">
                    <div className={cn(
                      "mt-1 h-2 w-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]",
                      item.severity === "critical" ? "text-[var(--danger)] bg-current" :
                      item.severity === "high" ? "text-[var(--warning)] bg-current" : "text-[var(--brand)] bg-current"
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[var(--text-strong)] leading-tight group-hover:text-[var(--brand)] transition-colors">{item.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-soft)]">{item.sourceDomain}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-soft)] opacity-40">·</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-soft)]">{item.detectedAt}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">All signals clear</p>
                </div>
              )}
            </div>
            <Link href="/dashboard/incidents" className="block">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)] hover:text-[var(--brand)]">
                Full Incident Log →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
