import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Award, TrendingUp, Trophy, Target } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import { earningsTrend, winRateByFormat, winRateByMarket, recentResults, currentUser } from "@/lib/mockData";

const COLORS = ["#B4E04C", "#A78BFA", "#0F0F12", "#10B981"];

export default function Stats() {
  return (
    <div data-testid="stats-page" className="space-y-8">
      <PageHeader
        eyebrow="Performance"
        title="My stats."
        description="Your full trading history across every format."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Matches played" value="84" icon={Trophy} tone="neutral" />
        <StatCard label="Win rate" value={`${currentUser.winRate}%`} delta={2.1} icon={Target} tone="lime" />
        <StatCard label="Best trade" value="+$3,420" icon={TrendingUp} tone="purple" />
        <StatCard label="STR tier" value={currentUser.tier} delta={5.4} deltaLabel="↑ this month" icon={Award} tone="dark" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Last 30 days</div>
              <div className="text-base font-semibold text-[#0F0F12]">Earnings</div>
            </div>
            <div className="font-mono text-2xl font-semibold text-[#10B981]">+$8,420</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsTrend} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0F0F12", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }}
                  cursor={{ stroke: "#A78BFA", strokeDasharray: "4 4" }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#7C3AED" strokeWidth={2} fill="url(#ge)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Format split</div>
          <div className="text-base font-semibold text-[#0F0F12]">Win rate by format</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={winRateByFormat} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {winRateByFormat.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0F0F12", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {winRateByFormat.map((f, i) => (
              <div key={f.name} className="flex items-center justify-between text-[12px]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  {f.name}
                </span>
                <span className="font-mono font-semibold text-[#0F0F12]">{f.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Markets</div>
          <div className="text-base font-semibold text-[#0F0F12] mb-4">Win rate by market</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRateByMarket} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F1EF" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0F0F12", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} cursor={{ fill: "#F5F5F2" }} />
                <Bar dataKey="value" fill="#B4E04C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 overflow-x-auto">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF] mb-1">History</div>
          <div className="text-base font-semibold text-[#0F0F12] mb-4">Match history</div>
          <table className="w-full text-[13px] min-w-[480px]">
            <thead className="text-[#9CA3AF] text-[11px]">
              <tr>
                <th className="text-left font-medium py-2 pr-3">Date</th>
                <th className="text-left font-medium py-2 pr-3">Format</th>
                <th className="text-left font-medium py-2 pr-3">Opponent</th>
                <th className="text-right font-medium py-2 pr-3">P&amp;L</th>
                <th className="text-right font-medium py-2">Prize</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {recentResults.map((r) => (
                <tr key={r.id} className="border-t border-[#F1F1EF]">
                  <td className="py-2.5 pr-3 text-[#6B7280]">{r.date}</td>
                  <td className="py-2.5 pr-3 text-[#0F0F12]">{r.format}</td>
                  <td className="py-2.5 pr-3 text-[#1F2024] truncate">{r.opponent}</td>
                  <td className={`py-2.5 pr-3 text-right font-semibold ${r.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {r.pnl >= 0 ? "+" : "−"}${Math.abs(r.pnl)}
                  </td>
                  <td className="py-2.5 text-right text-[#0F0F12] font-semibold">
                    {r.prize > 0 ? `$${r.prize}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
