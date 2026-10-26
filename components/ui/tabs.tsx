"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-[var(--stroke)]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
            activeTab === tab.id
              ? "text-[var(--brand)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-strong)]"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
              activeTab === tab.id
                ? "bg-[var(--brand-surface)] text-[var(--brand)]"
                : "bg-[var(--surface-1)] text-[var(--text-soft)]"
            )}>
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand)] rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
}
