import { Building2, ShieldOff, Trophy } from "lucide-react";

const cards = [
  {
    icon: Building2,
    title: "Trading Your Own Capital",
    body: "Brokers profit when you lose. Your money is always at risk. The system isn't built for you.",
    accent: "#FF4C6A",
  },
  {
    icon: ShieldOff,
    title: "Prop Trading Firms",
    body: "80%+ failure rates. Punishing rules. Payout disputes. Designed for re-attempt fees, not your success.",
    accent: "#D4AF37",
  },
  {
    icon: Trophy,
    title: "No Competitive Path",
    body: "Until now, there was nowhere to compete trader vs trader — to prove skill and earn from it directly.",
    accent: "#00C9A7",
  },
];

export default function Problem() {
  return (
    <section
      data-testid="problem-section"
      className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0F1628]/30"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl">
          <div className="font-mono text-[11px] tracking-[0.42em] uppercase text-[#D4AF37]">
            02 · The Problem
          </div>
          <h2 className="font-display font-black uppercase text-4xl lg:text-5xl mt-4 leading-[1.05]">
            Traders Have Always <br /> Had <span className="text-[#FF4C6A]">Two Bad Options.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {cards.map((c, i) => (
            <div
              key={c.title}
              data-testid={`problem-card-${i + 1}`}
              className="group relative bg-[#0F1628] border border-white/8 p-8 hover:border-white/30 transition-all hover:-translate-y-1"
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, ${c.accent}, transparent)` }}
              />
              <div
                className="w-12 h-12 grid place-items-center border mb-6"
                style={{ borderColor: `${c.accent}55`, color: c.accent }}
              >
                <c.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#94A3B8]">
                Option 0{i + 1}
              </div>
              <h3 className="font-display font-bold uppercase text-xl mt-2 text-white tracking-wide">
                {c.title}
              </h3>
              <p className="mt-4 text-[#94A3B8] leading-relaxed text-[15px]">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block">
            <div className="font-mono text-[10px] tracking-[0.42em] uppercase text-[#D4AF37] mb-4">
              ↓ The Third Path
            </div>
            <div className="font-display font-black uppercase text-3xl lg:text-5xl leading-tight">
              We built{" "}
              <span className="text-[#D4AF37] relative inline-block">
                the third path
                <span className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#D4AF37]" />
              </span>
              .
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
