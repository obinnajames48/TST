import { Users, DollarSign, Swords, Banknote, ShieldCheck, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useFetch } from "@/lib/useFetch";
import { adminOverview, adminAuditLog } from "@/lib/adminApi";

const COLORS = ["#B4E04C", "#A78BFA", "var(--ink)"];

export default function AdminOverview() {
  const { data } = useFetch(adminOverview, { pollMs: 10000 });
  const { data: audit } = useFetch(adminAuditLog, { pollMs: 8000 });

  if (!data) return <div className="h-96 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />;

  return (
    <div className="space-y-8" data-testid="admin-overview">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Overview</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Operations.</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Kpi label="Total users" value={data.total_users} icon={Users} tone="lime" />
        <Kpi label="Active 30d" value={data.active_30d} icon={Activity} tone="purple" />
        <Kpi label="Revenue MTD" value={`$${data.revenue_mtd.toLocaleString()}`} icon={DollarSign} tone="lime" />
        <Kpi label="Live matches" value={data.live_matches} icon={Swords} tone="dark" />
        <Kpi label="Pending Wd." value={data.pending_withdrawals} icon={Banknote} tone="purple" />
        <Kpi label="KYC pending" value={data.pending_kyc} icon={ShieldCheck} tone="neutral" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Last 30 days</div>
          <div className="text-base font-semibold text-[var(--ink)] mb-4">New registrations</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.daily_registrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} cursor={{ fill: "var(--bg-soft)" }} />
                <Bar dataKey="count" fill="#B4E04C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">MTD</div>
          <div className="text-base font-semibold text-[var(--ink)] mb-4">Revenue breakdown</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.revenue_breakdown} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {data.revenue_breakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {data.revenue_breakdown.map((r, i) => (
              <div key={r.name} className="flex items-center justify-between text-[12px]">
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />{r.name}</span>
                <span className="font-mono font-semibold text-[var(--ink)]">${r.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Live feed</div>
        <div className="text-base font-semibold text-[var(--ink)] mb-4">Recent admin actions</div>
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {(audit || []).slice(0, 12).map((a, i) => (
            <li key={i} className="flex items-center gap-3 text-[13px] py-2 border-b border-[var(--border-soft)] last:border-0">
              <span className="font-mono text-[10px] text-[var(--muted-2)] w-32 shrink-0">{new Date(a.created_at).toLocaleString()}</span>
              <span className="text-[var(--ink)] font-semibold">{a.action}</span>
              <span className="text-[var(--muted)] font-mono text-[11px] truncate">{a.target}</span>
            </li>
          ))}
          {(!audit || audit.length === 0) && <li className="text-[var(--muted-2)] text-[13px]">No actions yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone }) {
  const bg = { lime: "bg-[var(--lime-soft)]", purple: "bg-[var(--purple-soft)]", dark: "bg-[var(--inverse)] text-[var(--inverse-fg)]", neutral: "bg-[var(--tag)]" }[tone];
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[12px] font-medium text-[var(--muted)]">{label}</div>
        <div className={`w-8 h-8 rounded-lg grid place-items-center ${bg}`}><Icon className="w-3.5 h-3.5" /></div>
      </div>
      <div className="font-mono text-xl font-semibold text-[var(--ink)]">{value}</div>
    </div>
  );
}
