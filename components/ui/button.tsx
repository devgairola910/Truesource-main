import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
};

const variantClasses: Record<string, string> = {
  primary: "bg-[var(--brand)] text-[var(--brand-ink)] shadow-sm hover:bg-[var(--brand-hover)]",
  secondary: "bg-[var(--surface-1)] text-[var(--text-strong)] border border-[var(--stroke)] hover:bg-[var(--surface-3)]",
  ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-1)] hover:text-[var(--text-strong)]",
  danger: "bg-[var(--danger)] text-white shadow-sm hover:opacity-90",
  outline: "bg-transparent border border-[var(--stroke)] text-[var(--text-strong)] hover:bg-[var(--surface-1)]",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
