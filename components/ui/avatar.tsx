import { cn, getInitials } from "@/lib/utils";

type AvatarProps = {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = { sm: "h-7 w-7 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-11 w-11 text-sm" };

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full bg-[var(--brand-surface)] text-[var(--brand)] font-semibold flex items-center justify-center",
        sizeMap[size],
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
