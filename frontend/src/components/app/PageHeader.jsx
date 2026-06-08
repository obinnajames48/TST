export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF] mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-[15px] text-[#4B5563] max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
