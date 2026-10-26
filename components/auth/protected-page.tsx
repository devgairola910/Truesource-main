"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession, onAuthChange } from "@/lib/auth-client";

type ProtectedPageProps = {
  children: React.ReactNode;
};

export function ProtectedPage({ children }: ProtectedPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSyncExternalStore(onAuthChange, getSession, () => null);

  useEffect(() => {
    if (!session) {
      const redirectPath = pathname || "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [pathname, router, session]);

  if (!session) {
    return (
      <section className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 text-sm text-[var(--text-muted)]">
        Checking your session...
      </section>
    );
  }

  return <>{children}</>;
}
