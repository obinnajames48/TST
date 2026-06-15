import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const TIERS = [
  { name: "Rookie", revShare: "10%", accent: "bg-[#F3F4F6] text-[#1F2024]" },
  { name: "Pro", revShare: "15%", accent: "bg-[#E6F4C2] text-[#0F0F12]" },
  { name: "Elite", revShare: "20%", accent: "bg-[#EDE7FE] text-[#5B21B6]" },
  { name: "Legend", revShare: "25%", accent: "bg-[#0F0F12] text-[#B4E04C]" },
];

/**
 * Slim landing-page Affiliate teaser. Full program details live on /products/affiliate.
 */
export default function Affiliate() {
  return (
    <section id="affiliate" data-testid="affiliate-section" className="relative bg-[#FAFAF7] py-20 lg:py-24 border-t border-[#ECECEA]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="bg-white border border-[#ECECEA] rounded-3xl p-7 lg:p-10 grid lg:grid-cols-12 gap-8 items-center" data-testid="affiliate-teaser">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-[#FAFAF7] border border-[#ECECEA] rounded-full px-3 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#1F2024]">Affiliate program</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
              Bring your traders. <span className="text-[#A78BFA]">Earn for life.</span>
            </h2>
            <p className="mt-4 text-[14.5px] text-[#4B5563] max-w-xl leading-relaxed">
              Four tiers, 10–25% rev-share, paid monthly into your wallet. No caps, no clawbacks, no opaque payout walls.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TIERS.map((t) => (
                <div key={t.name} data-testid={`affiliate-tier-chip-${t.name.toLowerCase()}`} className={`inline-flex items-center gap-2 rounded-full pl-2.5 pr-3.5 py-1.5 ${t.accent}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider opacity-70">{t.name}</span>
                  <span className="font-mono font-semibold text-[12.5px]">{t.revShare}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 lg:items-end">
            <Link
              to="/products/affiliate"
              data-testid="affiliate-cta-learn"
              className="inline-flex items-center gap-2 bg-[#0F0F12] text-white text-[14px] font-semibold px-6 py-3.5 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-0.5 w-fit"
            >
              See full program
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link to="/app/affiliate" data-testid="affiliate-cta-link" className="text-[12.5px] text-[#6B7280] hover:text-[#0F0F12] underline-offset-2 hover:underline">Get your referral link →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
