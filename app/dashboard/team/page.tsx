"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { getSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

type Role = "admin" | "reviewer" | "analyst" | "viewer";

interface Member {
  name: string;
  email: string;
  role: Role;
  status: string;
  lastActive: string;
}

const roleColors: Record<Role, string> = { admin: "danger", reviewer: "warning", analyst: "info", viewer: "default" };

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("reviewer");

  useEffect(() => {
    async function fetchTeam() {
      const session = getSession();
      if (!session?.idToken) return;
      try {
        const res = await fetch("/api/team", {
          headers: { "Authorization": `Bearer ${session.idToken}` }
        });
        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTeam();
  }, []);

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Team Management</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{members.length} members · Role-based access control</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          Invite Member
        </Button>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        {members.map((m) => (
          <div key={m.email} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition">
            <Avatar name={m.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-strong)]">{m.name}</p>
              <p className="text-xs text-[var(--text-soft)]">{m.email}</p>
            </div>
            <Badge variant={roleColors[m.role] as "danger" | "warning" | "info" | "default"}>{m.role}</Badge>
            <Badge variant={m.status === "active" ? "success" : "default"}>{m.status}</Badge>
            <span className="text-xs text-[var(--text-soft)] w-16 text-right">{m.lastActive}</span>
            <Button size="sm" variant="ghost">Edit</Button>
          </div>
        ))}
      </div>

      {/* Role descriptions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          { role: "Admin", desc: "Full access to all features, settings, and team management" },
          { role: "Reviewer", desc: "Can review incidents, confirm/dismiss alerts, and manage whitelist" },
          { role: "Analyst", desc: "Access to analytics, reports, and read-only incident views" },
          { role: "Viewer", desc: "Read-only access to dashboard and asset library" },
        ]).map((r) => (
          <div key={r.role} className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4">
            <p className="text-sm font-semibold text-[var(--text-strong)]">{r.role}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* Invite modal */}
      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Team Member" description="Send an invitation to join your workspace">
        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Email Address
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Role
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as Role)} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1">
              <option value="reviewer">Reviewer</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => setInviteOpen(false)}>Send Invitation</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
