import { Swords, Crown, Trophy, Users, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    icon: Swords,
    name: "1v1 Duel",
    tagline: "You vs them. Equal accounts. Best trader wins.",
    detail: "Accounts $5K → $1M · Custom rules on Pro",
    accent: "lime",
    badge: null,
    big: true,
    href: "/products/duel",
  },
  {
    icon: Crown,
    name: "Trading Royale",
    tagline: "Last balance standing wins.",
    detail: "10/20/50 traders · $20 entry · Winner takes all",
    accent: "purple",
    badge: "Live",
    href: "/products/royale",
  },
  {
    icon: Trophy,
    name: "Multi Trader",
    tagline: "32 traders. Group stage to final.",
    detail: "Prizes at every stage · Weekly knockouts",
    accent: "lime",
    badge: null,
    href: "/products/tournament",
  },
  {
    icon: Users,
    name: "Tag Team Trading",
    tagline: "3v3 or 5v5. Trade as one.",
    detail: "Combined accounts · Distribute capital your way",
    accent: "purple",
    badge: null,
    href: "/products/tagteam",
  },
  {
    icon: Globe,
    name: "Community Battles",
    tagline: "Community vs Community.",
    detail: "Discord groups, schools, clubs — collective skill.",
    accent: "neutral",
    badge: "Coming soon",
    href: "/products/community",
  },
];

export default function ProductSuite() {
  return (
    <section
      id="products"
      data-testid="product-suite-section"
      className="relative py-24 lg:py-32 border-t border-[#ECECEA]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
              03 — The arena
            </div>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
              Five ways <br />
              to compete.
            </h2>
          </div>
          <p className="lg:max-w-sm text-[15px] text-[#4B5563] leading-relaxed">
            One platform. Your skill, your rules. From a 5-minute royale to a multi-week tournament bracket.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5" data-testid="product-grid">
          {/* Card 1 — big */}
          <ProductCard product={products[0]} className="lg:col-span-4 lg:row-span-2" featured />
          <ProductCard product={products[1]} className="lg:col-span-2" />
          <ProductCard product={products[2]} className="lg:col-span-2" />
          <ProductCard product={products[3]} className="lg:col-span-3" />
          <ProductCard product={products[4]} className="lg:col-span-3" />
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, className = "", featured }) {
  const accentBg = {
    lime: "bg-[#E6F4C2]",
    purple: "bg-[#EDE7FE]",
    neutral: "bg-[#F3F4F6]",
  }[product.accent];

  const accentText = {
    lime: "text-[#0F0F12]",
    purple: "text-[#7C3AED]",
    neutral: "text-[#1F2024]",
  }[product.accent];

  return (
    <Link
      to={product.href}
      data-testid={`product-card-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
      className={`group relative bg-white rounded-3xl border border-[#ECECEA] p-6 lg:p-8 hover:-translate-y-1 hover:shadow-[0_18px_36px_-12px_rgba(15,15,18,0.1)] transition-all flex flex-col cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`w-12 h-12 rounded-2xl grid place-items-center ${accentBg} ${accentText}`}>
          <product.icon className="w-5 h-5" strokeWidth={2} />
        </div>
        {product.badge && (
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
              product.badge === "Coming soon"
                ? "bg-[#F3F4F6] text-[#6B7280]"
                : "bg-[#0F0F12] text-white inline-flex items-center gap-1.5"
            }`}
          >
            {product.badge !== "Coming soon" && (
              <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full pulse-soft" />
            )}
            {product.badge}
          </span>
        )}
      </div>

      <h3 className={`mt-${featured ? "8" : "5"} font-bold tracking-tight text-[#0F0F12] ${featured ? "text-3xl md:text-4xl leading-[1.05]" : "text-xl"}`}>
        {product.name}
      </h3>
      <p className={`mt-2 text-[#4B5563] ${featured ? "text-lg max-w-md" : "text-[15px]"}`}>
        {product.tagline}
      </p>
      <p className="mt-3 text-sm font-mono text-[#6B7280]">{product.detail}</p>

      <div className={`mt-${featured ? "auto pt-8" : "5"} flex items-center gap-1.5 text-sm font-medium text-[#0F0F12] group-hover:gap-2 transition-all`}>
        Explore {product.name}
        <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
      </div>

      {featured && (
        <div className="absolute right-0 bottom-0 w-2/5 h-2/3 pointer-events-none">
          <div className="absolute right-8 bottom-8 bg-[#FAFAF7] border border-[#ECECEA] rounded-2xl p-4 w-56 shadow-[0_12px_24px_-12px_rgba(15,15,18,0.12)]">
            <div className="text-xs font-mono text-[#6B7280]">Top winner today</div>
            <div className="mt-2 text-2xl font-mono font-semibold text-[#10B981]">+$11,420</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-[#6B7280]">
              <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full" /> @PaperHandsNoMore · $250K duel
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
