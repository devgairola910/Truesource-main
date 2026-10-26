"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getSession, onAuthChange } from "@/lib/auth-client";
import { useSyncExternalStore } from "react";

export default function LeakCheckPage() {
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const startScan = async () => {
    if (!file) return;

    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.idToken || ""}`
        },
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Scan failed");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/scans" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-strong)]">Deep Match Checker</h1>
          <p className="text-sm text-[var(--text-muted)]">Verify media provenance using pixel-level fingerprints</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Upload Column */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 cursor-pointer transition aspect-square bg-[var(--surface-2)]",
              file ? "border-[var(--brand)] bg-[var(--brand-surface)]" : "border-[var(--stroke)] hover:border-[var(--brand)]"
            )}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange}
              className="hidden" 
              accept="image/*"
            />
            
            {file ? (
              <div className="text-center">
                <div className="mb-4 text-4xl">📄</div>
                <p className="text-sm font-semibold text-[var(--text-strong)] truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-[var(--text-soft)] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-4 text-xs text-[var(--danger)] hover:underline"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4 text-4xl opacity-50">🔍</div>
                <p className="text-sm font-semibold text-[var(--text-strong)]">Upload suspect media</p>
                <p className="text-xs text-[var(--text-soft)] mt-1">Drag and drop or click to browse</p>
              </div>
            )}
          </div>

          <Button 
            className="w-full h-12 text-lg" 
            disabled={!file || isScanning}
            onClick={startScan}
          >
            {isScanning ? "Scanning Pixels..." : "Start Deep Scan"}
          </Button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 min-h-[400px] flex flex-col">
            <h2 className="text-lg font-bold text-[var(--text-strong)] mb-4 flex items-center gap-2">
              Scan Results
              {isScanning && <span className="flex h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />}
            </h2>

            {!result && !isScanning && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-12">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="mb-4">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>
                </svg>
                <p className="text-sm">No scan data available.<br/>Upload a file to begin provenance verification.</p>
              </div>
            )}

            {isScanning && (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-sm font-medium animate-pulse">Extracting invisible watermark...</p>
                <p className="text-xs text-[var(--text-soft)] mt-2">Checking blue channel LSB and calculating aHash</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className={cn(
                  "p-4 rounded-xl border flex items-center gap-4",
                  result.found ? "bg-[var(--success-surface)] border-[var(--success)]/20" : "bg-[var(--danger-surface)] border-[var(--danger)]/20"
                )}>
                  <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center text-xl flex-shrink-0",
                    result.found ? "bg-[var(--success)] text-white" : "bg-[var(--danger)] text-white"
                  )}>
                    {result.found ? "✓" : "!"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn("font-bold text-lg", result.found ? "text-[var(--success)]" : "text-[var(--danger)]")}>
                        {result.found ? (result.matchPercentage >= 100 ? "Official Media Matched (Exact)" : `Official Media Matched (${result.matchPercentage}% Similar)`) : "No Match Found"}
                      </p>
                      {result.matchPercentage !== undefined && (
                        <Badge 
                          variant={result.found ? "success" : "default"} 
                          className={cn(
                            result.found ? "bg-[var(--success)] text-white border-transparent" : "bg-[var(--surface-3)] text-[var(--text-soft)]"
                          )}
                        >
                          {result.matchPercentage}% Similar
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {result.found 
                        ? (result.matchPercentage >= 100 ? "This media contains an identical fingerprint or hash from the TrueSource registry." : "This media is visually similar to an asset in the TrueSource registry.") 
                        : (result.matchPercentage > 0 ? `The closest match in your registry is only ${result.matchPercentage}% similar, which is below the matching threshold.` : "This media does not sufficiently match any recognized fingerprint or visual hash.")}
                    </p>
                  </div>
                </div>

                {result.found && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--stroke)]">
                        <p className="text-xs text-[var(--text-soft)] uppercase tracking-wider mb-1">Asset ID</p>
                        <p className="font-mono text-sm font-bold text-[var(--brand)]">{result.match.id}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--stroke)]">
                        <p className="text-xs text-[var(--text-soft)] uppercase tracking-wider mb-1">Rights Owner</p>
                        <p className="text-sm font-bold">{result.match.rightsOwner}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--surface-1)] border border-[var(--stroke)] space-y-3">
                      <p className="text-xs text-[var(--text-soft)] uppercase tracking-wider">Asset Information</p>
                      <div className="flex items-center justify-between py-2 border-b border-[var(--stroke)]/50">
                        <span className="text-sm text-[var(--text-muted)]">Title</span>
                        <span className="text-sm font-medium">{result.match.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Perceptual Hash</span>
                        <span className="text-xs font-mono text-[var(--text-soft)]">{result.details.generatedPHash.slice(0, 16)}...</span>
                      </div>
                    </div>

                    <Link href={`/dashboard/assets/${result.match.id}`}>
                      <Button variant="secondary" className="w-full">View Original Asset Detail</Button>
                    </Link>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[var(--surface-3)] space-y-3">
                  <p className="text-xs text-[var(--text-soft)] uppercase tracking-wider font-semibold">Technical Evidence</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Extracted Fingerprint</span>
                      <span className={cn("text-xs font-mono", result.details.extractedFingerprint ? "text-[var(--success)]" : "text-[var(--text-soft)]")}>
                        {result.details.extractedFingerprint || "Not detected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">Perceptual Hash (aHash)</span>
                      <span className="text-xs font-mono text-[var(--text-soft)] truncate max-w-[150px]">
                        {result.details.generatedPHash}
                      </span>
                    </div>
                    {result.details.assetsSearched !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Registry Coverage</span>
                        <span className="text-xs font-bold text-[var(--text-soft)]">
                          {result.details.assetsSearched} assets checked
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
