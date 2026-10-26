"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { AssetRecord } from "@/lib/types";
import { getSession, onAuthChange } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

type ViewMode = "grid" | "list";

export default function AssetsPage() {
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "protected" | "fingerprinting">("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchAssets() {
      if (!session?.idToken) return;
      try {
        const res = await fetch("/api/assets", {
          headers: {
            "Authorization": `Bearer ${session.idToken}`
          }
        });
        const data = await res.json();
        setAssets(data.assets || []);
      } catch (err) {
        console.error("Asset synchronization error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssets();
  }, [session?.idToken]);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && a.kind !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter, assets]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="h-16 w-full rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)] tracking-tight">Asset Library</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{assets.length} synchronized assets</p>
        </div>
        <Link href="/dashboard/assets/upload">
          <Button className="transition-all hover:scale-[1.02]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="text-xs font-black uppercase tracking-widest">Upload Assets</span>
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] py-2 pl-10 pr-4 text-sm text-[var(--text-strong)] placeholder:text-[var(--text-soft)] input-focus-ring"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] input-focus-ring font-medium"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] input-focus-ring font-medium"
        >
          <option value="all">All Status</option>
          <option value="protected">Protected</option>
          <option value="fingerprinting">Fingerprinting</option>
        </select>
        <div className="flex rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("p-1.5 rounded-md transition", view === v ? "bg-[var(--surface-2)] shadow-sm text-[var(--brand)]" : "text-[var(--text-soft)]")}>
              {v === "grid" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-surface)] px-4 py-3 slide-up">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">{selected.size} selected nodes</span>
          <Button size="sm" variant="secondary" className="px-3 py-0 h-8 text-[9px] font-black uppercase tracking-widest">Export</Button>
          <Button size="sm" variant="danger" className="px-3 py-0 h-8 text-[9px] font-black uppercase tracking-widest">Remove</Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-strong)]">Clear</button>
        </div>
      )}

      {/* Asset grid/list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>}
          title="No assets found"
          description="Try adjusting your filters or search terms."
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="group relative rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden hover:shadow-md transition">
              <button onClick={() => toggleSelect(asset.id)} className="absolute top-3 left-3 z-10">
                <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center transition",
                  selected.has(asset.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)] bg-[var(--surface-2)] opacity-0 group-hover:opacity-100"
                )}>
                  {selected.has(asset.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
              <div className="aspect-video bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-3)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,var(--brand),transparent)]" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-soft)] relative z-10">
                  {asset.kind === "video" ? <><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></> : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>}
                </svg>
              </div>
              <Link href={`/dashboard/assets/${asset.id}`} className="block p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={asset.status === "protected" ? "success" : "warning"} className="px-2 py-0 h-4 text-[8px] font-black uppercase tracking-widest leading-none">{asset.status}</Badge>
                  <span className="text-[9px] uppercase font-black text-[var(--text-soft)] tracking-[0.15em]">{asset.kind}</span>
                </div>
                <p className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--brand)] transition truncate">{asset.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-[var(--text-soft)]">{asset.id}</span>
                  <div className="h-1 w-1 rounded-full bg-[var(--stroke)]" />
                  <span className="text-[10px] font-bold text-[var(--text-soft)]">{asset.lastUpdated}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden shadow-sm">
          <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--stroke)] bg-[var(--surface-1)] text-[9px] font-black text-[var(--text-soft)] uppercase tracking-widest">
            <button onClick={toggleAll} className="shrink-0">
              <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition", selected.size === filtered.length ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)]")}>
                {selected.size === filtered.length && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </button>
            <span className="flex-1">Asset Structure</span>
            <span className="w-20">Class</span>
            <span className="w-28">Status</span>
            <span className="w-24 text-right">Synchronization</span>
          </div>
          {filtered.map((asset) => (
            <Link key={asset.id} href={`/dashboard/assets/${asset.id}`} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition group">
              <button onClick={(e) => { e.preventDefault(); toggleSelect(asset.id); }} className="shrink-0">
                <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center transition", selected.has(asset.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)]")}>
                  {selected.has(asset.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--brand)] truncate">{asset.title}</p>
                <p className="text-[10px] font-bold text-[var(--text-soft)]">{asset.id}</p>
              </div>
              <span className="w-20 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{asset.kind}</span>
              <span className="w-28"><Badge variant={asset.status === "protected" ? "success" : "warning"} className="text-[9px] font-black uppercase tracking-widest">{asset.status}</Badge></span>
              <span className="w-24 text-[10px] font-bold text-[var(--text-soft)] text-right">{asset.lastUpdated}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
