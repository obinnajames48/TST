import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Play, ArrowUpRight as Up, ArrowDownRight as Down } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from "recharts";

const ICON_PURPLE = "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/bo6j2sct_Asset%2029%404x-8.png";

const seedA = Array.from({ length: 32 }, (_, i) => ({ i, v: 100 + Math.sin(i / 3) * 14 + Math.random() * 5 }));
const seedB = Array.from({ length: 32 }, (_, i) => ({ i, v: 100 + Math.cos(i / 4) * 11 - Math.random() * 6 }));

export default function Hero() {
  const navigate = useNavigate();
  const [a, setA] = useState(seedA);
  const [b, setB] = useState(seedB);
  const [pnlA, setPnlA] = useState(2847);
  const [pnlB, setPnlB] = useState(-1600);

  useEffect(() => {
    const t = setInterval(() => {
      setA((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        next.push({ i: last.i + 1, v: Math.max(70, last.v + (Math.random() - 0.42) * 5) });
        return next;
      });
      setB((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        next.push({ i: last.i + 1, v: Math.max(70, last.v + (Math.random() - 0.55) * 5) });
        return next;
      });
      setPnlA((p) => Math.round(p + (Math.random() - 0.3) * 80));
      setPnlB((p) => Math.round(p + (Math.random() - 0.55) * 80));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden"
    >
      {/* soft background */}
      <div className="absolute inset-0 bg-soft-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/3 translate-x-1/4 bg-[#EDE7FE] rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 -translate-x-1/3 bg-[#E6F4C2] rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left — copy */}
        <div className="lg:col-span-6 animate-fade-up">
          <a
            href="#products"
            className="inline-flex items-center gap-2 bg-white border border-[#ECECEA] rounded-full pl-1 pr-4 py-1 text-sm font-medium text-[#1F2024] hover:bg-[#F5F5F2] transition-colors"
            data-testid="hero-eyebrow"
          >
            <span className="inline-flex items-center gap-1.5 bg-[#0F0F12] text-white rounded-full px-2.5 py-1 text-xs">
              <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full pulse-soft" />
              Live
            </span>
            <span>1,287 traders competing right now</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#6B7280]" />
          </a>

          <h1
            data-testid="hero-headline"
            className="mt-6 text-[44px] sm:text-6xl lg:text-[72px] leading-[1.02] tracking-[-0.02em] font-bold text-[#0F0F12]"
          >
            Trade against{" "}
            <span className="relative inline-block">
              <span className="relative z-10">real people.</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-[#B4E04C] -z-0 rounded-sm" />
            </span>
            <br />
            Not the broker.
          </h1>

          <p className="mt-5 text-[15px] font-medium text-[#A78BFA] tracking-tight" data-testid="hero-tagline">
            The peer-to-peer arena for world-class traders. Trade smart. Compete harder.
          </p>

          <p className="mt-4 max-w-xl text-lg text-[#4B5563] leading-relaxed" data-testid="hero-subhead">
            The Select Traders is a peer-to-peer world-class trading platform. Start trading the market against real people you can actually win against —{" "}
            <span className="font-semibold text-[#0F0F12]">the house is the trap.</span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              data-testid="hero-cta-primary"
              onClick={() => navigate("/app")}
              className="group inline-flex items-center gap-2 bg-[#0F0F12] text-white font-medium text-[15px] px-6 py-3.5 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-0.5"
            >
              Start competing
              <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[#0F0F12]">
                <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
              </span>
            </button>
            <button
              data-testid="hero-cta-secondary"
              onClick={() => navigate("/app/duel")}
              className="group inline-flex items-center gap-2 bg-white border border-[#ECECEA] text-[#0F0F12] font-medium text-[15px] px-6 py-3.5 rounded-full hover:bg-[#F5F5F2] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Watch a live duel
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-2">
              {["F", "K", "M", "S"].map((c, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-full ring-2 ring-[#FAFAF7] grid place-items-center text-xs font-bold text-white"
                  style={{ background: ["#A78BFA", "#0F0F12", "#B4E04C", "#1F2024"][i], color: i === 2 ? "#0F0F12" : "#fff" }}
                >
                  {c}
                </span>
              ))}
            </div>
            <div>
              <div className="font-mono text-sm font-medium text-[#0F0F12]">
                12,400+ traders
              </div>
              <div className="text-xs text-[#6B7280]">$2.1M paid out · 47 countries</div>
            </div>
          </div>
        </div>

        {/* Right — Duel preview UI mockup */}
        <div
          className="lg:col-span-6 animate-fade-up"
          style={{ animationDelay: "150ms" }}
          data-testid="hero-mockup"
        >
          <div className="relative">
            {/* purple accent card behind */}
            <div className="absolute -top-6 -right-4 w-44 h-44 bg-[#A78BFA] rounded-3xl rotate-6 opacity-20" />
            <div className="absolute -bottom-6 -left-4 w-32 h-32 bg-[#B4E04C] rounded-3xl -rotate-6 opacity-30" />

            <div className="relative bg-white border border-[#ECECEA] rounded-3xl p-5 lg:p-6 shadow-[0_24px_64px_-24px_rgba(15,15,18,0.18)]">
              {/* header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F5F2] grid place-items-center overflow-hidden">
                    <img src={ICON_PURPLE} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-[#6B7280]">Duel · #4781</div>
                    <div className="text-sm font-semibold text-[#0F0F12]">$100,000 Account</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-[#6B7280]">Time left</div>
                  <div className="font-mono text-base font-semibold text-[#0F0F12]">03:42:11</div>
                </div>
              </div>

              {/* chart */}
              <div className="mt-5 h-44 rounded-2xl bg-[#FAFAF7] border border-[#F1F1EF] p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={a.map((d, i) => ({ i, a: d.v, b: b[i]?.v }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#A78BFA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={["dataMin - 3", "dataMax + 3"]} />
                    <Area type="monotone" dataKey="a" stroke="#10B981" strokeWidth={2.2} fill="url(#ga)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="b" stroke="#A78BFA" strokeWidth={2.2} fill="url(#gb)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* traders */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#ECECEA] p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#10B981] rounded-full" />
                    <span className="text-[13px] font-medium text-[#0F0F12]">@TradeFury</span>
                  </div>
                  <div className="mt-2 font-mono text-2xl font-semibold text-[#10B981] tracking-tight flex items-center gap-1">
                    <Up className="w-4 h-4" strokeWidth={2.5} />
                    +${pnlA.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs font-mono text-[#6B7280]">
                    Equity ${(100000 + pnlA).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#ECECEA] p-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#A78BFA] rounded-full" />
                    <span className="text-[13px] font-medium text-[#0F0F12]">@GoldHands</span>
                  </div>
                  <div className={`mt-2 font-mono text-2xl font-semibold tracking-tight flex items-center gap-1 ${pnlB >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {pnlB >= 0 ? <Up className="w-4 h-4" strokeWidth={2.5} /> : <Down className="w-4 h-4" strokeWidth={2.5} />}
                    {pnlB >= 0 ? "+" : "−"}${Math.abs(pnlB).toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs font-mono text-[#6B7280]">
                    Equity ${(100000 + pnlB).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#F1F1EF] pt-4">
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full pulse-soft" />
                  <span className="font-mono">247 spectating</span>
                </div>
                <button className="inline-flex items-center gap-1 text-xs font-medium text-[#0F0F12] hover:gap-2 transition-all">
                  Spectate <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* floating stat */}
            <div className="hidden md:flex absolute -left-6 bottom-10 items-center gap-3 bg-white border border-[#ECECEA] rounded-2xl px-4 py-3 shadow-[0_12px_24px_-8px_rgba(15,15,18,0.12)]">
              <div className="w-9 h-9 rounded-xl bg-[#E6F4C2] grid place-items-center">
                <Up className="w-4 h-4 text-[#0F0F12]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xs text-[#6B7280] font-medium">Avg. winner ROI</div>
                <div className="font-mono text-base font-semibold text-[#0F0F12]">+18.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
