/** Merge class names, filtering out falsy values */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format bytes to human-readable string */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Format a percentage from 0-1 to display string */
export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name.split(" ").map((p) => p.charAt(0)).join("").toUpperCase().slice(0, 2);
}

/** Generate a random ID */
export function generateId(prefix = ""): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return prefix ? `${prefix}-${id}` : id;
}

/** Truncate string */
export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + "…";
}

/** Delay helper for mock APIs */
export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
