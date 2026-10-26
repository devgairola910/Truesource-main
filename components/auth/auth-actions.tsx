"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { clearSession, getSession, onAuthChange } from "@/lib/auth-client";

export function AuthActions() {
  const router = useRouter();
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);
  const isLoggedIn = Boolean(session);

  async function handleLogout() {
    if (session?.sessionToken) {
      try {
        await fetch("/api/auth/session", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.sessionToken}`,
          },
        });
      } catch {
        // Clear client session even if the network call fails.
      }
    }

    clearSession();
    router.push("/");
    router.refresh();
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-1.5 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-[var(--danger)] px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-1.5 text-sm font-semibold text-[var(--text-strong)] transition hover:bg-[var(--surface-3)]"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="rounded-lg bg-[var(--brand)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
      >
        Sign Up
      </Link>
    </div>
  );
}
