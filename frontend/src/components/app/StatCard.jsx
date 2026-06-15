import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ label, value, delta, deltaLabel, icon: Icon, tone = "neutral", testId }) {
  const toneBg = {
    lime: "bg-[var(--lime-soft)]",
    purple: "bg-[var(--purple-soft)]",
    neutral: "bg-[var(--tag)]",
    dark: "bg-[var(--inverse)] text-[var(--inverse-fg)]",
  }[tone];

  return (
    <div
      data-testid={testId}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(15,15,18,0.1)] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-[13px] font-medium text-[var(--muted)]">{label}</div>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl grid place-items-center ${toneBg}`}>
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="font-mono text-2xl md:text-3xl font-semibold text-[var(--ink)] tracking-tight">
        {value}
      </div>
      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px]">
          <span className={`inline-flex items-center gap-0.5 font-mono font-semibold ${delta >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
            {delta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
          {deltaLabel && <span className="text-[var(--muted-2)]">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
