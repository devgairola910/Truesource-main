"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function ProcessingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Processing</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Active fingerprinting and analysis jobs</p>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-12 flex flex-col items-center justify-center text-center opacity-50">
        <div className="text-4xl mb-4">⚙️</div>
        <h2 className="text-lg font-semibold text-[var(--text-strong)]">No Active Jobs</h2>
        <p className="text-sm text-[var(--text-soft)] max-w-xs mx-auto mt-2">
          New media uploads will appear here while they are being fingerprinted and indexed.
        </p>
      </div>
    </div>
  );
}
