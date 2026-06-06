import { Check, X, Sparkles } from "lucide-react";

const freeFeatures = [
  { ok: true, label: "Watch all live and broadcasted duels" },
  { ok: true, label: "View leaderboards and rankings" },
  { ok: true, label: "Join standard 1v1 Duels (platform-created)" },
  { ok: true, label: "Join Trading Royale lobbies" },
  { ok: true, label: "See open spawn listings waiting for a pair" },
  { ok: true, label: "Buy a standard account & enter spawn centre" },
  { ok: true, label: "Basic profile and stats" },
  { ok: false, label: "Cannot create custom duels or events" },
  { ok: false, label: "Cannot join custom Pro duels" },
];

const proFeatures = [
  "Everything in Free, plus:",
  "Create fully customised 1v1 Duels",
  "Join custom Pro Duels",
  "Create Tag Team matches",
  "Custom leverage (e.g. 1:100)",
  "Daily drawdown limit (0% to 20%)",
  "Max overall drawdown (up to 30%)",
  "Set your own entry fee & timeline",
  "Account size from $5K to $1M",
  "Choose instruments — Forex, Crypto, Stocks, Commodities",
  "Swap / Swap-Free toggle",
  "Raw spread or commission-based",
  "Gold-styled broadcast listing for your duels",
  "Priority in spawn matching queue",
  "Advanced analytics & trade replay",
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-testid="pricing-section"
      className="relative py-24 lg:py-32 border-t border-white/5"
    >
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/8108728/pexels-photo-8108728.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="font-mono text-[11px] tracking-[0.42em] uppercase text-[#D4AF37]">
            05 · Plans
          </div>
          <h2 className="font-display font-black uppercase text-4xl lg:text-5xl mt-4 leading-[1.05]">
            Choose Your <span className="text-[#D4AF37]">Plan.</span>
          </h2>
          <p className="mt-5 text-[#94A3B8]">
            Free to watch. Free to join. Pro to compete your way.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FREE */}
          <div
            data-testid="pricing-free-card"
            className="relative bg-[#0F1628] border border-white/10 p-8 lg:p-10"
          >
            <div className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#94A3B8]">
              Free Tier
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display font-black text-5xl text-white">$0</span>
              <span className="font-mono text-sm text-[#94A3B8]">/ month</span>
            </div>
            <p className="mt-3 text-sm text-[#94A3B8]">
              Watch, learn and compete in standard duels.
            </p>
            <button
              data-testid="pricing-free-cta"
              className="mt-6 w-full border border-white/20 text-white font-display font-bold uppercase tracking-[0.18em] text-xs py-4 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              Start Free
            </button>
            <ul className="mt-8 space-y-3">
              {freeFeatures.map((f) => (
                <li key={f.label} className="flex gap-3 text-[14px]">
                  {f.ok ? (
                    <Check className="w-4 h-4 mt-0.5 text-[#00E676] shrink-0" />
                  ) : (
                    <X className="w-4 h-4 mt-0.5 text-[#FF4C6A] shrink-0" />
                  )}
                  <span className={f.ok ? "text-[#F0F0F0]" : "text-[#94A3B8] line-through"}>
                    {f.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* PRO */}
          <div
            data-testid="pricing-pro-card"
            className="relative bg-[#0F1628] border-2 border-[#D4AF37] p-8 lg:p-10 gold-glow-strong"
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.28em] text-[10px] px-4 py-2">
              <Sparkles className="w-3 h-3" /> Most Popular
            </span>
            <div className="font-mono text-[11px] tracking-[0.32em] uppercase text-[#D4AF37]">
              Pro Plan
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display font-black text-5xl text-white">$49</span>
              <span className="font-mono text-sm text-[#94A3B8]">/ month</span>
            </div>
            <p className="mt-3 text-sm text-[#94A3B8]">
              Create your own arena. Your rules, your stakes.
            </p>
            <button
              data-testid="pricing-pro-cta"
              className="mt-6 w-full bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-xs py-4 hover:bg-white hover:shadow-[0_0_30px_rgba(212,175,55,0.55)] transition-all"
            >
              Go Pro
            </button>
            <p className="mt-3 text-center text-[11px] font-mono tracking-widest uppercase text-[#94A3B8]">
              14-day free trial · Cancel anytime
            </p>
            <ul className="mt-8 space-y-3">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex gap-3 text-[14px]">
                  <Check className="w-4 h-4 mt-0.5 text-[#D4AF37] shrink-0" />
                  <span className={i === 0 ? "text-white font-bold" : "text-[#F0F0F0]"}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
