import { useNavigate } from "react-router-dom";
import { Wallet, Swords, Trophy, Target, ArrowUpRight, ArrowRight, Eye } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  currentUser,
  liveMatches,
  myMatches,
  recentResults,
  upcomingTournaments,
  earningsTrend,
} from "@/lib/mockData";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div data-testid="dashboard-page" className="space-y-8">
      <PageHeader
        eyebrow={`Welcome back, @${currentUser.username}`}
        title="Your arena, today."
        description="Live matches, your active duels, and what's coming up."
        actions={
          <>
            <button
              onClick={() => navigate("/app/duel")}
              className="inline-flex items-center gap-2 bg-white border border-[#ECECEA] text-[#0F0F12] font-medium text-[14px] px-4 py-2.5 rounded-full hover:bg-[#F5F5F2]"
              data-testid="dashboard-find-duel"
            >
              Find a duel <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/app/royale")}
              className="inline-flex items-center gap-2 bg-[#0F0F12] text-white font-medium text-[14px] px-4 py-2.5 rounded-full hover:bg-[#1F2024]"
              data-testid="dashboard-join-royale"
            >
              Join a royale
              <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[#0F0F12]">
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </span>
            </button>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total earnings"
          value={`$${currentUser.lifetimeEarned.toLocaleString()}`}
          delta={12.4}
          deltaLabel="vs last month"
          icon={Wallet}
          tone="lime"
          testId="stat-earnings"
        />
        <StatCard
          label="Active matches"
          value={myMatches.length}
          icon={Swords}
          tone="purple"
          testId="stat-active"
        />
        <StatCard
          label="Win rate"
          value={`${currentUser.winRate}%`}
          delta={2.1}
          deltaLabel="last 10"
          icon={Target}
          tone="neutral"
          testId="stat-winrate"
        />
        <StatCard
          label="Global STR rank"
          value={`#${currentUser.globalRank}`}
          delta={-3.2}
          deltaLabel={currentUser.tier}
          icon={Trophy}
          tone="dark"
          testId="stat-rank"
        />
      </div>

      {/* Earnings chart + Active match panel */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">
                Last 30 days
              </div>
              <div className="text-base font-semibold text-[#0F0F12]">Earnings trend</div>
            </div>
            <div className="font-mono text-2xl font-semibold text-[#0F0F12]">
              +$8,420
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsTrend} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-earn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B4E04C" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#B4E04C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#0F0F12",
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontFamily: "Geist Mono, monospace",
                    fontSize: 12,
                  }}
                  cursor={{ stroke: "#B4E04C", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#0F0F12"
                  strokeWidth={2}
                  fill="url(#g-earn)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0F0F12] text-white rounded-2xl p-6 relative overflow-hidden" data-testid="active-match-card">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B4E04C] rounded-full blur-[80px] opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">
                  Your active duel
                </div>
                <div className="text-base font-semibold mt-0.5">Duel #4781</div>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-medium">
                <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full" />
                Live
              </span>
            </div>
            <div className="font-mono text-3xl font-semibold tracking-tight">
              03:42:11
            </div>
            <div className="text-xs text-white/50 mt-1">vs @GoldHands · $100K account</div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/50 font-mono">You</div>
                <div className="font-mono text-lg font-semibold text-[#B4E04C]">+$2,847</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="text-[10px] text-white/50 font-mono">Opponent</div>
                <div className="font-mono text-lg font-semibold text-[#FF4C6A]">−$1,600</div>
              </div>
            </div>

            <button
              onClick={() => navigate("/app/match/4781")}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[13px] py-2.5 rounded-full hover:bg-white"
              data-testid="open-active-match"
            >
              Open match <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Live matches + Recent results + Tournaments */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-[#ECECEA] rounded-2xl p-6" data-testid="live-matches-widget">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">
                Spectate
              </div>
              <div className="text-base font-semibold text-[#0F0F12]">Live now</div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
              {liveMatches.length} live
            </span>
          </div>
          <div className="divide-y divide-[#F1F1EF]">
            {liveMatches.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/app/match/${m.id}`)}
                className="w-full py-3 flex items-center gap-3 hover:bg-[#F5F5F2] -mx-2 px-2 rounded-lg transition-colors text-left"
                data-testid={`live-match-${m.id}`}
              >
                {m.custom && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#EDE7FE] text-[#7C3AED] px-1.5 py-0.5 rounded">
                    Pro
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#0F0F12] truncate">
                    @{m.traderA} <span className="text-[#9CA3AF]">vs</span> @{m.traderB}
                  </div>
                  <div className="text-xs text-[#6B7280] font-mono">
                    ${(m.account / 1000).toFixed(0)}K · {m.timeLeft} · {m.spectators} watching
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end shrink-0">
                  <span className={`font-mono text-sm font-semibold ${m.pnlA >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {m.pnlA >= 0 ? "+" : "−"}${Math.abs(m.pnlA).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] font-mono">leading</span>
                </div>
                <Eye className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">
            Upcoming
          </div>
          <div className="text-base font-semibold text-[#0F0F12] mb-4">Tournaments</div>
          <div className="space-y-3">
            {upcomingTournaments.map((t) => (
              <div key={t.id} className="rounded-xl bg-[#FAFAF7] border border-[#F1F1EF] p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[13px] font-semibold text-[#0F0F12]">{t.name}</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-[#0F0F12] text-white px-2 py-0.5 rounded-full">
                    {t.stage}
                  </span>
                </div>
                <div className="text-xs text-[#6B7280] font-mono">
                  {t.registered}/{t.capacity} · Starts {t.startDate}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-[#10B981]">
                    ${t.prizePool.toLocaleString()} pool
                  </span>
                  <button
                    onClick={() => navigate("/app/tournament")}
                    className="text-xs font-medium text-[#0F0F12] hover:text-[#7C3AED] inline-flex items-center gap-1"
                  >
                    View <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent results */}
      <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">
              History
            </div>
            <div className="text-base font-semibold text-[#0F0F12]">Recent results</div>
          </div>
          <button
            onClick={() => navigate("/app/stats")}
            className="text-xs font-medium text-[#0F0F12] hover:text-[#7C3AED] inline-flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[#9CA3AF]">
              <tr>
                <th className="text-left font-medium py-2 pr-4">Date</th>
                <th className="text-left font-medium py-2 pr-4">Format</th>
                <th className="text-left font-medium py-2 pr-4">Opponent</th>
                <th className="text-right font-medium py-2 pr-4">Account</th>
                <th className="text-right font-medium py-2 pr-4">P&amp;L</th>
                <th className="text-right font-medium py-2">Prize</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {recentResults.map((r) => (
                <tr key={r.id} className="border-t border-[#F1F1EF]" data-testid={`result-row-${r.id}`}>
                  <td className="py-3 pr-4 text-[#6B7280]">{r.date}</td>
                  <td className="py-3 pr-4 text-[#0F0F12]">{r.format}</td>
                  <td className="py-3 pr-4 text-[#1F2024]">{r.opponent}</td>
                  <td className="py-3 pr-4 text-right text-[#1F2024]">${r.account.toLocaleString()}</td>
                  <td className={`py-3 pr-4 text-right font-semibold ${r.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {r.pnl >= 0 ? "+" : "−"}${Math.abs(r.pnl)}
                  </td>
                  <td className="py-3 text-right text-[#0F0F12] font-semibold">
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
