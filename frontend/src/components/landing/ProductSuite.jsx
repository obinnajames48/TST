import { ArrowRight } from "lucide-react";

const rows = [
  { product: "1v1 DUEL", format: "Head-to-head", duration: "Customisable", prize: "Up to $20,000", entry: "From $60", live: true },
  { product: "TRADING ROYALE", format: "10/20/50 players", duration: "5min – 72hrs", prize: "Winner takes all", entry: "$20", live: true },
  { product: "MULTI TRADER", format: "32-player tournament", duration: "Weekly stages", prize: "Tiered prize pool", entry: "Varies", live: true },
  { product: "TAG TEAM TRADING", format: "3v3 or 5v5", duration: "Customisable", prize: "Team prize split", entry: "From $60/trader", live: true },
  { product: "COMMUNITY BATTLES", format: "Community vs Community", duration: "Coming Soon", prize: "—", entry: "—", live: false },
];

export default function ProductSuite() {
  return (
    <section
      id="products"
      data-testid="product-suite-section"
      className="relative py-24 lg:py-32 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="font-mono text-[11px] tracking-[0.42em] uppercase text-[#D4AF37]">
              03 · The Arena
            </div>
            <h2 className="font-display font-black uppercase text-4xl lg:text-6xl mt-4 leading-[1] tracking-tight">
              Five Ways <br /> To <span className="text-[#D4AF37]">Compete.</span>
            </h2>
          </div>
          <p className="lg:max-w-md text-[#94A3B8] leading-relaxed">
            One platform. Your skill, your rules. From quick 5-minute royales to multi-week tournament brackets — pick your battlefield.
          </p>
        </div>

        {/* Table */}
        <div className="border border-white/10 overflow-x-auto" data-testid="product-comparison-table">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="bg-[#151E32] border-b border-[#D4AF37]/30">
                <th className="text-left py-4 px-6 text-[11px] tracking-[0.32em] uppercase text-[#D4AF37]">Product</th>
                <th className="text-left py-4 px-6 text-[11px] tracking-[0.32em] uppercase text-[#D4AF37] hidden md:table-cell">Format</th>
                <th className="text-left py-4 px-6 text-[11px] tracking-[0.32em] uppercase text-[#D4AF37] hidden lg:table-cell">Duration</th>
                <th className="text-left py-4 px-6 text-[11px] tracking-[0.32em] uppercase text-[#D4AF37]">Prize</th>
                <th className="text-left py-4 px-6 text-[11px] tracking-[0.32em] uppercase text-[#D4AF37] hidden md:table-cell">Entry</th>
                <th className="text-right py-4 px-6 text-[11px] tracking-[0.32em] uppercase text-[#D4AF37]">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.product}
                  className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
                    i % 2 === 0 ? "bg-[#0A0E1A]" : "bg-[#0F1628]"
                  }`}
                  data-testid={`product-row-${i}`}
                >
                  <td className="py-5 px-6 text-white font-bold tracking-wider">
                    {r.product}
                  </td>
                  <td className="py-5 px-6 text-[#94A3B8] hidden md:table-cell">{r.format}</td>
                  <td className="py-5 px-6 text-[#94A3B8] hidden lg:table-cell">{r.duration}</td>
                  <td className="py-5 px-6 text-white">{r.prize}</td>
                  <td className="py-5 px-6 text-[#00C9A7] hidden md:table-cell">{r.entry}</td>
                  <td className="py-5 px-6 text-right">
                    {r.live ? (
                      <button className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white text-[11px] tracking-[0.28em] uppercase">
                        Join Now <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] tracking-[0.32em] uppercase border border-[#D4AF37]/40 text-[#D4AF37] px-3 py-1.5">
                        Coming Soon
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
