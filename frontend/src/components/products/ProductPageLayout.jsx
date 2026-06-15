import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

/**
 * Shared layout for dedicated product pages: Nav, hero, model, rules, prize, CTA, Footer.
 * Each product page provides the content config; layout handles structure + styling.
 */
export default function ProductPageLayout({
  eyebrow,
  name,
  tagline,
  description,
  icon: Icon,
  accent = "lime", // lime | purple | dark
  stats = [], // [{ label, value, sub }]
  model, // { title, paragraphs: [], bullets: [] }
  rules = [], // [{ k, v }] rules of engagement key/value rows
  prize, // { title, subtitle, rows: [{ stage, share, amount }] }
  cta, // { primaryLabel, primaryHref, secondaryLabel, secondaryHref }
  badge, // optional small badge text (e.g. "Coming soon")
  extra, // optional extra section node
}) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const tone = {
    lime: { bg: "bg-[#E6F4C2]", text: "text-[#0F0F12]", chip: "bg-[#0F0F12] text-[#B4E04C]" },
    purple: { bg: "bg-[#EDE7FE]", text: "text-[#7C3AED]", chip: "bg-[#7C3AED] text-white" },
    dark: { bg: "bg-[#0F0F12]", text: "text-[#B4E04C]", chip: "bg-[#B4E04C] text-[#0F0F12]" },
  }[accent];

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#0F0F12] overflow-x-hidden" data-testid={`product-page-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <Nav />
      {/* Hero */}
      <section className="relative pt-20 lg:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <Link to="/" data-testid="back-to-landing" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280] hover:text-[#0F0F12] mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to landing
          </Link>
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-12 h-12 rounded-2xl grid place-items-center ${tone.bg} ${tone.text}`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#6B7280]">{eyebrow}</span>
                {badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#6B7280] px-2.5 py-1 rounded-full">{badge}</span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#0F0F12] leading-[0.98]">{name}</h1>
              <p className="mt-5 text-xl md:text-2xl text-[#0F0F12] font-medium">{tagline}</p>
              <p className="mt-5 text-[15px] md:text-[16px] text-[#4B5563] leading-relaxed max-w-2xl">{description}</p>
              {cta && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={cta.primaryHref} data-testid="product-cta-primary" className="group inline-flex items-center gap-2 bg-[#0F0F12] text-white font-medium text-[14px] px-5 py-3 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-0.5">
                    {cta.primaryLabel}
                    <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[#0F0F12]">
                      <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                    </span>
                  </a>
                  {cta.secondaryLabel && (
                    <a href={cta.secondaryHref} data-testid="product-cta-secondary" className="inline-flex items-center gap-2 bg-white border border-[#ECECEA] text-[#0F0F12] font-medium text-[14px] px-5 py-3 rounded-full hover:bg-[#F5F5F2]">
                      {cta.secondaryLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="lg:col-span-4">
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3" data-testid="product-hero-stats">
                  {stats.map((s, i) => (
                    <div key={i} className={`rounded-2xl p-4 ${i % 2 === 0 ? "bg-white border border-[#ECECEA]" : tone.bg}`}>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">{s.label}</div>
                      <div className="mt-1 font-mono text-2xl font-semibold text-[#0F0F12]">{s.value}</div>
                      {s.sub && <div className="mt-0.5 text-[11px] text-[#6B7280]">{s.sub}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Model */}
      {model && (
        <section className="py-16 lg:py-20 border-t border-[#ECECEA] bg-white" data-testid="product-model">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6B7280]">The model</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">{model.title}</h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-[15px] md:text-[16px] text-[#1F2024] leading-relaxed">
              {model.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
              {model.bullets?.length > 0 && (
                <ul className="space-y-3 mt-2">
                  {model.bullets.map((b, i) => (
                    <li key={i} className="flex gap-3 text-[15px]">
                      <span className={`w-5 h-5 rounded-full grid place-items-center shrink-0 mt-0.5 ${tone.bg}`}>
                        <Check className={`w-3 h-3 ${tone.text}`} strokeWidth={3} />
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Rules of engagement */}
      {rules.length > 0 && (
        <section className="py-16 lg:py-20 border-t border-[#ECECEA] bg-[#FAFAF7]" data-testid="product-rules">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6B7280]">Rules of engagement</div>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">How the match runs.</h2>
              </div>
              <p className="max-w-md text-[14px] text-[#4B5563] leading-relaxed">
                Same rules for everyone. No hidden filters, no broker-side games. Trade with the same data you'd use on your own desk.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3" data-testid="rules-grid">
              {rules.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#ECECEA] px-5 py-4 flex items-center justify-between gap-4">
                  <div className="text-[14px] text-[#1F2024] font-medium">{r.k}</div>
                  <div className="text-[13.5px] font-mono text-[#0F0F12] font-semibold text-right">{r.v}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prize structure */}
      {prize && (
        <section className="py-16 lg:py-20 border-t border-[#ECECEA] bg-white" data-testid="product-prize">
          <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6B7280]">Prize structure</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">{prize.title}</h2>
              {prize.subtitle && <p className="mt-4 text-[15px] text-[#4B5563] leading-relaxed max-w-md">{prize.subtitle}</p>}
            </div>
            <div className="lg:col-span-7">
              <div className="bg-[#FAFAF7] rounded-3xl border border-[#ECECEA] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#6B7280]">
                      <th className="text-left font-medium py-3.5 px-6 text-[11.5px] uppercase tracking-wider">{prize.headers?.[0] || "Stage"}</th>
                      <th className="text-left font-medium py-3.5 px-6 text-[11.5px] uppercase tracking-wider">{prize.headers?.[1] || "Share"}</th>
                      <th className="text-right font-medium py-3.5 px-6 text-[11.5px] uppercase tracking-wider">{prize.headers?.[2] || "Payout"}</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {prize.rows.map((r, i) => {
                      const featured = r.featured;
                      return (
                        <tr key={i} className={`border-t border-[#F1F1EF] ${featured ? "bg-[#E6F4C2]/40" : ""}`}>
                          <td className={`py-3.5 px-6 ${featured ? "font-semibold text-[#0F0F12]" : "text-[#1F2024]"}`}>{r.stage}</td>
                          <td className={`py-3.5 px-6 ${featured ? "font-semibold text-[#0F0F12]" : "text-[#1F2024]"}`}>{r.share}</td>
                          <td className={`py-3.5 px-6 text-right font-semibold ${featured ? "text-[#0F0F12]" : "text-[#10B981]"}`}>{r.amount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {extra && (
        <section className="py-16 lg:py-20 border-t border-[#ECECEA] bg-[#FAFAF7]" data-testid="product-extra">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">{extra}</div>
        </section>
      )}

      {/* Bottom CTA strip */}
      <section className="py-16 lg:py-24 border-t border-[#ECECEA] bg-[#0F0F12] text-white" data-testid="product-bottom-cta">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 text-center">
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">Ready to put it on the line?</h3>
          <p className="mt-4 text-[15px] md:text-[16px] text-white/60 max-w-lg mx-auto">No challenges. No prop firm rules. Pay the entry, beat your opponent, take the prize.</p>
          {cta && (
            <a href={cta.primaryHref} className="mt-8 inline-flex items-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[14px] px-6 py-3.5 rounded-full hover:bg-white">
              {cta.primaryLabel}
              <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
