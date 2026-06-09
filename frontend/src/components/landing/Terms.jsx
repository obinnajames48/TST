import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const previewPoints = [
  "Entry fees are non-refundable once a match begins",
  "Usernames are permanent and non-transferable",
  "First withdrawal requires identity verification",
  "Automated trading systems (EAs/bots) are prohibited",
];

export default function Terms() {
  const navigate = useNavigate();
  return (
    <section
      data-testid="terms-section"
      className="relative py-24 lg:py-32 border-t border-[#ECECEA] bg-[#F5F5F2]"
    >
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#ECECEA] p-8 lg:p-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#EDE7FE] grid place-items-center text-[#7C3AED] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
                07 — Legal
              </div>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight text-[#0F0F12]">
                Fair rules. Clearly written.
              </h2>
              <p className="mt-2 text-[14px] text-[#6B7280] max-w-lg">
                We keep the rulebook short, transparent and trader-first. Read the highlights below or open the full Terms &amp; Conditions.
              </p>
            </div>
          </div>

          <ul className="grid md:grid-cols-2 gap-x-10 gap-y-3 mb-8">
            {previewPoints.map((p, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-[#1F2024]">
                <span className="font-mono text-[#A78BFA] shrink-0 font-semibold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/terms")}
            data-testid="terms-fullpage-link"
            className="inline-flex items-center gap-2 bg-[#0F0F12] text-white text-[14px] font-semibold px-6 py-3.5 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-0.5"
          >
            Read full Terms &amp; Conditions
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
