"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Conditionally renders the marketing header/footer/wrapper.
 * Dashboard routes (/dashboard/*) get a bare layout since they
 * have their own AppShell provided by app/dashboard/layout.tsx.
 * Auth-standalone pages (forgot-password, invite) also skip the shell.
 */
const BARE_PREFIXES = ["/dashboard", "/forgot-password", "/invite"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
