"use client";

import { useSyncExternalStore } from "react";
import { getSession, onAuthChange } from "@/lib/auth-client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-strong)]">Profile</h1>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={session?.name ?? "User"} size="lg" />
          <div>
            <p className="text-lg font-semibold text-[var(--text-strong)]">{session?.name}</p>
            <p className="text-sm text-[var(--text-muted)]">{session?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="info">Admin</Badge>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Full Name
            <input type="text" defaultValue={session?.name} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Email
            <input type="email" defaultValue={session?.email} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Company
            <input type="text" defaultValue={session?.company} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
          </label>
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Job Title
            <input type="text" placeholder="e.g. Media Rights Manager" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
          </label>
          <Button size="sm">Save Changes</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-3">
        <h3 className="text-base font-semibold text-[var(--text-strong)]">Account Information</h3>
        <div className="grid gap-2 sm:grid-cols-2 text-sm">
          {[
            ["Member since", session?.createdAt ? new Date(session.createdAt).toLocaleDateString() : "—"],
            ["Workspace", session?.company ?? "—"],
            ["Role", "Admin"],
            ["Last login", "Just now"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-[var(--surface-1)] p-3">
              <dt className="text-xs text-[var(--text-soft)] uppercase tracking-wider">{k}</dt>
              <dd className="mt-0.5 font-medium text-[var(--text-strong)]">{v}</dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
