import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from "recharts";
import { Award, TrendingUp, Trophy, Target } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import { useFetch } from "@/lib/useFetch";
import { getMyStats, matchHistory } from "@/lib/api";

const COLORS = ["#B4E04C", "#A78BFA", "var(--ink)", "#10B981"];

export default function Stats() {
  const { data: stats } = useFetch(getMyStats);
  const { data: history } = useFetch(matchHistory);
  const rows = history || [];

  if (!stats) return <div className="h-96 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />;

  const earningsTotal = stats.earnings_trend.at(-1)?.earnings || 0;

  return (
    <div data-testid="stats-page" className="space-y-8">
      <PageHeader eyebrow="Performance" title="My stats." description="Your full trading history across every format." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Matches played" value={stats.matches_played} icon={Trophy} tone="neutral" />
        <StatCard label="Win rate" value={`${stats.win_rate}%`} delta={2.1} icon={Target} tone="lime" />
        <StatCard label="Best trade" value={stats.best_trade ? `+$${Number(stats.best_trade).toLocaleString()}` : "—"} icon={TrendingUp} tone="purple" />
        <StatCard label="STR tier" value={stats.tier} delta={5.4} deltaLabel="↑ this month" icon={Award} tone="dark" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Last 30 days</div>
              <div className="text-base font-semibold text-[var(--ink)]">Earnings</div>
            </div>
            <div className="font-mono text-2xl font-semibold text-[#10B981]">+${earningsTotal.toLocaleString()}</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.earnings_trend} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <defs><linearGradient id="ge" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A78BFA" stopOpacity={0.5} /><stop offset="100%" stopColor="#A78BFA" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
                <XAxis dataKey="day" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} cursor={{ stroke: "#A78BFA", strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="earnings" stroke="#7C3AED" strokeWidth={2} fill="url(#ge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Format split</div>
          <div className="text-base font-semibold text-[var(--ink)]">Win rate by format</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.win_rate_by_format} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {stats.win_rate_by_format.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {stats.win_rate_by_format.map((f, i) => (
              <div key={f.name} className="flex items-center justify-between text-[12px]">
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{f.name}</span>
                <span className="font-mono font-semibold text-[var(--ink)]">{f.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Markets</div>
          <div className="text-base font-semibold text-[var(--ink)] mb-4">Win rate by market</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.win_rate_by_market} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} cursor={{ fill: "var(--bg-soft)" }} />
                <Bar dataKey="value" fill="#B4E04C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 overflow-x-auto">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)] mb-1">History</div>
          <div className="text-base font-semibold text-[var(--ink)] mb-4">Match history</div>
          <table className="w-full text-[13px] min-w-[480px]">
            <thead className="text-[var(--muted-2)] text-[11px]">
              <tr>
                <th className="text-left font-medium py-2 pr-3">Date</th>
                <th className="text-left font-medium py-2 pr-3">Format</th>
                <th className="text-left font-medium py-2 pr-3">Opponent</th>
                <th className="text-right font-medium py-2 pr-3">P&amp;L</th>
                <th className="text-right font-medium py-2">Prize</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[var(--border-soft)]">
                  <td className="py-2.5 pr-3 text-[var(--muted)]">{r.date_label}</td>
                  <td className="py-2.5 pr-3 text-[var(--ink)]">{r.format}</td>
                  <td className="py-2.5 pr-3 text-[var(--ink-soft)] truncate">{r.opponent}</td>
                  <td className={`py-2.5 pr-3 text-right font-semibold ${r.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{r.pnl >= 0 ? "+" : "−"}${Math.abs(r.pnl)}</td>
                  <td className="py-2.5 text-right text-[var(--ink)] font-semibold">{r.prize > 0 ? `$${r.prize}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
