import { useState } from "react";
import { Swords, Crown, Trophy, HandshakeIcon, Globe, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

const duelTiers = [
  { size: "$5,000", entry: "$60", prize: "$100" },
  { size: "$10,000", entry: "$125", prize: "$200" },
  { size: "$25,000", entry: "$280", prize: "$500" },
  { size: "$50,000", entry: "$550", prize: "$1,000" },
  { size: "$100,000", entry: "$1,100", prize: "$2,000" },
  { size: "$250,000", entry: "$2,800", prize: "$5,000" },
  { size: "$500,000", entry: "$5,500", prize: "$10,000" },
  { size: "$1,000,000", entry: "$11,000", prize: "$20,000" },
];

const multiPrize = [
  { stage: "Round of 16 Qualifiers", share: "25%" },
  { stage: "Quarter-Final Qualifiers", share: "25%" },
  { stage: "Semi-Finalists", share: "20%" },
  { stage: "Finalist (Runner-Up)", share: "15%" },
  { stage: "Champion", share: "15%" },
];

function Section({ index, reverse, icon: Icon, title, tagline, description, bullets, children, image, accent = "#D4AF37", testId }) {
  return (
    <div
      data-testid={testId}
      className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
        reverse ? "lg:[direction:rtl]" : ""
      }`}
    >
      <div className={`lg:col-span-6 ${reverse ? "lg:[direction:ltr]" : ""}`}>
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 grid place-items-center border"
            style={{ borderColor: `${accent}66`, color: accent, background: `${accent}0d` }}
          >
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#94A3B8]">
              Card 0{index}
            </div>
            <div className="font-display font-black uppercase text-2xl tracking-wide text-white">
              {title}
            </div>
          </div>
        </div>
        <p className="font-display italic text-[#D4AF37] text-lg mb-4 tracking-wide">
          "{tagline}"
        </p>
        <p className="text-[#94A3B8] leading-relaxed mb-6">{description}</p>
        <ul className="space-y-3 mb-8">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-[#F0F0F0]">
              <Check className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {children}
      </div>

      <div className={`lg:col-span-6 ${reverse ? "lg:[direction:ltr]" : ""}`}>
        {image}
      </div>
    </div>
  );
}

function StylishImage({ src, label, accent = "#D4AF37" }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-white/10 group">
      <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E1A] via-[#0A0E1A]/40 to-transparent" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.32em] uppercase px-3 py-1.5 border" style={{ borderColor: accent, color: accent, background: "rgba(10,14,26,0.75)" }}>
        {label}
      </div>
    </div>
  );
}

export default function ProductDeepDive() {
  const [email, setEmail] = useState("");

  const submitEmail = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("You're on the list — we'll notify you at launch.");
    setEmail("");
  };

  return (
    <section className="relative py-24 lg:py-32 border-t border-white/5 bg-[#0A0E1A]" data-testid="product-deepdive-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-32">

        {/* 1 — 1v1 DUEL */}
        <Section
          index={1}
          icon={Swords}
          title="1v1 DUEL"
          tagline="You vs them. Equal accounts. Same market. May the best trader win."
          description="The purest test of trading skill. Two traders receive identical accounts — same balance, same market access, same clock. The trader with the highest equity or balance when time expires wins the prize. No luck. No excuses."
          bullets={[
            "Accounts from $5,000 to $1,000,000",
            "Platform Standard Duels open to all traders",
            "Custom Duels (Pro Plan) — set your own rules: leverage, drawdown, timeline",
            "Live opponent P&L visible during the duel",
            "Gold-badged Custom Duels displayed in the broadcast centre",
          ]}
          testId="product-deepdive-duel"
          image={
            <div>
              <div className="border border-[#D4AF37]/20 overflow-x-auto" data-testid="duel-prize-table">
                <table className="w-full font-mono text-sm">
                  <thead>
                    <tr className="bg-[#151E32]">
                      <th className="text-left py-3 px-4 text-[10px] tracking-[0.28em] uppercase text-[#D4AF37]">Account</th>
                      <th className="text-left py-3 px-4 text-[10px] tracking-[0.28em] uppercase text-[#D4AF37]">Entry</th>
                      <th className="text-left py-3 px-4 text-[10px] tracking-[0.28em] uppercase text-[#D4AF37]">Winner Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duelTiers.map((t, i) => (
                      <tr key={t.size} className={`border-b border-white/5 hover:bg-[#D4AF37]/[0.04] ${i % 2 === 0 ? "bg-[#0A0E1A]" : "bg-[#0F1628]"}`}>
                        <td className="py-3 px-4 text-white font-bold">{t.size}</td>
                        <td className="py-3 px-4 text-[#94A3B8]">{t.entry}</td>
                        <td className="py-3 px-4 text-[#00E676]">{t.prize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        >
          <div className="flex flex-wrap gap-3">
            <button data-testid="join-duel-btn" className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-xs px-6 py-3.5 hover:bg-white hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-all">
              Join a Duel <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="inline-flex items-center gap-2 border border-white/20 text-white font-display font-bold uppercase tracking-[0.18em] text-xs px-6 py-3.5 hover:border-[#D4AF37] hover:text-[#D4AF37]">
              View Live Duels
            </button>
          </div>
        </Section>

        {/* 2 — TRADING ROYALE */}
        <Section
          index={2}
          reverse
          icon={Crown}
          title="TRADING ROYALE"
          tagline="Spawn. Trade. Survive. The last balance standing wins."
          description="Multiple traders spawn simultaneously with equal accounts and compete for the highest equity when the timer hits zero. No elimination — just raw performance. The trader with the highest balance or equity at the end takes the entire prize pool."
          bullets={[
            "Lobby sizes: 10, 20, or 50 traders",
            "Standard entry: $20 per participant",
            "Winner takes all — platform rake 15%",
            "Timelines: 5min · 10min · 15min · 30min · 1hr · 4hr · 24hr · 36hr · 48hr · 72hr",
            "All markets: Forex · Crypto · Stocks/Indices · Commodities",
          ]}
          testId="product-deepdive-royale"
          accent="#00C9A7"
          image={
            <StylishImage
              src="https://images.pexels.com/photos/9072320/pexels-photo-9072320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              label="Live · 47 Traders"
              accent="#00C9A7"
            />
          }
        >
          <button className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-xs px-6 py-3.5 hover:bg-white hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-all">
            Join a Royale <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Section>

        {/* 3 — MULTI TRADER */}
        <Section
          index={3}
          icon={Trophy}
          title="MULTI TRADER"
          tagline="Group stages. Knockouts. One champion. Real prizes at every stage."
          description="32 traders. 8 groups of 4. Over multiple weeks, the best traders advance from group stage through Round of 16, Quarter-Finals, Semi-Finals, and the Final. Prize money is distributed across every qualifying round — you don't have to win to earn."
          bullets={[
            "32 traders divided into 8 groups of 4",
            "Top 2 per group advance after Week 1",
            "Weekly knockout rounds until the Final",
            "3rd place match included",
            "Transparent prize pool distribution at every stage",
          ]}
          testId="product-deepdive-multi"
          image={
            <div className="border border-[#D4AF37]/20" data-testid="multi-prize-table">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="bg-[#151E32]">
                    <th className="text-left py-3 px-4 text-[10px] tracking-[0.28em] uppercase text-[#D4AF37]">Stage</th>
                    <th className="text-right py-3 px-4 text-[10px] tracking-[0.28em] uppercase text-[#D4AF37]">Pool Share</th>
                  </tr>
                </thead>
                <tbody>
                  {multiPrize.map((p, i) => (
                    <tr key={p.stage} className={`border-b border-white/5 ${i === multiPrize.length - 1 ? "bg-[#D4AF37]/10" : i % 2 === 0 ? "bg-[#0A0E1A]" : "bg-[#0F1628]"}`}>
                      <td className={`py-4 px-4 ${i === multiPrize.length - 1 ? "text-[#D4AF37] font-bold" : "text-white"}`}>
                        {p.stage}
                      </td>
                      <td className={`py-4 px-4 text-right font-bold ${i === multiPrize.length - 1 ? "text-[#D4AF37]" : "text-[#00E676]"}`}>
                        {p.share}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        >
          <button className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-xs px-6 py-3.5 hover:bg-white hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-all">
            Enter Tournament <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Section>

        {/* 4 — TAG TEAM */}
        <Section
          index={4}
          reverse
          icon={HandshakeIcon}
          title="TAG TEAM TRADING"
          tagline="Build your squad. Trade as one. Collective skill. Shared glory."
          description="Assemble a team of 3 or 5 traders. Each team receives a combined account allocation (same total as the opposing team). How you distribute that capital across your team is your strategic decision. The team with the highest combined equity when time expires wins."
          bullets={[
            "Formats: 3v3 or 5v5",
            "Team accounts from $5,000 to $1,000,000 combined",
            "Capital distribution is your team's choice",
            "Invite teammates by username (permanent — cannot be changed)",
            "Team leader creates the match (Pro Plan required)",
            "Prize split decided by team captain at setup",
          ]}
          testId="product-deepdive-tagteam"
          accent="#FF4C6A"
          image={
            <StylishImage
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwdG91cm5hbWVudCUyMGRhcmt8ZW58MHx8fHwxNzgwNzg0MjQzfDA&ixlib=rb-4.1.0&q=85"
              label="Team Alpha · 3v3"
              accent="#FF4C6A"
            />
          }
        >
          <button className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-xs px-6 py-3.5 hover:bg-white hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-all">
            Create a Team <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Section>

        {/* 5 — COMMUNITY BATTLES */}
        <div data-testid="product-deepdive-community" className="relative">
          <div className="custom-duel-bg border p-10 lg:p-14 grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 grid place-items-center border border-[#D4AF37]/60 text-[#D4AF37] bg-[#D4AF37]/10">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">
                    Card 05
                  </div>
                  <div className="font-display font-black uppercase text-2xl text-white">
                    Community Battles
                  </div>
                </div>
                <span className="ml-4 inline-block px-3 py-1.5 border border-[#D4AF37] text-[#D4AF37] font-mono text-[10px] tracking-[0.28em] uppercase rounded-full">
                  Coming Soon
                </span>
              </div>
              <p className="font-display italic text-[#D4AF37] text-lg mb-4 tracking-wide">
                "Your community. Your colours. Your glory."
              </p>
              <p className="text-[#94A3B8] leading-relaxed">
                Community vs Community trading battles are coming to THE SELECT TRADERS. Entire trading communities will go head-to-head — Discord groups, trading schools, regional clubs — in the ultimate test of collective skill.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={submitEmail} className="space-y-4" data-testid="community-notify-form">
                <label className="block font-mono text-[10px] tracking-[0.32em] uppercase text-[#94A3B8]">
                  Be the first to know when Community Battles launches.
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@email.com"
                    data-testid="community-notify-email"
                    className="flex-1 bg-[#0A0E1A] border border-[#D4AF37]/30 px-4 py-3.5 text-white font-mono text-sm placeholder:text-[#94A3B8]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    data-testid="community-notify-submit"
                    className="bg-[#D4AF37] text-[#0A0E1A] font-display font-bold uppercase tracking-[0.18em] text-xs px-5 hover:bg-white"
                  >
                    Notify Me
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
