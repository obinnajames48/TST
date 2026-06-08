import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Eye, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
  XAxis,
  Tooltip,
} from "recharts";

const seed = Array.from({ length: 40 }, (_, i) => ({ i, a: 100, b: 100 }));

const trades = [
  { side: "buy", instrument: "EUR/USD", size: "0.5 lot", entry: 1.0821, exit: 1.0856, pnl: 175 },
  { side: "sell", instrument: "BTC/USD", size: "0.1", entry: 68420, exit: 67980, pnl: 44 },
  { side: "buy", instrument: "XAU/USD", size: "1.2 lot", entry: 2031.4, exit: 2042.8, pnl: 1368 },
  { side: "sell", instrument: "USOIL", size: "5 lot", entry: 76.42, exit: 76.85, pnl: -215 },
  { side: "buy", instrument: "GBP/JPY", size: "0.3 lot", entry: 189.42, exit: 189.78, pnl: 108 },
];

export default function Match() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const [data, setData] = useState(seed.map((d, i) => ({ ...d, a: 100 + Math.sin(i / 3) * 14, b: 100 + Math.cos(i / 4) * 11 })));
  const [pnlA, setPnlA] = useState(2847);
  const [pnlB, setPnlB] = useState(-1600);
  const [time, setTime] = useState({ h: 3, m: 42, s: 11 });

  useEffect(() => {
    const t = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        next.push({
          i: last.i + 1,
          a: Math.max(70, last.a + (Math.random() - 0.42) * 5),
          b: Math.max(70, last.b + (Math.random() - 0.55) * 5),
        });
        return next;
      });
      setPnlA((p) => Math.round(p + (Math.random() - 0.3) * 90));
      setPnlB((p) => Math.round(p + (Math.random() - 0.55) * 90));
      setTime((t) => {
        let s = t.s - 1;
        let m = t.m;
        let h = t.h;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        return { h: Math.max(0, h), m, s };
      });
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const timeStr = `${String(time.h).padStart(2, "0")}:${String(time.m).padStart(2, "0")}:${String(time.s).padStart(2, "0")}`;
  const lowTime = time.h === 0 && time.m < 5;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF7] overflow-y-auto" data-testid="match-page">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 grid place-items-center rounded-full bg-white border border-[#ECECEA] hover:bg-[#F5F5F2]" data-testid="match-close">
              <X className="w-4 h-4" />
            </button>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Duel #{matchId}</div>
              <div className="text-[15px] font-semibold text-[#0F0F12]">$100,000 account</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Time left</div>
              <div className={`font-mono text-2xl md:text-3xl font-semibold tracking-tight ${lowTime ? "text-[#EF4444] animate-pulse" : "text-[#0F0F12]"}`} data-testid="match-timer">
                {timeStr}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#0F0F12] text-white px-3 py-1.5 rounded-full text-[11px] font-medium">
              <Eye className="w-3 h-3" /> 247
            </span>
          </div>
        </div>

        {/* Two trader columns */}
        <div className="grid lg:grid-cols-2 gap-4 mb-5">
          <TraderColumn name="TradeFury" pnl={pnlA} you balance={100000 + pnlA} openTrades={3} closedTrades={12} data={data} dataKey="a" color="#10B981" />
          <TraderColumn name="GoldHands" pnl={pnlB} balance={100000 + pnlB} openTrades={2} closedTrades={9} data={data} dataKey="b" color="#A78BFA" />
        </div>

        {/* Combined chart */}
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 mb-5" data-testid="match-chart">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-semibold text-[#0F0F12]">Equity over time</div>
            <div className="flex items-center gap-4 text-[12px] font-mono">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-[#10B981] rounded-full" /> @TradeFury</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-[#A78BFA] rounded-full" /> @GoldHands</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-a" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-b" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="i" hide />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0F0F12", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="a" stroke="#10B981" strokeWidth={2} fill="url(#g-a)" isAnimationActive={false} />
                <Area type="monotone" dataKey="b" stroke="#A78BFA" strokeWidth={2} fill="url(#g-b)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trades feed */}
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#0F0F12]" />
            <div className="text-base font-semibold text-[#0F0F12]">Recent trades</div>
          </div>
          <table className="w-full text-[13px] min-w-[640px]">
            <thead className="text-[#9CA3AF] text-[11px]">
              <tr>
                <th className="text-left font-medium py-2 pr-4">Side</th>
                <th className="text-left font-medium py-2 pr-4">Instrument</th>
                <th className="text-left font-medium py-2 pr-4">Size</th>
                <th className="text-right font-medium py-2 pr-4">Entry</th>
                <th className="text-right font-medium py-2 pr-4">Exit</th>
                <th className="text-right font-medium py-2">P&amp;L</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {trades.map((t, i) => (
                <tr key={i} className="border-t border-[#F1F1EF]">
                  <td className="py-3 pr-4">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.side === "buy" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>
                      {t.side}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-[#0F0F12] font-semibold">{t.instrument}</td>
                  <td className="py-3 pr-4 text-[#1F2024]">{t.size}</td>
                  <td className="py-3 pr-4 text-right">{t.entry}</td>
                  <td className="py-3 pr-4 text-right">{t.exit}</td>
                  <td className={`py-3 text-right font-semibold ${t.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {t.pnl >= 0 ? "+" : "−"}${Math.abs(t.pnl)}
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

function TraderColumn({ name, pnl, you, balance, openTrades, closedTrades, data, dataKey, color }) {
  return (
    <div className={`rounded-2xl p-5 border ${you ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-white border-[#ECECEA]"}`} data-testid={`trader-col-${name.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full grid place-items-center font-bold ${you ? "bg-[#B4E04C] text-[#0F0F12]" : "bg-[#0F0F12] text-white"}`}>
            {name[0]}
          </div>
          <div>
            <div className="text-[14px] font-semibold">@{name}</div>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${you ? "text-white/40" : "text-[#9CA3AF]"}`}>{you ? "You" : "Opponent"}</div>
          </div>
        </div>
        <div className={`text-right`}>
          <div className={`text-[10px] font-mono uppercase tracking-wider ${you ? "text-white/40" : "text-[#9CA3AF]"}`}>Equity</div>
          <div className="font-mono text-base font-semibold tracking-tight">${balance.toLocaleString()}</div>
        </div>
      </div>

      <div className={`font-mono text-4xl font-semibold tracking-tight flex items-center gap-2 ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
        {pnl >= 0 ? <ArrowUpRight className="w-7 h-7" strokeWidth={2.5} /> : <ArrowDownRight className="w-7 h-7" strokeWidth={2.5} />}
        {pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}
      </div>
      <div className={`mt-1 text-[12px] font-mono ${you ? "text-white/40" : "text-[#6B7280]"}`}>P&amp;L · since open</div>

      <div className="mt-4 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#g-${dataKey})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`mt-4 grid grid-cols-2 gap-2 text-[12px] font-mono`}>
        <div className={`rounded-lg ${you ? "bg-white/5" : "bg-[#FAFAF7] border border-[#F1F1EF]"} px-3 py-2`}>
          <div className={`text-[10px] uppercase tracking-wider ${you ? "text-white/40" : "text-[#9CA3AF]"}`}>Open</div>
          <div className="font-semibold">{openTrades}</div>
        </div>
        <div className={`rounded-lg ${you ? "bg-white/5" : "bg-[#FAFAF7] border border-[#F1F1EF]"} px-3 py-2`}>
          <div className={`text-[10px] uppercase tracking-wider ${you ? "text-white/40" : "text-[#9CA3AF]"}`}>Closed</div>
          <div className="font-semibold">{closedTrades}</div>
        </div>
      </div>
    </div>
  );
}
