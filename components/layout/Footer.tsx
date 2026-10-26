"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--stroke)] bg-[var(--surface-2)]/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white shadow-lg shadow-indigo-500/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="text-base font-black tracking-tighter text-[var(--text-strong)] uppercase">TrueSource</span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed font-medium">
              Enterprise-grade rights protection and media integrity verification. Protecting humanity's digital heritage through advanced tactical intelligence.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">Operations</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-[var(--text-muted)]">
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Incident Monitoring</Link>
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Asset Protection</Link>
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Tactical Scans</Link>
              <Link href="/dashboard" className="hover:text-[var(--brand)] transition-colors">Command Center</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand)]">Resources</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-[var(--text-muted)]">
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Legal Framework</Link>
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Privacy Protocol</Link>
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-[var(--brand)] transition-colors">Support Feed</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--stroke)]/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-soft)]">
            © {new Date().getFullYear()} TrueSource Rights Protection. All Tactical Assets Secured.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)]" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--success)]">Network Optimal</span>
            </div>
            <div className="h-4 w-[1px] bg-[var(--stroke)]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-soft)]">v3.4.1-Tactical</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
