"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getSession, clearSession } from "@/lib/auth-client";
import { Modal } from "@/components/ui/modal";
import { FileUploader } from "@/components/upload/file-uploader";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";

type TopbarProps = {
  sidebarCollapsed: boolean;
  onMenuToggle: () => void;
};

export function Topbar({ sidebarCollapsed, onMenuToggle }: TopbarProps) {
  const { logout } = useFirebaseAuth();
  const session = getSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearSession();
      window.location.replace("/login");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-40 flex h-16 items-center border-b border-[var(--stroke)] bg-[var(--surface-2)]/80 backdrop-blur-xl px-8 gap-4 transition-all duration-300",
        sidebarCollapsed ? "lg:left-[70px]" : "lg:left-[260px]"
      )}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition"
        aria-label="Toggle menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className={cn(
          "relative flex items-center rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] transition-all",
          searchFocused ? "border-[var(--brand)] shadow-[0_0_0_3px_rgba(99,102,241,0.1)]" : "border-transparent"
        )}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search assets, incidents, scans…"
            className="w-full bg-transparent py-2 pl-10 pr-4 text-sm text-[var(--text-strong)] placeholder:text-[var(--text-soft)] outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="hidden sm:inline-flex mr-3 h-5 items-center rounded border border-[var(--stroke)] bg-[var(--surface-2)] px-1.5 text-[10px] font-mono text-[var(--text-soft)]">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">


        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--danger)]" />
        </button>

        {/* Help */}
        <Link href="/dashboard/help" className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition" aria-label="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-[var(--surface-1)]"
          >
            <Avatar name={session?.name ?? "User"} size="sm" />
            <div className="hidden md:flex flex-col justify-center text-left">
              <p className="text-xs font-semibold text-[var(--text-strong)] leading-tight">{session?.name ?? "User"}</p>
              <p className="text-[10px] text-[var(--text-soft)] leading-none mt-0.5">{session?.company ?? "Workspace"}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--text-soft)] hidden md:block"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] py-1.5 shadow-xl scale-in">
                <div className="px-3 py-2 border-b border-[var(--stroke)] mb-1">
                  <p className="text-sm font-semibold text-[var(--text-strong)]">{session?.name}</p>
                  <p className="text-xs text-[var(--text-soft)]">{session?.email}</p>
                </div>
                <Link href="/dashboard/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Profile
                </Link>
                <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Settings
                </Link>
                <div className="border-t border-[var(--stroke)] mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-surface)] transition rounded-b-lg"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>


    </header>
  );
}
