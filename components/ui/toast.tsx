"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { cn, generateId } from "@/lib/utils";

type ToastType = "success" | "error" | "warning" | "info";
type Toast = { id: string; type: ToastType; message: string; title?: string };

type ToastContextType = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: string) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = generateId("toast");
      setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
      timers.current[id] = setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const typeStyles: Record<ToastType, string> = {
  success: "border-[var(--success)]/30 bg-[var(--surface-2)]",
  error: "border-[var(--danger)]/30 bg-[var(--surface-2)]",
  warning: "border-[var(--warning)]/30 bg-[var(--surface-2)]",
  info: "border-[var(--brand)]/30 bg-[var(--surface-2)]",
};

const dotColors: Record<ToastType, string> = {
  success: "bg-[var(--success)]",
  error: "bg-[var(--danger)]",
  warning: "bg-[var(--warning)]",
  info: "bg-[var(--brand)]",
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg slide-up min-w-[300px] max-w-[420px]",
        typeStyles[toast.type]
      )}
    >
      <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", dotColors[toast.type])} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-sm font-semibold text-[var(--text-strong)]">{toast.title}</p>}
        <p className="text-sm text-[var(--text-muted)]">{toast.message}</p>
      </div>
      <button onClick={onClose} className="shrink-0 text-[var(--text-soft)] hover:text-[var(--text-strong)] transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );
}
