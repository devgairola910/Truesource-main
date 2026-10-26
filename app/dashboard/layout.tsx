"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, onAuthChange, clearSession } from "@/lib/auth-client";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";

import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui/toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);
  const { loading: firebaseLoading } = useFirebaseAuth(); // Mount the hook to listen to onIdTokenChanged

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser && getSession()) {
        clearSession();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!session && !firebaseLoading) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [session, firebaseLoading, pathname, router]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 rounded-full border-2 border-[var(--brand)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Checking your session…</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <AppShell>{children}</AppShell>
    </ToastProvider>
  );
}
