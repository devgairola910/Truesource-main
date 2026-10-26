"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ScansPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Protection Scanners</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Choose a scanning mode to identify unauthorized media</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Manual Scan */}
        <Link 
          href="/dashboard/scans/leak-check"
          className="group relative flex flex-col justify-between h-full rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-8 transition-all hover:border-[var(--brand)] hover:shadow-lg hover:-translate-y-1"
        >
          <div>
            <div className="h-14 w-14 rounded-2xl bg-[var(--surface-3)] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h2 className="text-xl font-bold text-[var(--text-strong)] mb-2">Instant Leak Check</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Manually upload a suspicious image or video. The system will extract its fingerprint and instantly compare it against your protected registry.
            </p>
          </div>
          
          <div className="mt-8 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">Manual Analysis</span>
            <div className="flex items-center text-[var(--brand)] font-semibold text-sm group-hover:underline">
              Start Check <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </Link>

        {/* Autonomous Scan */}
        <Link 
          href="/dashboard/scans/autonomous"
          className="group relative flex flex-col justify-between h-full rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-8 transition-all hover:border-[var(--success)] hover:shadow-[0_8px_30px_rgba(5,150,105,0.15)] hover:-translate-y-1 overflow-hidden"
        >
          {/* Subtle animated background for the autonomous card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-[var(--success-surface)] flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform shadow-inner">
              🌐
            </div>
            <h2 className="text-xl font-bold text-[var(--text-strong)] mb-2">Autonomous Web Scan</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Launch the cloud engine to proactively crawl public internet feeds. It automatically fetches live media, hashes it, and identifies matches.
            </p>
          </div>
          
          <div className="mt-8 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--success-surface)] border border-[var(--success)]/20">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--success)]">Cloud Worker</span>
            </div>
            <div className="flex items-center text-[var(--success)] font-semibold text-sm group-hover:underline">
              Open Terminal <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Optional: Add a history section here later */}
    </div>
  );
}
