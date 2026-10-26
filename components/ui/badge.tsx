import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
};

const variants: Record<string, string> = {
  default: "bg-[var(--surface-1)] text-[var(--text-muted)] border-[var(--stroke)]",
  success: "bg-[var(--success-surface)] text-[var(--success)] border-[var(--success)]/20",
  warning: "bg-[var(--warning-surface)] text-[var(--warning)] border-[var(--warning)]/20",
  danger: "bg-[var(--danger-surface)] text-[var(--danger)] border-[var(--danger)]/20",
  info: "bg-[var(--brand-surface)] text-[var(--brand)] border-[var(--brand)]/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-5 tracking-wide",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
