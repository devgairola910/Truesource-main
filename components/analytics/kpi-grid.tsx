import { Chip } from "@/components/ui/chip";
import type { KpiRecord } from "@/lib/types";

type KpiGridProps = {
  items: KpiRecord[];
};

function trendChip(record: KpiRecord) {
  if (record.trend === "up") {
    return <Chip label="On track" tone="success" />;
  }

  if (record.trend === "down") {
    return <Chip label="Needs tuning" tone="danger" />;
  }

  return <Chip label="Stable" tone="neutral" />;
}

export function KpiGrid({ items }: KpiGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4"
        >
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--text-strong)]">{item.value}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Target: {item.target}</span>
            {trendChip(item)}
          </div>
        </article>
      ))}
    </div>
  );
}
