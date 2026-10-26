"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatPercent } from "@/lib/utils";
import type { AlertRecord } from "@/lib/types";
import { getSession, onAuthChange } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

const savedViews = [
  { id: "all", label: "All Incidents" },
  { id: "new", label: "Needs Review" },
  { id: "critical", label: "Critical" },
  { id: "confirmed", label: "Confirmed" },
];

export default function IncidentsPage() {
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "high" | "medium">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchAlerts() {
      if (!session?.idToken) return;
      try {
        const res = await fetch("/api/alerts", {
          headers: {
            "Authorization": `Bearer ${session.idToken}`
          }
        });
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Incident telemetry synchronization error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAlerts();
  }, [session?.idToken]);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (view === "new" && a.status !== "new") return false;
      if (view === "critical" && a.severity !== "critical") return false;
      if (view === "confirmed" && a.status !== "confirmed") return false;
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      return true;
    });
  }, [search, view, severityFilter, alerts]);

  const toggleSelect = (id: string) => {
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-32 rounded-full" />)}
        </div>
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)] tracking-tight">Tactical Incidents</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{alerts.filter(a => a.status === "new").length} High-priority items awaiting review</p>
        </div>
      </div>

      {/* Saved views */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {savedViews.map((sv) => (
          <button
            key={sv.id}
            onClick={() => setView(sv.id)}
            className={cn(
              "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
              view === sv.id 
                ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-lg shadow-indigo-500/20" 
                : "bg-[var(--surface-1)] text-[var(--text-muted)] border-[var(--stroke)] hover:bg-[var(--surface-2)]"
            )}
          >
            {sv.label}
            {sv.id === "new" && <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[9px]">{alerts.filter(a => a.status === "new").length}</span>}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search incidents…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] py-2 pl-10 pr-4 text-sm text-[var(--text-strong)] placeholder:text-[var(--text-soft)] input-focus-ring" />
        </div>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as typeof severityFilter)} className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] font-medium input-focus-ring">
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-surface)] px-4 py-3 slide-up">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">{selected.size} selected nodes</span>
          <Button size="sm" variant="danger" className="text-[10px] font-black uppercase tracking-widest">Confirm All</Button>
          <Button size="sm" variant="secondary" className="text-[10px] font-black uppercase tracking-widest">Dismiss All</Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Clear</button>
        </div>
      )}

      {/* Incident list */}
      {filtered.length === 0 ? (
        <EmptyState title="No incidents found" description="Adjust your filters or synchronize telemetry." />
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => (
            <div key={alert.id} className="flex items-center gap-4">
              <button onClick={() => toggleSelect(alert.id)} className="shrink-0">
                <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all", selected.has(alert.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)] hover:border-[var(--text-soft)]")}>
                  {selected.has(alert.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
              <Link href={`/dashboard/incidents/${alert.id}`} className="flex-1 flex items-center gap-6 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-1)] p-5 hover:bg-[var(--surface-2)] hover:border-[var(--brand)]/20 shadow-sm hover:shadow-md transition-all group">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                  alert.severity === "critical" ? "bg-[var(--danger-surface)]" : alert.severity === "high" ? "bg-[var(--warning-surface)]" : "bg-[var(--surface-2)]"
                )}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={alert.severity === "critical" ? "var(--danger)" : alert.severity === "high" ? "var(--warning)" : "var(--text-soft)"} strokeWidth="2" strokeLinecap="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">{alert.id}</span>
                    <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "default"} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5">{alert.severity}</Badge>
                    <Badge variant={alert.status === "new" ? "info" : alert.status === "confirmed" ? "danger" : alert.status === "whitelisted" ? "success" : "default"} className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5">{alert.status}</Badge>
                  </div>
                  <p className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--brand)] transition truncate leading-relaxed">{alert.title}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-soft)] mt-1.5 opacity-80">{alert.sourceDomain} · Matched: <span className="text-[var(--text-strong)]">{alert.matchedAssetTitle}</span> · {alert.detectedAt}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 px-6 border-x border-[var(--stroke)]">
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)]">Signal Lock</p>
                  <p className="text-lg font-black text-[var(--text-strong)] tracking-tighter">{formatPercent(alert.evidence[0]?.score ?? 0)}</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-[var(--stroke)] flex items-center justify-center text-[var(--text-soft)] group-hover:text-[var(--brand)] group-hover:border-[var(--brand)]/20 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
