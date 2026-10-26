type SectionCardProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={`modern-card rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8 ${className ?? ""}`}
    >
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-[var(--stroke)] pb-4">
        <div className="space-y-1.5">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-[var(--text-strong)]">
            {title}
          </h2>
          <p className="text-sm font-medium text-[var(--text-soft)]">{description}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      <div className="text-[var(--text-muted)]">
        {children}
      </div>
    </section>
  );
}
