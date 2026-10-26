"use client";

import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";
import Link from "next/link";

export function SetPasswordForm() {
  const { user } = useFirebaseAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      setStatus("error");
      setMessage("Password must include uppercase, lowercase, a number, and a symbol.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      await updatePassword(user, password);
      setStatus("success");
      setMessage("Password set successfully! You can now use this password to log in with your email.");
    } catch (error: any) {
      console.error("Error setting password:", error);
      if (error.code === "auth/requires-recent-login") {
        setStatus("error");
        setMessage("Please sign in again to set your password.");
      } else {
        setStatus("error");
        setMessage(error.message || "Failed to set password.");
      }
    }
  };

  if (status === "success") {
    return (
      <SectionCard title="Password Set" description="Security updated" className="max-w-md mx-auto">
        <p className="text-sm text-[var(--text-muted)] mb-4">{message}</p>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[var(--success)] text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Account secured
          </div>
          <Link href="/dashboard" className="block">
            <Button className="w-full">
              Continue to Dashboard
            </Button>
          </Link>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Set Account Password" description="Create a password for your account" className="max-w-md mx-auto p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)] transition-all"
            placeholder="At least 8 chars with A, a, 1, #"
            required
            disabled={status === "loading"}
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1.5">
            {[
              { label: "8+ Chars", met: password.length >= 8 },
              { label: "Uppercase", met: /[A-Z]/.test(password) },
              { label: "Lowercase", met: /[a-z]/.test(password) },
              { label: "Number", met: /[0-9]/.test(password) },
              { label: "Symbol", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
            ].map((req) => (
              <div key={req.label} className="flex items-center gap-1">
                <div className={`h-1 w-1 rounded-full ${req.met ? "bg-[var(--success)]" : "bg-[var(--text-soft)]"}`} />
                <span className={`text-[9px] uppercase tracking-wider font-semibold ${req.met ? "text-[var(--success)]" : "text-[var(--text-soft)]"}`}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)] transition-all"
            placeholder="Confirm your password"
            required
            disabled={status === "loading"}
          />
        </div>

        {status === "error" && (
          <p className="text-[10px] text-[var(--danger)] bg-[var(--danger-surface)] p-2 rounded-lg border border-[var(--danger)]/20">
            {message}
          </p>
        )}

        <Button 
          type="submit" 
          size="sm"
          className="w-full mt-2" 
          disabled={status === "loading" || !password || !confirmPassword}
        >
          {status === "loading" ? "Updating..." : "Set Password"}
        </Button>
      </form>
    </SectionCard>
  );
}
