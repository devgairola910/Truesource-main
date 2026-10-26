"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setSession } from "@/lib/auth-client";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      name,
      email: "invited@apex.com",
      company: "Apex Sports Media",
      createdAt: new Date().toISOString(),
      sessionToken: "inv-" + params.token,
    });
    setAccepted(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">You&apos;ve been invited!</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">Join the <strong className="text-[var(--text-strong)]">Apex Sports Media</strong> workspace on TrueSource</p>
        </div>

        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--brand-surface)] p-3 mb-5">
            <Badge variant="info">Reviewer</Badge>
            <span className="text-sm text-[var(--text-muted)]">You&apos;ll be able to review incidents and manage the whitelist</span>
          </div>

          {accepted ? (
            <div className="text-center py-8 space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--success-surface)] flex items-center justify-center text-[var(--success)]">✓</div>
              <p className="text-sm font-semibold text-[var(--text-strong)]">Welcome to the team!</p>
              <p className="text-xs text-[var(--text-soft)]">Redirecting to dashboard…</p>
            </div>
          ) : (
            <form onSubmit={handleAccept} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
                Your Name
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
                Create Password
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
              </label>
              <Button type="submit" className="w-full">Accept Invitation</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
