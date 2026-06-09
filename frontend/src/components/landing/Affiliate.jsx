import { Sparkles, Trophy, Users, TrendingUp, Crown, ArrowUpRight, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TIERS = [
  {
    name: "Rookie",
    minRefs: 0,
    minVolume: "$0",
    revShare: 10,
    bonus: 5,
    accent: "bg-[#F3F4F6] text-[#1F2024]",
    icon: Users,
    description: "Start earning from your first referral.",
  },
  {
    name: "Pro",
    minRefs: 5,
    minVolume: "$5K",
    revShare: 15,
    bonus: 10,
    accent: "bg-[#E6F4C2] text-[#0F0F12]",
    icon: TrendingUp,
    description: "5 active refs · $5K traded volume.",
  },
  {
    name: "Elite",
    minRefs: 20,
    minVolume: "$25K",
    revShare: 20,
    bonus: 15,
    accent: "bg-[#EDE7FE] text-[#5B21B6]",
    icon: Trophy,
    description: "20 active refs · $25K traded volume.",
  },
  {
    name: "Legend",
    minRefs: 50,
    minVolume: "$100K",
    revShare: 25,
    bonus: 25,
    accent: "bg-[#0F0F12] text-[#B4E04C]",
    icon: Crown,
    description: "50 active refs · $100K traded volume. Top 1% earners.",
  },
];

export default function Affiliate() {
  const navigate = useNavigate();
  return (
    <section id="affiliate" data-testid="affiliate-section" className="relative bg-[#FAFAF7] py-24 lg:py-32 border-t border-[#ECECEA]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-white border border-[#ECECEA] rounded-full px-3 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#1F2024]">Affiliate program</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F0F12] leading-[1.02]">
              Bring your traders. <br />
              <span className="text-[#A78BFA]">Earn on every duel they enter.</span>
            </h2>
            <p className="mt-6 text-[15px] lg:text-[16px] text-[#4B5563] max-w-xl leading-relaxed">
              The more your refs trade, the more you earn — paid monthly into your wallet. Four tiers, transparent rev-share, no opaque payout walls.
            </p>
          </div>
          <div className="lg:col-span-5 bg-[#0F0F12] text-white rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#A78BFA] rounded-full blur-[100px] opacity-30 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-15 pointer-events-none" />
            <div className="relative">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">How payouts work</div>
              <div className="mt-4 space-y-4">
                {[
                  { k: "01", t: "Share your link", d: "Drop your unique referral link to your audience or community." },
                  { k: "02", t: "Earn rev-share", d: "10–25% of every entry fee your refs pay — for life." },
                  { k: "03", t: "Withdraw monthly", d: "Auto-paid into your wallet on the 1st of each month." },
                ].map((s) => (
                  <div key={s.k} className="flex items-start gap-3">
                    <div className="text-[#B4E04C] font-mono text-[11px] mt-1 w-6">{s.k}</div>
                    <div>
                      <div className="text-[14px] font-semibold">{s.t}</div>
                      <div className="text-[12.5px] text-white/60 mt-0.5 leading-snug">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((t, i) => {
            const Icon = t.icon;
            const isLegend = t.name === "Legend";
            return (
              <div
                key={t.name}
                data-testid={`affiliate-tier-${t.name.toLowerCase()}`}
                className={`relative rounded-2xl border p-6 transition-all hover:-translate-y-1 ${isLegend ? "bg-[#0F0F12] border-[#0F0F12] text-white" : "bg-white border-[#ECECEA]"}`}
              >
                {isLegend && (
                  <div className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider bg-[#B4E04C] text-[#0F0F12] px-2.5 py-1 rounded-full">
                    Top tier
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl grid place-items-center mb-4 ${t.accent}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className={`text-[11px] font-mono uppercase tracking-[0.22em] ${isLegend ? "text-white/40" : "text-[#9CA3AF]"}`}>Tier {i + 1}</div>
                <div className={`mt-1 text-[22px] font-bold tracking-tight ${isLegend ? "text-white" : "text-[#0F0F12]"}`}>{t.name}</div>
                <div className={`mt-3 text-[13px] leading-snug ${isLegend ? "text-white/60" : "text-[#6B7280]"}`}>{t.description}</div>
                <div className={`mt-5 pt-5 border-t ${isLegend ? "border-white/10" : "border-[#F1F1EF]"} space-y-2.5`}>
                  <Row k="Rev-share" v={`${t.revShare}%`} isLegend={isLegend} accent />
                  <Row k="Signup bonus" v={`$${t.bonus}`} isLegend={isLegend} />
                  <Row k="Active refs" v={`${t.minRefs}+`} isLegend={isLegend} />
                  <Row k="Volume" v={t.minVolume} isLegend={isLegend} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white border border-[#ECECEA] rounded-3xl p-7 lg:p-9 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4C2] grid place-items-center"><Link2 className="w-5 h-5 text-[#0F0F12]" /></div>
            <div>
              <div className="text-[18px] font-semibold text-[#0F0F12]">Ready to earn?</div>
              <div className="text-[13px] text-[#6B7280] mt-1 max-w-md">Sign up in 60 seconds, grab your referral link from your dashboard, and start sharing.</div>
            </div>
          </div>
          <button
            data-testid="affiliate-cta"
            onClick={() => navigate("/app/affiliate")}
            className="inline-flex items-center gap-2 bg-[#0F0F12] text-white text-[14px] font-semibold px-6 py-3.5 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-0.5 self-start lg:self-auto"
          >
            Get your affiliate link
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v, isLegend, accent }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className={isLegend ? "text-white/50" : "text-[#6B7280]"}>{k}</span>
      <span className={`font-mono font-semibold ${accent ? (isLegend ? "text-[#B4E04C]" : "text-[#0F0F12]") : (isLegend ? "text-white" : "text-[#0F0F12]")}`}>{v}</span>
    </div>
  );
}
