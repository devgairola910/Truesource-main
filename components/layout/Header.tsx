"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getSession, onAuthChange, clearSession } from "@/lib/auth-client";

export function Header() {
  const pathname = usePathname();
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);

  React.useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    Promise.all([
      import("@/lib/firebase"),
      import("firebase/auth")
    ]).then(([{ auth }, { onAuthStateChanged }]) => {
      if (!isMounted) return;
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (!firebaseUser && getSession()) {
          clearSession();
        }
      });
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const navLinks = [
    { href: "/", label: "Solutions" },
    { href: "/pricing", label: "Verification" },
    { href: "/intelligence", label: "Intelligence" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-[var(--stroke)] bg-[var(--background)]/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand)] text-white shadow-lg shadow-indigo-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-lg font-black tracking-tight text-[var(--text-strong)] uppercase">TrueSource</span>
              <span className="text-[9px] font-black tracking-[0.2em] text-[var(--brand)] uppercase">Rights Protection</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-black uppercase tracking-[0.15em] transition-colors",
                  pathname === link.href ? "text-[var(--brand)]" : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link 
                href="/dashboard"
                className="h-10 px-6 flex items-center rounded-xl bg-[var(--brand-surface)] text-[var(--brand)] text-[10px] font-black uppercase tracking-widest transition hover:bg-[var(--brand)] hover:text-white border border-[var(--brand)]/10"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => { clearSession(); window.location.href = "/"; }}
                className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-[var(--danger)] hover:text-red-400 px-4 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login"
                className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-strong)] px-4 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="h-10 px-8 flex items-center rounded-xl bg-[var(--brand)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
