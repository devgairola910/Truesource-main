import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number; // 0-100
  size?: "sm" | "md";
  color?: string;
  className?: string;
};

export function Progress({ value, size = "md", color, className }: ProgressProps) {
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-[var(--surface-3)]", h, className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", h)}
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          backgroundColor: color || "var(--brand)",
        }}
      />
    </div>
  );
}
