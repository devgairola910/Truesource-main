type ChipTone = "neutral" | "success" | "warning" | "danger";

type ChipProps = {
  label: string;
  tone?: ChipTone;
};

const toneClassMap: Record<ChipTone, string> = {
  neutral: "bg-[var(--surface-3)] text-[var(--text-muted)] border-[var(--stroke)]",
  success: "bg-emerald-100/80 text-emerald-800 border-emerald-300/80",
  warning: "bg-amber-100/90 text-amber-800 border-amber-300/80",
  danger: "bg-rose-100/90 text-rose-800 border-rose-300/80",
};

export function Chip({ label, tone = "neutral" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${toneClassMap[tone]}`}
    >
      {label}
    </span>
  );
}
