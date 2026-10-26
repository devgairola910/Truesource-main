"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setLastVisitedPath } from "@/lib/auth-client";

const ignoredPaths = [
  "/login",
  "/signup",
  "/welcome",
  "/onboarding",
  "/profile/setup",
];

export function LastVisitedTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || ignoredPaths.includes(pathname)) {
      return;
    }

    setLastVisitedPath(pathname);
  }, [pathname]);

  return null;
}
