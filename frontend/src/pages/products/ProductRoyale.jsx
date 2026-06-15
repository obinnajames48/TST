import { Crown, Zap, Skull } from "lucide-react";
import ProductPageLayout from "@/components/products/ProductPageLayout";

const lobbies = [
  { stage: "10-Player", share: "$170 pool", amount: "$170 winner", featured: false },
  { stage: "20-Player", share: "$340 pool", amount: "$340 winner", featured: false },
  { stage: "50-Player", share: "$850 pool", amount: "$850 winner", featured: true },
];

export default function ProductRoyale() {
  return (
    <ProductPageLayout
      eyebrow="Product · 02"
      name="Trading Royale"
      tagline="Spawn. Trade. Survive. Last balance standing wins."
      description="Multiple traders spawn into the same lobby with identical accounts. A two-phase elimination engine drives the action: the first half is a free-for-all, the second half eliminates the lowest-equity trader at fixed intervals until one winner remains."
      icon={Crown}
      accent="purple"
      stats={[
        { label: "Lobby sizes", value: "10 / 20 / 50" },
        { label: "Entry fee", value: "$20" },
        { label: "Timelines", value: "5m – 72h" },
        { label: "Winner share", value: "85% of pool" },
      ]}
      model={{
        title: "Two phases. One survivor.",
        paragraphs: [
          "All traders spawn at the same instant with the same starting capital. There are no second chances — the moment your equity is the lowest in the lobby during the elimination phase, you're out.",
          "The split is deliberate. The first half rewards aggressive plays and risk-taking; the second half rewards risk management and ranking discipline. Pure traders who can survive both phases win the pool.",
        ],
        bullets: [
          "Phase 1 — first half of the timeline: all traders fighting, no eliminations",
          "Phase 2 — second half: eliminations at fixed intervals (rounded to nearest 30s)",
          "Lowest equity at each interval is removed from the lobby",
          "Continues until a single trader remains — winner takes the pool",
        ],
      }}
      rules={[
        { k: "Format", v: "Simultaneous spawn, free-for-all" },
        { k: "Account size", v: "$50,000 standard (identical for all)" },
        { k: "Entry fee", v: "$20 per participant" },
        { k: "Pool composition", v: "Lobby size × $20 (e.g. 50 × $20 = $1,000)" },
        { k: "Platform rake", v: "15% (winner receives 85%)" },
        { k: "Phase 1 length", v: "Half the lobby timeline" },
        { k: "Phase 2 length", v: "Half the lobby timeline" },
        { k: "Elimination interval", v: "Phase 2 length ÷ (lobby − 1), rounded to 30s" },
        { k: "Elimination rule", v: "Lowest equity at each interval is OUT" },
        { k: "Settlement", v: "Auto on last-trader-standing" },
      ]}
      prize={{
        title: "Winner takes 85%. Platform takes 15%.",
        subtitle: "Same simple math at every lobby size. Larger lobbies = bigger pools.",
        headers: ["Lobby size", "Total pool", "Winner payout"],
        rows: lobbies,
      }}
      cta={{
        primaryLabel: "Join a royale",
        primaryHref: "/app/royale",
        secondaryLabel: "Browse lobbies",
        secondaryHref: "/app/royale",
      }}
      extra={
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#ECECEA] p-6">
            <Zap className="w-5 h-5 text-[#7C3AED]" />
            <div className="mt-4 text-[20px] font-semibold text-[#0F0F12]">Phase 1 — All fighting</div>
            <p className="mt-2 text-[13.5px] text-[#4B5563] leading-relaxed">For the entire first half of the timeline, every trader is in. Maximum freedom, maximum aggression. Build a lead, take risks, position yourself.</p>
          </div>
          <div className="bg-[#0F0F12] text-white rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#EF4444] rounded-full blur-[60px] opacity-30 pointer-events-none" />
            <Skull className="w-5 h-5 text-[#EF4444] relative" />
            <div className="mt-4 text-[20px] font-semibold relative">Phase 2 — Eliminations</div>
            <p className="mt-2 text-[13.5px] text-white/60 leading-relaxed relative">The second half: every interval, the trader with the lowest equity is OUT. Intervals = (half ÷ players-1) rounded to 30s. Stay above the bottom or you're done.</p>
          </div>
        </div>
      }
    />
  );
}
