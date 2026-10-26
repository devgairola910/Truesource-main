"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand)] text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Reset your password</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            {sent ? "Check your email for a reset link." : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-[var(--success-surface)] flex items-center justify-center text-[var(--success)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <p className="text-sm text-[var(--text-muted)]">We sent a password reset link to <strong className="text-[var(--text-strong)]">{email}</strong></p>
              <Link href="/login"><Button variant="secondary" className="w-full">Back to Sign In</Button></Link>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
                Email Address
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
              </label>
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-muted)]">
          Remember your password? <Link href="/login" className="font-semibold text-[var(--brand)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
