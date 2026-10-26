"use client";

import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--stroke)] bg-[var(--surface-2)] p-12 md:p-24 text-center flex flex-col items-center">
      {/* Visual Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,var(--brand),transparent)]" />
      <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-[var(--brand)]/10 blur-[80px]" />
      <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center">
        <p className="inline-block rounded-full bg-[var(--brand-surface)] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--brand)] mb-8 border border-[var(--brand)]/10">
          Operational Intelligence v3.4.1
        </p>
        
        <h1 className="max-w-4xl font-heading text-5xl font-black tracking-tight text-[var(--text-strong)] md:text-8xl md:leading-[0.95] uppercase">
          Defend media with <span className="text-[var(--brand)]">Tactical Evidence.</span>
        </h1>
        
        <p className="mt-8 max-w-2xl text-base text-[var(--text-muted)] md:text-xl leading-relaxed font-medium">
          TrueSource empowers rights teams with fast detection, explainable proof, and automated registry workflows. Protect your digital sovereignty with the industry's most robust integrity layer.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">
          <Link
            href="/services"
            className="h-16 px-10 flex items-center rounded-2xl bg-[var(--brand)] text-[11px] font-black uppercase tracking-widest text-white shadow-2xl shadow-indigo-500/30 transition-all hover:-translate-y-1 hover:shadow-indigo-500/40 active:scale-95"
          >
            Deploy Solutions
          </Link>
          <Link
            href="/contact"
            className="h-16 px-10 flex items-center rounded-2xl border border-[var(--stroke)] bg-white/50 backdrop-blur-sm text-[11px] font-black uppercase tracking-widest text-[var(--text-strong)] transition-all hover:bg-[var(--surface-1)] hover:-translate-y-1 active:scale-95"
          >
            Contact Command
          </Link>
        </div>

        {/* Tactical stats overlay */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-12 border-t border-[var(--stroke)]/50">
           <div className="text-center">
              <p className="text-2xl font-black text-[var(--text-strong)] tracking-tight">99.8%</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-soft)]">Accuracy</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-[var(--text-strong)] tracking-tight">&lt; 2s</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-soft)]">Detection</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-[var(--text-strong)] tracking-tight">24/7</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-soft)]">Monitoring</p>
           </div>
           <div className="text-center">
              <p className="text-2xl font-black text-[var(--text-strong)] tracking-tight">1.2M+</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-soft)]">Protected</p>
           </div>
        </div>
      </div>
    </section>
  );
}
