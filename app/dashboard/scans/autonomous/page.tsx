"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { getSession } from "@/lib/auth-client";

type ScanLog = {
  id: string;
  type: "info" | "success" | "match" | "error";
  message: string;
  timestamp: string;
};

export default function AutonomousScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ scanned: number; matches: number }>({ scanned: 0, matches: 0 });
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: ScanLog["type"] = "info") => {
    const newLog: ScanLog = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50));
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const startScan = async () => {
    if (isScanning) return;
    
    const session = getSession();
    if (!session?.idToken) {
      addLog("Authentication failed: Missing session token.", "error");
      return;
    }
    
    setIsScanning(true);
    setLogs([]);
    setProgress(0);
    setResults({ scanned: 0, matches: 0 });
    
    addLog("Initializing autonomous scanning engine...", "info");
    addLog("Connecting to global media feeds...", "info");
    
    try {
      const response = await fetch("/api/scans/run", { 
        method: "POST",
        headers: { "Authorization": `Bearer ${session.idToken}` }
      });
      const data = await response.json();
      
      if (data.matches !== undefined) {
        addLog(`Successfully connected to feed: ${data.feedSource}`, "success");
        addLog(`Processed ${data.scannedCandidates} live media items from the web.`, "info");
        
        if (data.matches > 0) {
          addLog(`CRITICAL: Identified ${data.matches} visual matches against protected assets!`, "match");
          setResults({ scanned: data.scannedCandidates, matches: data.matches });
        } else {
          addLog("Scan complete: No unauthorized distributions detected in this run.", "success");
          setResults({ scanned: data.scannedCandidates, matches: 0 });
        }
      } else {
        addLog("Scan failed: " + (data.message || data.error || "Unknown error"), "error");
      }
    } catch (error) {
      addLog("Network error occurred during scan.", "error");
    } finally {
      setIsScanning(false);
      setProgress(100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Autonomous Web Protection</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Live internet crawling and visual fingerprint matching</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)] mb-6">Scanner Controls</h2>
            
            <div className="space-y-6 text-center">
              <div className={cn(
                "mx-auto h-32 w-32 rounded-full border-4 border-dashed flex items-center justify-center transition-all duration-1000",
                isScanning ? "border-[var(--success)] animate-spin-slow" : "border-[var(--stroke)]"
              )}>
                <div className={cn(
                  "h-24 w-24 rounded-full flex items-center justify-center text-4xl shadow-inner transition-all",
                  isScanning ? "bg-[var(--success-surface)] scale-110" : "bg-[var(--surface-3)]"
                )}>
                  {isScanning ? "🌐" : "🛡️"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[var(--text-strong)]">
                  {isScanning ? "Crawl in Progress" : "System Standing By"}
                </h3>
                <p className="text-xs text-[var(--text-muted)] px-4">
                  Scanner will fetch live media from public feeds and perform bit-level pHash comparison.
                </p>
              </div>

              <Button 
                onClick={startScan} 
                disabled={isScanning}
                className={cn(
                  "w-full h-12 rounded-xl font-black uppercase tracking-widest transition-all",
                  !isScanning ? "bg-[var(--success)] hover:bg-[#047857] text-white" : ""
                )}
              >
                {isScanning ? "Scanning Web..." : "Launch Autonomous Scan"}
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)] mb-4">Run Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--surface-3)]">
                <p className="text-[10px] font-black uppercase text-[var(--text-soft)]">Scanned</p>
                <p className="text-xl font-bold text-[var(--text-strong)]">{results.scanned}</p>
              </div>
              <div className={cn(
                "p-4 rounded-2xl",
                results.matches > 0 ? "bg-[var(--danger-surface)]" : "bg-[var(--surface-3)]"
              )}>
                <p className="text-[10px] font-black uppercase text-[var(--text-soft)]">Matches</p>
                <p className={cn(
                  "text-xl font-bold",
                  results.matches > 0 ? "text-[var(--danger)]" : "text-[var(--text-strong)]"
                )}>{results.matches}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Console / Logs */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-[var(--stroke)] bg-[#0f172a] h-[600px] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">Protection Engine Terminal</span>
              </div>
              {isScanning && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
                  <span className="text-[10px] font-black text-[var(--success)] uppercase tracking-widest">Live Feed</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 scrollbar-thin scrollbar-thumb-white/10">
              {logs.length === 0 && (
                <div className="h-full flex items-center justify-center text-white/20 italic">
                  Waiting for system initialization...
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-white/30 shrink-0">[{log.timestamp}]</span>
                  <span className={cn(
                    "break-all",
                    log.type === "info" && "text-blue-400",
                    log.type === "success" && "text-emerald-400",
                    log.type === "match" && "text-rose-500 font-bold",
                    log.type === "error" && "text-red-500"
                  )}>
                    {log.type === "match" && ">>> "}
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {isScanning && (
              <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Crawl Progress</span>
                  <span className="text-[10px] font-bold text-white/60">Scanning Media Stream...</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--success)] animate-[shimmer_2s_infinite] transition-all duration-500" style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
