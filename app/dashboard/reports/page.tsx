"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const session = getSession();
      if (!session) return;
      const response = await fetch("/api/dashboard", {
        headers: { "Authorization": `Bearer ${session.idToken}` }
      });
      const resData = await response.json();
      setData(resData.snapshot);
    }
    fetchData();
  }, []);

  const downloadCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    // Extract headers
    const headers = Object.keys(rows[0]).filter(k => typeof rows[0][k] !== 'object');
    
    // Create CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => headers.map(header => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(","))
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (reportId: string) => {
    setIsGenerating(reportId);
    
    // Simulate generation delay for feedback
    await new Promise(r => setTimeout(r, 600));

    if (reportId === "RPT-ALERTS") {
      downloadCSV("Critical_Incidents_Report", data?.recentAlerts || []);
    } else if (reportId === "RPT-ASSETS") {
      downloadCSV("Protected_Assets_Registry", data?.recentAssets || []);
    }

    setIsGenerating(null);
  };

  const reports = [
    { 
      id: "RPT-ALERTS", 
      title: "Global Incidents Report", 
      desc: "Full log of all detected signals and unauthorized distributions.", 
      count: data?.recentAlerts?.length ?? 0,
      format: "CSV" 
    },
    { 
      id: "RPT-ASSETS", 
      title: "Protected Assets Registry", 
      desc: "Comprehensive list of all registered media and fingerprints.", 
      count: data?.recentAssets?.length ?? 0,
      format: "CSV" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Data Exports</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Download raw intelligence data</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        {reports.map((r) => (
          <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-5 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-[var(--brand-surface)] flex items-center justify-center text-[var(--brand)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[var(--text-strong)]">{r.title}</p>
                <Badge variant="default" className="text-[9px] uppercase tracking-wider">{r.format}</Badge>
              </div>
              <p className="text-xs text-[var(--text-soft)] mt-0.5">{r.desc}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[var(--text-strong)]">{r.count}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">Records</p>
              </div>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => handleExport(r.id)}
                disabled={isGenerating === r.id || !data}
                className={cn(isGenerating === r.id && "opacity-70")}
              >
                {isGenerating === r.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
