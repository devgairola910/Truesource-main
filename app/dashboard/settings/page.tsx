"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { getSession } from "@/lib/auth-client";

export default function SettingsPage() {
  const [tab, setTab] = useState("organization");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Settings</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Workspace and organization configuration</p>
      </div>

      <Tabs
        tabs={[
          { id: "organization", label: "Organization" },
          { id: "notifications", label: "Notifications" },
          { id: "security", label: "Security" },
          { id: "domains", label: "Domain Allowlist" },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === "organization" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-5">
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Organization Details</h3>
            {[
              { label: "Organization Name", value: "Apex Sports Media", placeholder: "" },
              { label: "Industry", value: "Sports & Media", placeholder: "" },
              { label: "Website", value: "https://apex-sports.com", placeholder: "" },
            ].map((f) => (
              <label key={f.label} className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
                {f.label}
                <input type="text" defaultValue={f.value} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
              </label>
            ))}
            <Button size="sm">Save Changes</Button>
          </div>
          <div className="rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger-surface)] p-6 space-y-3">
            <h3 className="text-base font-semibold text-[var(--danger)]">Danger Zone</h3>
            <p className="text-sm text-[var(--text-muted)]">Deleting the organization will permanently remove all assets, incidents, and team data.</p>
            <Button size="sm" variant="danger">Delete Organization</Button>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="max-w-2xl rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-4">
          <h3 className="text-base font-semibold text-[var(--text-strong)]">Notification Preferences</h3>
          {[
            { label: "Critical incidents", desc: "Get notified immediately for critical severity alerts", checked: true },
            { label: "New scan results", desc: "Summary notification after each scan run completes", checked: true },
            { label: "Asset processing complete", desc: "Notify when fingerprinting and indexing finishes", checked: false },
            { label: "Team activity", desc: "Updates on team member actions and reviews", checked: false },
            { label: "Weekly digest", desc: "Weekly summary of detections and performance", checked: true },
          ].map((n) => (
            <label key={n.label} className="flex items-start gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4 cursor-pointer hover:bg-[var(--surface-2)] transition">
              <input type="checkbox" defaultChecked={n.checked} className="mt-0.5 h-4 w-4 accent-[var(--brand)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--text-strong)]">{n.label}</p>
                <p className="text-xs text-[var(--text-soft)]">{n.desc}</p>
              </div>
            </label>
          ))}
          <Button size="sm">Save Preferences</Button>
        </div>
      )}

      {tab === "security" && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-4">
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Password</h3>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Current Password
              <input type="password" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              New Password
              <input type="password" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm input-focus-ring mt-1" />
            </label>
            <Button size="sm">Update Password</Button>
          </div>
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-3">
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Two-Factor Authentication</h3>
            <p className="text-sm text-[var(--text-muted)]">Add an extra layer of security to your account.</p>
            <div className="flex items-center gap-2">
              <Badge variant="default">Not enabled</Badge>
              <Button size="sm" variant="outline">Enable 2FA</Button>
            </div>
          </div>
        </div>
      )}

      {tab === "domains" && <WhitelistTab />}
    </div>
  );
}

function WhitelistTab() {
  const [domains, setDomains] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [newReason, setNewReason] = useState("");

  const fetchDomains = async () => {
    const session = getSession();
    if (!session?.idToken) return;
    try {
      const res = await fetch("/api/whitelist", {
        headers: { "Authorization": `Bearer ${session.idToken}` }
      });
      const data = await res.json();
      setDomains(data.domains || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAdd = async () => {
    if (!newDomain || !newReason) return;
    const session = getSession();
    const res = await fetch("/api/whitelist", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${session?.idToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ domain: newDomain, owner: "Internal", reason: newReason })
    });
    if (res.ok) {
      setNewDomain("");
      setNewReason("");
      fetchDomains();
    }
  };

  const handleRemove = async (domain: string) => {
    const session = getSession();
    await fetch(`/api/whitelist?domain=${domain}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${session?.idToken}` }
    });
    fetchDomains();
  };

  if (isLoading) return <div className="p-8 text-center text-[var(--text-soft)]">Loading allowlist...</div>;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-4">
        <h3 className="text-base font-semibold text-[var(--text-strong)]">Allowlisted Domains</h3>
        <p className="text-sm text-[var(--text-muted)]">Domains added here will not trigger incident alerts.</p>
        
        {domains.length === 0 ? (
          <div className="py-8 text-center text-sm text-[var(--text-soft)] border border-dashed border-[var(--stroke)] rounded-xl">
            No domains in allowlist yet.
          </div>
        ) : domains.map((d) => (
          <div key={d.domain} className="flex items-center gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-strong)]">{d.domain}</p>
              <p className="text-xs text-[var(--text-soft)]">{d.reason}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleRemove(d.domain)}>Remove</Button>
          </div>
        ))}

        <div className="space-y-2 pt-4 border-t border-[var(--stroke)]">
          <p className="text-xs font-bold text-[var(--text-strong)] uppercase tracking-wider">Add Domain</p>
          <div className="flex gap-2">
            <input type="text" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="Domain (e.g. youtube.com)" className="flex-1 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm input-focus-ring" />
            <input type="text" value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Reason" className="flex-1 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm input-focus-ring" />
            <Button size="sm" onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
