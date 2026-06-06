import { Quote } from "lucide-react";

export default function Mission() {
  return (
    <section
      data-testid="mission-section"
      className="relative py-24 lg:py-32 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] tracking-[0.42em] uppercase text-[#D4AF37]">
              01 · Manifesto
            </div>
            <h2 className="font-display font-black uppercase text-4xl lg:text-5xl mt-4 leading-[1.05]">
              A Stadium <br /> For <span className="text-[#D4AF37]">Skill.</span>
            </h2>
          </div>

          <div className="lg:col-span-7 grid md:grid-cols-2 gap-8">
            <div className="border-l-2 border-[#D4AF37] pl-6">
              <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#94A3B8] mb-3">
                Our Mission
              </div>
              <p className="text-[#F0F0F0] leading-relaxed">
                To give every trader in the world a fair, competitive arena to prove their skill — and earn from it. We believe trading skill deserves more than a brokerage account.{" "}
                <span className="text-[#D4AF37]">It deserves a stadium.</span>
              </p>
            </div>
            <div className="border-l-2 border-[#00C9A7] pl-6">
              <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#94A3B8] mb-3">
                Our Vision
              </div>
              <p className="text-[#F0F0F0] leading-relaxed">
                To become the global standard for competitive trading — where the world's best traders are known by name, ranked by performance, and{" "}
                <span className="text-[#00C9A7]">rewarded for skill</span> the way esport athletes are rewarded for theirs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 relative max-w-4xl mx-auto">
          <Quote className="absolute -top-6 -left-2 w-12 h-12 text-[#D4AF37]/30" />
          <blockquote className="font-display text-2xl lg:text-4xl text-white leading-tight uppercase tracking-tight pl-8 border-l-2 border-[#D4AF37]/40">
            "What if the world's best traders didn't just beat the market —{" "}
            <span className="text-[#D4AF37]">they beat each other?</span>"
          </blockquote>
        </div>
      </div>
    </section>
  );
}
