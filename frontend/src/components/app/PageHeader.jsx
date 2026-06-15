export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)] mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[15px] text-[var(--body)] max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
