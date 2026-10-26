"use client";

import { useEffect, useCallback } from "react";

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

/**
 * Hook to listen for keyboard shortcuts globally.
 * Automatically handles both Ctrl (Windows/Linux) and Cmd (Mac) via meta.
 */
export function useKeyboardShortcut(
  combo: KeyCombo,
  callback: (e: KeyboardEvent) => void,
  enabled = true
) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        // Allow Escape in inputs
        if (combo.key !== "Escape") return;
      }

      const keyMatch = e.key.toLowerCase() === combo.key.toLowerCase();
      const ctrlMatch = combo.ctrl ? e.ctrlKey || e.metaKey : true;
      const metaMatch = combo.meta ? e.metaKey || e.ctrlKey : true;
      const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = combo.alt ? e.altKey : !e.altKey;

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch) {
        e.preventDefault();
        callback(e);
      }
    },
    [combo, callback, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
