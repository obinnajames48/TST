import { UserPlus, Target, CreditCard, Zap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    body: "Sign up free in under 2 minutes. Choose your username carefully — it's permanent and it's your trading identity.",
  },
  {
    icon: Target,
    title: "Choose Your Arena",
    body: "Browse open duels, active Royale lobbies, upcoming tournaments, or team battles. Join or create based on your plan.",
  },
  {
    icon: CreditCard,
    title: "Buy Your Account & Get Paired",
    body: "Select your account size, pay your entry fee. The platform pairs you automatically. Once both traders confirm, your live trading account is unlocked.",
  },
  {
    icon: Zap,
    title: "Trade & Win",
    body: "Compete in real time. Watch your opponent's P&L. Best trader wins the prize. Results are final, verified, and paid out instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how"
      data-testid="how-it-works-section"
      className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0F1628]/30"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <div className="font-mono text-[11px] tracking-[0.42em] uppercase text-[#D4AF37]">
            04 · The Flow
          </div>
          <h2 className="font-display font-black uppercase text-4xl lg:text-5xl mt-4 leading-[1.05]">
            How <span className="text-[#D4AF37]">It Works.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-3">
            {steps.map((s, i) => (
              <div
                key={s.title}
                data-testid={`step-${i + 1}`}
                className="relative bg-[#0A0E1A] border border-white/10 p-6 hover:border-[#D4AF37]/60 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 grid place-items-center bg-[#D4AF37] text-[#0A0E1A] gold-glow">
                    <s.icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <span className="font-display font-black text-5xl text-white/5 leading-none">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display font-bold uppercase text-lg tracking-wide text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
