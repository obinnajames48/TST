import { ShieldCheck, ArrowRight } from "lucide-react";

const points = [
  "Entry fees are non-refundable once a match has begun",
  "Username is permanent and cannot be transferred",
  "Winnings are subject to identity verification before first withdrawal",
  "Automated trading systems (EAs/bots) are prohibited",
  "Traders must be 18 years or older to participate",
  "Platform results are final and verified via trade logs",
  "THE SELECT TRADERS is not a broker, investment advisor, or financial institution",
  "Trading involves risk — past performance is not indicative of future results",
];

export default function Terms() {
  return (
    <section
      data-testid="terms-section"
      className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0F1628]/30"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="border border-[#D4AF37]/30 bg-[#0A0E1A]/70 backdrop-blur p-8 lg:p-12">
          <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 grid place-items-center border border-[#D4AF37]/60 text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.42em] uppercase text-[#D4AF37]">
                  07 · Legal
                </div>
                <h2 className="font-display font-black uppercase text-2xl lg:text-3xl text-white mt-1">
                  Terms & Conditions Summary
                </h2>
              </div>
            </div>
            <a
              href="/terms"
              data-testid="terms-fullpage-link"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white font-mono text-[11px] tracking-[0.28em] uppercase"
            >
              Read Full T&Cs <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
            {points.map((p, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[#94A3B8]">
                <span className="font-mono text-[#D4AF37] shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
