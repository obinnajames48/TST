import { Trophy, Crown, Users, Calendar, Coins, Layers, Award, Medal } from "lucide-react";
import { motion } from "framer-motion";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { SectionHeader, NeonBeam, BentoRuleCard, StatStrip, BackToLanding, BottomCTA, StatPyramid } from "@/components/products/ProductPrimitives";
import { LeaderboardRace } from "@/components/products/ProductInfographics";

const PRIZE_TIERS = [
  { label: "Champion", share: "15%", amount: "$7.5K", featured: true },
  { label: "Runner-up", share: "15%", amount: "$7.5K" },
  { label: "Semi-finalists", share: "20% ÷ 4", amount: "$2.5K each" },
  { label: "QF qualifiers", share: "25% ÷ 8", amount: "$1.5K each" },
  { label: "R16 qualifiers", share: "25% ÷ 16", amount: "$780 each" },
];

export default function ProductMulti() {
  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="product-page-multi">
      <ProductNav />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#B4E04C] rounded-full blur-[160px] opacity-15" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <BackToLanding />

          <div className="mt-10 text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-[#B4E04C] grid place-items-center">
                <Trophy className="w-5 h-5 text-[#0F0F12]" strokeWidth={2.5} />
              </div>
              <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/40">Product · 03</div>
            </div>
            <motion.h1 data-testid="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-[clamp(48px,9vw,128px)] font-black tracking-[-0.04em] leading-[0.88] text-white">
              32 ENTER. <br /> ONE LIFTS <span className="text-[#B4E04C]">THE CUP.</span>
            </motion.h1>
            <p className="mt-7 text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed">
              No head-to-head matches in the group stage. All 4 trade at once — top 2 by equity advance. Knockouts are sealed 1v1s, equity at the buzzer decides. <span className="text-[#B4E04C] font-semibold">Every stage pays.</span>
            </p>
            <div className="mt-9 flex flex-wrap gap-3 justify-center">
              <NeonBeam href="/app/tournament" dataTestid="product-cta-primary">Enter the tournament</NeonBeam>
              <a href="/app/tournament" data-testid="product-cta-secondary" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-medium text-[14px] px-5 py-3.5 rounded-full hover:bg-white/10">My journey</a>
            </div>
          </div>

          {/* Podium graphic */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Podium />
          </div>

          <div className="mt-14">
            <StatStrip items={[
              { label: "Field", value: "32" },
              { label: "Groups", value: "8 × 4" },
              { label: "Stages", value: "5", sub: "Group → Final" },
              { label: "Pool paid out", value: "100%" },
            ]} />
          </div>
        </div>
      </section>

      {/* THE MODEL */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeader kicker="THE MODEL" title="Equity is the only judge." sub="No win-draw-loss records. No head-to-head matches in the group stage. All 4 traders in a group trade simultaneously for one fixed timeline — the top 2 by equity at the buzzer advance. Knockouts work the same way, just 1v1." />
            <ul className="mt-7 space-y-3 text-[14.5px] text-white/70">
              {[
                "32 traders split into 8 groups of 4",
                "Group stage: all 4 trade simultaneously · top 2 by equity advance",
                "Knockouts (R16/QF/SF/Final): 1v1 · highest equity wins",
                "Every stage runs 1 trading day or 5 trading days",
                "Every qualifying stage earns prize money",
              ].map((b, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 mt-2 bg-[#B4E04C] shrink-0 rounded-full shadow-[0_0_8px_#B4E04C]" />
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <LeaderboardRace />
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionHeader kicker="RULES OF ENGAGEMENT" title="One metric. Equity at the buzzer." />
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="rules-grid">
            <BentoRuleCard icon={Users} title="Field" value="32" sub="Per tournament" />
            <BentoRuleCard icon={Layers} title="Groups" value="8 × 4" sub="Top 2 by equity advance" />
            <BentoRuleCard icon={Coins} title="Account" value="$50K – $100K" sub="By tournament tier" />
            <BentoRuleCard icon={Calendar} title="Stage length" value="1 or 5 trading days" sub="Set per tournament" />
            <BentoRuleCard icon={Trophy} title="Group stage" value="All 4 simultaneous" sub="No head-to-head — equity ranks all 4" />
            <BentoRuleCard icon={Trophy} title="R16 / QF / SF" value="1v1 sealed match" sub="Equity at buzzer · winner advances" />
            <BentoRuleCard icon={Award} title="Tiebreaker" value="Max equity reached" sub="If finishing equity exactly ties" />
            <BentoRuleCard icon={Crown} title="Final" value="1v1 sealed match" sub="Champion + Runner-up payouts" />
          </div>
        </div>
      </section>

      {/* PRIZE PYRAMID */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <SectionHeader kicker="PRIZE STRUCTURE" title="Money at every stage. Not just the podium." sub="$50,000 prize pool example. Every trader who advances earns. The Champion gets the headline number, but R16 qualifiers still walk away paid." />
          </div>
          <div className="lg:col-span-7" data-testid="prize-structure">
            <StatPyramid tiers={PRIZE_TIERS} />
          </div>
        </div>
      </section>

      <BottomCTA headline="Are you bracket-ready?" sub="5 weeks. 32 traders. One champion. Five stages of payouts. Don't watch — enter." primaryLabel="Enter the tournament" primaryHref="/app/tournament" accent="lime" />
      <Footer />
    </main>
  );
}

function Podium() {
  const cols = [
    { rank: 2, h: "h-28 md:h-36", label: "Runner-up", money: "$7,500", color: "bg-[#A78BFA]" },
    { rank: 1, h: "h-40 md:h-52", label: "Champion", money: "$7,500", color: "bg-[#B4E04C]", crown: true },
    { rank: 3, h: "h-20 md:h-28", label: "Semi-finalist", money: "$2,500", color: "bg-white/15" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2 items-end" data-testid="hero-podium">
      {cols.map((c, i) => (
        <motion.div key={c.rank} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }} className="flex flex-col items-center">
          {c.crown && <Crown className="w-7 h-7 text-[#B4E04C] mb-2 drop-shadow-[0_0_12px_#B4E04C]" />}
          <div className={`w-full ${c.h} ${c.color} rounded-t-2xl flex flex-col justify-end items-center pb-4 border-x border-t border-white/10 ${c.crown ? "shadow-[0_0_40px_-6px_#B4E04C]" : ""}`}>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${c.rank === 1 ? "text-[#0F0F12]/60" : "text-white/55"}`}>#{c.rank}</div>
            <div className={`font-black text-2xl md:text-3xl mt-1 ${c.rank === 1 ? "text-[#0F0F12]" : "text-white"}`}>{c.money}</div>
            <div className={`text-[11px] mt-1 ${c.rank === 1 ? "text-[#0F0F12]/60" : "text-white/55"}`}>{c.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
