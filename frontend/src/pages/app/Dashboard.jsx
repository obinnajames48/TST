import { useNavigate } from "react-router-dom";
import { Wallet, Swords, Trophy, Target, ArrowUpRight, ArrowRight, Eye, Flame } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useFetch } from "@/lib/useFetch";
import { getDashboard } from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading } = useFetch(getDashboard, { pollMs: 4000 });

  if (loading || !data) return <DashboardSkeleton />;
  const { user, earnings_trend, earnings_total, live_matches, my_active_match, upcoming_tournaments, recent_results } = data;

  return (
    <div data-testid="dashboard-page" className="space-y-8">
      <PageHeader
        eyebrow={`Welcome back, @${user.username}`}
        title="Your arena, today."
        description="Live matches, your active duels, and what's coming up."
        actions={
          <>
            <button
              onClick={() => navigate("/app/duel")}
              className="inline-flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] font-medium text-[14px] px-4 py-2.5 rounded-full hover:bg-[var(--bg-soft)]"
              data-testid="dashboard-find-duel"
            >
              Find a duel <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/app/royale")}
              className="inline-flex items-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] font-medium text-[14px] px-4 py-2.5 rounded-full hover:bg-[var(--ink-soft)]"
              data-testid="dashboard-join-royale"
            >
              Join a royale
              <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[var(--ink)]">
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </span>
            </button>
          </>
        }
      />

      {/* Streak hook */}
      {user.win_streak > 0 && (
        <div className="bg-gradient-to-r from-[var(--lime-soft)] to-[var(--purple-soft)] border border-[#B4E04C]/40 rounded-2xl p-4 flex items-center gap-4" data-testid="streak-widget">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface)] grid place-items-center">
            <Flame className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-[var(--ink)]">
              {user.win_streak}-win streak
            </div>
            <div className="text-[12px] text-[var(--ink-soft)]">
              {user.win_streak >= user.best_streak ? "New personal best — keep it going." : `Best ever: ${user.best_streak} wins. Beat it?`}
            </div>
          </div>
        </div>
      )}

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total earnings" value={`$${user.lifetime_earned.toLocaleString()}`} delta={12.4} deltaLabel="vs last month" icon={Wallet} tone="lime" testId="stat-earnings" />
        <StatCard label="Active matches" value={my_active_match ? 1 : 0} icon={Swords} tone="purple" testId="stat-active" />
        <StatCard label="Win rate" value={`${user.win_rate}%`} delta={2.1} deltaLabel="last 10" icon={Target} tone="neutral" testId="stat-winrate" />
        <StatCard label="Global STR rank" value={`#${user.global_rank}`} delta={-3.2} deltaLabel={user.tier} icon={Trophy} tone="dark" testId="stat-rank" />
      </div>

      {/* Chart + active match */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Last 30 days</div>
              <div className="text-base font-semibold text-[var(--ink)]">Earnings trend</div>
            </div>
            <div className="font-mono text-2xl font-semibold text-[var(--ink)]">+${earnings_total.toLocaleString()}</div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earnings_trend} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-earn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B4E04C" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#B4E04C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--ink)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "Geist Mono, monospace", fontSize: 12 }} cursor={{ stroke: "#B4E04C", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" dataKey="earnings" stroke="var(--ink)" strokeWidth={2} fill="url(#g-earn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {my_active_match ? (
          <ActiveMatchCard match={my_active_match} onOpen={() => navigate(`/app/match/${my_active_match.id}`)} />
        ) : (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-start justify-center" data-testid="no-active-match">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Active</div>
            <div className="text-base font-semibold text-[var(--ink)] mb-2">No duel right now</div>
            <p className="text-[13px] text-[var(--body)] mb-4">Join the spawn queue or browse open duels to get into your next match.</p>
            <button onClick={() => navigate("/app/duel")} className="bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-medium px-4 py-2 rounded-full">
              Find a duel
            </button>
          </div>
        )}
      </div>

      {/* Live + tournaments */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6" data-testid="live-matches-widget">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Spectate</div>
              <div className="text-base font-semibold text-[var(--ink)]">Live now</div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
              {live_matches.length} live
            </span>
          </div>
          <div className="divide-y divide-[var(--border-soft)]">
            {live_matches.map((m) => (
              <button key={m.id} onClick={() => navigate(`/app/match/${m.id}`)} className="w-full py-3 flex items-center gap-3 hover:bg-[var(--bg-soft)] -mx-2 px-2 rounded-lg transition-colors text-left" data-testid={`live-match-${m.id}`}>
                {m.custom && <span className="text-[9px] font-bold uppercase tracking-wider bg-[var(--purple-soft)] text-[#7C3AED] px-1.5 py-0.5 rounded">Pro</span>}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[var(--ink)] truncate">
                    @{m.trader_a?.username || "?"} <span className="text-[var(--muted-2)]">vs</span> @{m.trader_b?.username || "?"}
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono">
                    ${(m.account_size / 1000).toFixed(0)}K · {formatTime(m.time_left_seconds)} · {m.spectators} watching
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end shrink-0">
                  <span className={`font-mono text-sm font-semibold ${(m.pnl_a > m.pnl_b ? m.pnl_a : m.pnl_b) >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {Math.max(m.pnl_a, m.pnl_b) >= 0 ? "+" : "−"}${Math.abs(Math.max(m.pnl_a, m.pnl_b)).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[var(--muted-2)] font-mono">leading</span>
                </div>
                <Eye className="w-4 h-4 text-[var(--muted-2)] shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Upcoming</div>
          <div className="text-base font-semibold text-[var(--ink)] mb-4">Tournaments</div>
          <div className="space-y-3">
            {upcoming_tournaments.map((t) => (
              <div key={t.id} className="rounded-xl bg-[var(--bg)] border border-[var(--border-soft)] p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[13px] font-semibold text-[var(--ink)]">{t.name}</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-[var(--inverse)] text-[var(--inverse-fg)] px-2 py-0.5 rounded-full">{t.stage}</span>
                </div>
                <div className="text-xs text-[var(--muted)] font-mono">
                  {t.registered}/{t.capacity} · Starts {t.start_date}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-[#10B981]">${t.prize_pool.toLocaleString()} pool</span>
                  <button onClick={() => navigate("/app/tournament")} className="text-xs font-medium text-[var(--ink)] hover:text-[#7C3AED] inline-flex items-center gap-1">
                    View <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent results */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">History</div>
            <div className="text-base font-semibold text-[var(--ink)]">Recent results</div>
          </div>
          <button onClick={() => navigate("/app/stats")} className="text-xs font-medium text-[var(--ink)] hover:text-[#7C3AED] inline-flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[var(--muted-2)]">
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
              {recent_results.map((r) => (
                <tr key={r.id} className="border-t border-[var(--border-soft)]" data-testid={`result-row-${r.id}`}>
                  <td className="py-3 pr-4 text-[var(--muted)]">{r.date_label}</td>
                  <td className="py-3 pr-4 text-[var(--ink)]">{r.format}</td>
                  <td className="py-3 pr-4 text-[var(--ink-soft)]">{r.opponent}</td>
                  <td className="py-3 pr-4 text-right text-[var(--ink-soft)]">${r.account_size.toLocaleString()}</td>
                  <td className={`py-3 pr-4 text-right font-semibold ${r.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {r.pnl >= 0 ? "+" : "−"}${Math.abs(r.pnl)}
                  </td>
                  <td className="py-3 text-right text-[var(--ink)] font-semibold">{r.prize > 0 ? `$${r.prize}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActiveMatchCard({ match, onOpen }) {
  return (
    <div data-dark className="bg-[#0F0F12] text-white rounded-2xl p-6 relative overflow-hidden" data-testid="active-match-card">
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B4E04C] rounded-full blur-[80px] opacity-30 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Your active duel</div>
            <div className="text-base font-semibold mt-0.5">Duel {match.id}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-medium">
            <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full" /> Live
          </span>
        </div>
        <div className="font-mono text-3xl font-semibold tracking-tight" data-testid="active-match-timer">{formatTime(match.time_left_seconds)}</div>
        <div className="text-xs text-white/50 mt-1">
          vs @{(match.trader_a.username === "TradeFury" ? match.trader_b : match.trader_a).username} · ${(match.account_size / 1000).toFixed(0)}K
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-white/50 font-mono">You</div>
            <div className={`font-mono text-lg font-semibold ${match.pnl_a >= 0 ? "text-[#B4E04C]" : "text-[#FF4C6A]"}`}>
              {match.pnl_a >= 0 ? "+" : "−"}${Math.abs(match.pnl_a).toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-[10px] text-white/50 font-mono">Opponent</div>
            <div className={`font-mono text-lg font-semibold ${match.pnl_b >= 0 ? "text-[#B4E04C]" : "text-[#FF4C6A]"}`}>
              {match.pnl_b >= 0 ? "+" : "−"}${Math.abs(match.pnl_b).toLocaleString()}
            </div>
          </div>
        </div>
        <button onClick={onOpen} className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[13px] py-2.5 rounded-full hover:bg-[var(--surface)]" data-testid="open-active-match">
          Open match <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8" data-testid="dashboard-loading">
      <div className="h-24 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-80 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />
        <div className="h-80 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />
      </div>
    </div>
  );
}
