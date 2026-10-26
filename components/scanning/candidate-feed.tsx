import { Chip } from "@/components/ui/chip";
import type { CandidateRecord } from "@/lib/types";

type CandidateFeedProps = {
  items: CandidateRecord[];
};

function stageChipTone(stage: CandidateRecord["stage"]) {
  if (stage === "queued-alert") {
    return "danger" as const;
  }

  if (stage === "deep-match") {
    return "warning" as const;
  }

  return "neutral" as const;
}

export function CandidateFeed({ items }: CandidateFeedProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-3.5"
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-soft)]">
              {item.id}
            </p>
            <Chip
              label={item.stage.replace("-", " ")}
              tone={stageChipTone(item.stage)}
            />
          </div>
          <p className="text-sm font-semibold text-[var(--text-strong)]">{item.sourceDomain}</p>
          <p className="mt-1 line-clamp-1 text-xs text-[var(--text-soft)]">{item.sourceUrl}</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{item.signalSummary}</p>
          <footer className="mt-3 flex items-center justify-between text-xs text-[var(--text-soft)]">
            <span className="uppercase">{item.mediaType}</span>
            <span>{item.extractedAt}</span>
          </footer>
        </article>
      ))}
    </div>
  );
}
