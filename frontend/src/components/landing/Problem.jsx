import { Wallet, ShieldAlert, Gamepad2, ArrowRight, Sparkles } from "lucide-react";

const cards = [
  {
    icon: Wallet,
    tag: "Option 01 · Traditional",
    title: "Brokerage trading",
    body: "You fund your own account, take your own risk and pay spreads/commissions to the house. The broker profits on volume — and statistically, on your losses. Every win is your own to claim; every loss is yours alone.",
    tone: "loss",
    badge: null,
  },
  {
    icon: ShieldAlert,
    tag: "Option 02 · Traditional",
    title: "Prop trading firms",
    body: "Pay a fee to attempt a multi-phase challenge with strict drawdown rules and time limits. 80%+ of traders fail the evaluation. Even after passing, payout disputes, rule resets and re-attempt fees stack the math against you.",
    tone: "neutral",
    badge: null,
  },
  {
    icon: Gamepad2,
    tag: "Option 03 · The innovation",
    title: "Gamified peer-to-peer trading",
    body: "Enter a duel, royale or tournament with traders just like you on identical accounts. Same instrument set, same clock, same rules — pure skill decides the prize. No house edge, no evaluation gates, no broker conflict.",
    tone: "purple",
    badge: "New",
  },
];

export default function Problem() {
  return (
    <section
      data-testid="problem-section"
      className="relative py-24 lg:py-32 bg-[#F5F5F2] border-t border-[#ECECEA]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
            02 — The innovation
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
            Traders have always had <br />
            <span className="text-[#6B7280]">just two options.</span>
          </h2>
          <p className="mt-4 text-[15px] text-[#4B5563] max-w-xl leading-relaxed">
            Both come with a house standing between you and the money. We built a third path.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={c.title}
              data-testid={`innovation-card-${i + 1}`}
              className={`group relative rounded-3xl border p-7 hover:-translate-y-1 hover:shadow-[0_18px_36px_-12px_rgba(15,15,18,0.1)] transition-all ${c.tone === "purple" ? "bg-[#0F0F12] border-[#0F0F12] text-white" : "bg-white border-[#ECECEA]"}`}
            >
              {c.badge && (
                <div className="absolute -top-3 left-7 text-[10px] font-bold uppercase tracking-wider bg-[#B4E04C] text-[#0F0F12] px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {c.badge}
                </div>
              )}
              <div
                className={`w-11 h-11 rounded-xl grid place-items-center mb-5 ${
                  c.tone === "loss"
                    ? "bg-[#FEE2E2] text-[#DC2626]"
                    : c.tone === "purple"
                    ? "bg-[#B4E04C] text-[#0F0F12]"
                    : "bg-[#F3F4F6] text-[#1F2024]"
                }`}
              >
                <c.icon className="w-5 h-5" strokeWidth={2} />
              </div>
              <div className={`text-xs font-mono uppercase tracking-[0.18em] ${c.tone === "purple" ? "text-white/50" : "text-[#6B7280]"}`}>
                {c.tag}
              </div>
              <h3 className={`mt-2 text-xl font-semibold ${c.tone === "purple" ? "text-white" : "text-[#0F0F12]"}`}>{c.title}</h3>
              <p className={`mt-3 text-[15px] leading-relaxed ${c.tone === "purple" ? "text-white/70" : "text-[#4B5563]"}`}>{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 bg-[#0F0F12] text-white rounded-full pl-2 pr-5 py-2">
            <span className="inline-flex items-center gap-1.5 bg-[#B4E04C] text-[#0F0F12] rounded-full px-3 py-1 text-xs font-semibold">
              <ArrowRight className="w-3 h-3" strokeWidth={3} />
              Third path
            </span>
            <span className="text-sm font-medium">The option that wasn't there. Until now.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
