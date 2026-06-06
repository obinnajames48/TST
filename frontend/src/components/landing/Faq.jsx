import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Is this real trading or simulated?",
    a: "Competitions use real market prices delivered to platform-allocated demo/simulated accounts. You are trading against real market conditions — but the capital is provided by the platform, not by you. Your only financial exposure is the entry fee.",
  },
  {
    q: "How do I get paid my winnings?",
    a: "Winnings are credited to your THE SELECT TRADERS wallet upon match completion and verified result. You can withdraw to your linked bank account or crypto wallet. Minimum withdrawal is $10.",
  },
  {
    q: "What markets can I trade?",
    a: "Forex (major, minor, exotic pairs) · Cryptocurrency (BTC, ETH and top altcoins) · Stocks & Indices (S&P 500, NASDAQ, FTSE, DAX, Nikkei and more) · Commodities (Gold, Silver, Crude Oil, Natural Gas).",
  },
  {
    q: "What happens if my opponent disconnects during a duel?",
    a: "If a technical disconnection is confirmed on our end, a grace period of 2 minutes is given. If the trader does not reconnect, the remaining trader is declared the winner by default. Disputed results can be escalated to support within 24 hours.",
  },
  {
    q: "Can I change my username?",
    a: "No. Your username is your permanent trading identity on the platform. Choose carefully when you sign up — it cannot be changed under any circumstances.",
  },
  {
    q: "What is a Custom Duel?",
    a: "A Custom Duel is a 1v1 competition created by a Pro Plan member with fully personalised rules: leverage, drawdown limits, account size, timeline, instruments, and entry fee. Custom Duels are displayed with a gold background in the Duel Broadcast Centre, distinguishing them from Standard Duels.",
  },
  {
    q: "What is the spawn centre?",
    a: "When you purchase a standard account for a 1v1 Duel, you are placed in the Spawn Centre — a live matchmaking queue. If another trader purchases the same account size, you are automatically paired. A 5-minute pairing countdown begins. Once paired, both traders must accept. Upon acceptance, your trading accounts are activated and a countdown begins before trading opens.",
  },
  {
    q: "Is THE SELECT TRADERS regulated?",
    a: "THE SELECT TRADERS operates as a skill-based competitive platform. We work with regulated liquidity providers for market data and execution infrastructure. Depending on your jurisdiction, different terms may apply. See our Terms & Conditions for full details.",
  },
  {
    q: "What is the Free plan, exactly?",
    a: "The Free plan lets you watch all broadcasted duels, see live leaderboards, join standard (platform-created) duels and Royale lobbies, and participate in the spawn centre for standard duels. You cannot create custom duels or events — that requires a Pro Plan.",
  },
  {
    q: "How does Trading Royale work?",
    a: "A Royale lobby fills up with 10, 20, or 50 traders (depending on the session). All pay a $20 entry. All receive equal accounts and begin trading simultaneously. The trader with the highest equity or balance when the timer ends wins the entire prize pool (less the platform's 15% rake).",
  },
];

export default function Faq() {
  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="relative py-24 lg:py-32 border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="mb-12 text-center">
          <div className="font-mono text-[11px] tracking-[0.42em] uppercase text-[#D4AF37]">
            06 · Answers
          </div>
          <h2 className="font-display font-black uppercase text-4xl lg:text-5xl mt-4 leading-[1.05]">
            Frequently Asked <br /> <span className="text-[#D4AF37]">Questions.</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              data-testid={`faq-item-${i}`}
              className="bg-[#0F1628] border border-white/8 hover:border-[#D4AF37]/40 transition-colors px-6 [&_*]:!no-underline rounded-none"
            >
              <AccordionTrigger className="font-display uppercase tracking-wide text-left text-white hover:text-[#D4AF37] py-5 text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#94A3B8] leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
