import { Sparkles, Users, TrendingUp, Trophy, Crown } from "lucide-react";
import ProductPageLayout from "@/components/products/ProductPageLayout";

const tiers = [
  { stage: "Rookie", share: "10% rev-share · $5 bonus", amount: "0 refs · $0 volume", featured: false },
  { stage: "Pro", share: "15% rev-share · $10 bonus", amount: "5 refs · $5K volume", featured: false },
  { stage: "Elite", share: "20% rev-share · $15 bonus", amount: "20 refs · $25K volume", featured: false },
  { stage: "Legend", share: "25% rev-share · $25 bonus", amount: "50 refs · $100K volume", featured: true },
];

export default function ProductAffiliate() {
  return (
    <ProductPageLayout
      eyebrow="Program · Affiliate"
      name="Affiliate Program"
      tagline="Bring your traders. Earn on every duel they enter — for life."
      description="A four-tier rev-share program with no opaque payout walls. The more your refs trade, the more you earn — paid monthly into your wallet. No caps, no resets, no clawbacks."
      icon={Sparkles}
      accent="purple"
      stats={[
        { label: "Tiers", value: "4" },
        { label: "Max rev-share", value: "25%" },
        { label: "Payout cycle", value: "Monthly" },
        { label: "Cap", value: "None" },
      ]}
      model={{
        title: "Real rev-share. Paid forever. Auto-deposited.",
        paragraphs: [
          "When a trader signs up with your referral link, they're linked to you permanently. Every entry fee they ever pay generates a rev-share for you — anywhere from 10% to 25% depending on your tier.",
          "Earnings drop into your wallet on the 1st of each month. No claim flow, no broker-style hidden conditions, no minimum thresholds. If you earned, you get paid.",
        ],
        bullets: [
          "Lifetime attribution — once linked, your refs are yours forever",
          "Monthly auto-payouts on the 1st",
          "$5–$25 signup bonus per ref (tier-dependent)",
          "Tier upgrades unlock automatically when targets are hit",
          "Full transparency — every ref's volume visible in your dashboard",
        ],
      }}
      rules={[
        { k: "Eligibility", v: "Any verified account · KYC required" },
        { k: "Attribution", v: "First-click, permanent, lifetime" },
        { k: "Self-referral", v: "Not allowed (IP + KYC detection)" },
        { k: "Rev-share basis", v: "% of entry fees paid by your refs" },
        { k: "Signup bonus", v: "Paid on ref's first match completion" },
        { k: "Payout frequency", v: "Monthly · 1st of the month" },
        { k: "Payout floor", v: "No minimum — paid as earned" },
        { k: "Clawback policy", v: "Only on confirmed fraud · 90-day window" },
        { k: "Tier downgrade", v: "Never — once earned, tier is permanent" },
        { k: "Tax reporting", v: "Annual 1099 / equivalent provided" },
      ]}
      prize={{
        title: "Four tiers. Permanent upgrades. No clawback.",
        subtitle: "Hit a tier's targets once and you keep that rev-share rate forever — even if your ref activity dips later. The Legend tier is reserved for the top 1% of affiliates.",
        headers: ["Tier", "Earnings", "Unlock"],
        rows: tiers,
      }}
      cta={{
        primaryLabel: "Get your affiliate link",
        primaryHref: "/app/affiliate",
        secondaryLabel: "View dashboard",
        secondaryHref: "/app/affiliate",
      }}
      extra={
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { i: Users, k: "01", t: "Share your link", d: "Drop your unique referral link to your audience, your Discord, your community." },
            { i: TrendingUp, k: "02", t: "Earn rev-share", d: "10–25% of every entry fee your refs pay — for the life of their account." },
            { i: Trophy, k: "03", t: "Withdraw monthly", d: "Auto-paid into your wallet on the 1st of each month. No claim flow." },
          ].map((s, i) => {
            const Icon = s.i;
            return (
              <div key={s.k} className="bg-white border border-[#ECECEA] rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE7FE] grid place-items-center"><Icon className="w-4.5 h-4.5 text-[#7C3AED]" /></div>
                  <span className="font-mono text-[11px] text-[#6B7280]">{s.k}</span>
                </div>
                <div className="text-[16px] font-semibold text-[#0F0F12]">{s.t}</div>
                <p className="mt-2 text-[13px] text-[#4B5563] leading-relaxed">{s.d}</p>
              </div>
            );
          })}
        </div>
      }
    />
  );
}
