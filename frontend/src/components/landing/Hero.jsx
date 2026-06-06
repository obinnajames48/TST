import { useEffect, useState } from "react";
import { ArrowUpRight, Play, TrendingUp, Users, Globe2 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  YAxis,
} from "recharts";

const seed = Array.from({ length: 40 }, (_, i) => ({
  i,
  a: 100 + Math.sin(i / 3) * 20 + Math.random() * 10,
  b: 100 + Math.cos(i / 4) * 18 + Math.random() * 8,
}));

export default function Hero() {
  const [data, setData] = useState(seed);

  useEffect(() => {
    const t = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1];
        next.push({
          i: last.i + 1,
          a: Math.max(50, last.a + (Math.random() - 0.45) * 6),
          b: Math.max(50, last.b + (Math.random() - 0.55) * 6),
        });
        return next;
      });
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen pt-32 pb-20 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 hero-glow" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-screen"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwyfHxkYXJrJTIwYWJzdHJhY3QlMjBmaW5hbmNpYWwlMjBjaGFydHxlbnwwfHx8fDE3ODA3ODQyNDN8MA&ixlib=rb-4.1.0&q=85')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left: copy */}
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#00C9A7] pulse-dot" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C9A7]" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.42em] text-[#00C9A7] uppercase">
              Now Live · The Sport Of Trading
            </span>
          </div>

          <h1
            className="font-display font-black tracking-tight text-white text-[44px] sm:text-6xl lg:text-7xl leading-[0.95] uppercase"
            data-testid="hero-headline"
          >
            Ain't you tired of trading
            <span className="block mt-2">
              against the{" "}
              <span className="text-[#FF4C6A] line-through decoration-[3px] decoration-[#FF4C6A]/70">
                broker
              </span>
              ?
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg lg:text-xl text-[#94A3B8] leading-relaxed font-light">
            Trade against <span className="text-white font-medium">real people</span>. Win real money. Welcome to the sport of trading.
          </p>
          <p className="mt-4 max-w-2xl text-[15px] text-[#94A3B8]/80 leading-relaxed">
            THE SELECT TRADERS gives traders a third option. No more fighting the market alone. No more prop firm gatekeeping. Now you compete peer-to-peer — equal accounts, same market, same clock. The best trader wins.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-cta-primary"
              className="group inline-flex items-center gap-3 bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-sm px-7 py-4 hover:bg-white hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all"
            >
              Start Competing
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button
              data-testid="hero-cta-secondary"
              onClick={() =>
                document.getElementById("ticker")?.scrollIntoView({ behavior: "smooth" })
              }
              className="group inline-flex items-center gap-3 border border-white/20 text-white font-display font-bold uppercase tracking-[0.18em] text-sm px-7 py-4 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              <Play className="w-4 h-4" /> Watch a Live Duel
            </button>
          </div>

          {/* Stat pills */}
          <div className="mt-14 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl">
            {[
              { icon: Users, value: "12,400+", label: "Traders" },
              { icon: TrendingUp, value: "$2.1M+", label: "Paid Out" },
              { icon: Globe2, value: "47", label: "Countries" },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-white/10 bg-[#0F1628]/60 backdrop-blur-sm p-4 flex items-center gap-3"
                data-testid={`hero-stat-${s.label.toLowerCase()}`}
              >
                <s.icon className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div className="leading-tight">
                  <div className="font-mono text-lg font-bold text-white">{s.value}</div>
                  <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#94A3B8]">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live duel preview */}
        <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="relative border border-[#D4AF37]/30 bg-[#0F1628]/70 backdrop-blur-xl p-6 gold-glow">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-[#0A0E1A] border border-[#FF4C6A]/50">
              <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#FF4C6A] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#FF4C6A] rounded-full pulse-dot" />
                Live · Duel #4781
              </span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div>
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#94A3B8]">
                  Account
                </div>
                <div className="font-mono text-xl font-bold text-white">$100,000</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#94A3B8]">
                  Time Left
                </div>
                <div className="font-mono text-xl font-bold text-[#D4AF37]">03:42:11</div>
              </div>
            </div>

            <div className="my-6 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00E676" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#00E676" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4C6A" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#FF4C6A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke="#1E2A45" />
                  <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <Area
                    type="monotone"
                    dataKey="a"
                    stroke="#00E676"
                    strokeWidth={2}
                    fill="url(#ga)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="b"
                    stroke="#FF4C6A"
                    strokeWidth={2}
                    fill="url(#gb)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 p-4">
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#94A3B8]">
                  @TradeFury
                </div>
                <div className="mt-2 font-mono text-2xl font-bold text-[#00E676]">
                  +$2,847
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#94A3B8]">Equity $102,847</div>
              </div>
              <div className="border border-white/10 p-4">
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#94A3B8]">
                  @GoldHands
                </div>
                <div className="mt-2 font-mono text-2xl font-bold text-[#FF4C6A]">
                  −$1,600
                </div>
                <div className="mt-1 font-mono text-[11px] text-[#94A3B8]">Equity $98,400</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#94A3B8] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#00C9A7] rounded-full pulse-dot" />
                247 spectating
              </span>
              <button className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#D4AF37] hover:text-white">
                Spectate →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
