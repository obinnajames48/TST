import { Swords } from "lucide-react";
import ProductPageLayout from "@/components/products/ProductPageLayout";

const tiers = [
  { stage: "$5,000", share: "$60 entry", amount: "$100", featured: false },
  { stage: "$10,000", share: "$125 entry", amount: "$200", featured: false },
  { stage: "$25,000", share: "$280 entry", amount: "$500", featured: false },
  { stage: "$50,000", share: "$550 entry", amount: "$1,000", featured: true },
  { stage: "$100,000", share: "$1,100 entry", amount: "$2,000", featured: false },
  { stage: "$250,000", share: "$2,800 entry", amount: "$5,000", featured: false },
  { stage: "$500,000", share: "$5,500 entry", amount: "$10,000", featured: false },
  { stage: "$1,000,000", share: "$11,000 entry", amount: "$20,000", featured: true },
];

export default function ProductDuel() {
  return (
    <ProductPageLayout
      eyebrow="Product · 01"
      name="1v1 Duel"
      tagline="You vs them. Equal accounts. Best trader wins."
      description="The purest test of trading skill. Two traders receive identical accounts — same balance, same market access, same clock. Whoever finishes with the highest equity when time expires takes the prize."
      icon={Swords}
      accent="lime"
      stats={[
        { label: "Accounts", value: "$5K – $1M" },
        { label: "Prize multiplier", value: "~1.8x" },
        { label: "Timelines", value: "4h / 24h" },
        { label: "Platform rake", value: "10%" },
      ]}
      model={{
        title: "Equal accounts. Same clock. Skill alone decides.",
        paragraphs: [
          "Both traders spawn a brokerage account at the chosen size with identical leverage, identical instrument access, and an identical countdown. The match starts the moment both confirm login.",
          "There are no negotiated edges, no broker tricks, no challenge-style phases. The trader with the highest equity when the clock hits zero wins. The loser's entry funds the prize.",
        ],
        bullets: [
          "Standard Duels: open to all traders — match by tier",
          "Pro Duels: Pro members set custom rules (instruments, max-DD, timeline)",
          "Live opponent P&L visible throughout the match",
          "Match results immutable, recorded with audit hash on settlement",
        ],
      }}
      rules={[
        { k: "Format", v: "1 vs 1, simultaneous" },
        { k: "Account allocation", v: "Identical on both sides" },
        { k: "Leverage", v: "1:50 (standard) · custom on Pro" },
        { k: "Daily drawdown", v: "15% · custom on Pro" },
        { k: "Max drawdown", v: "20% · custom on Pro" },
        { k: "Instruments", v: "Forex, Indices, Crypto, Commodities" },
        { k: "Timeline", v: "4 hours (≤$25K) · 24 hours (≥$50K)" },
        { k: "Settlement", v: "Auto on timer expiry · winner gets prize" },
        { k: "Tie", v: "Refund both entries minus 5% network fee" },
        { k: "Disconnect", v: "Server keeps the clock running · no pause" },
      ]}
      prize={{
        title: "Eight tiers. One winner per match.",
        subtitle: "Entries are pooled, the platform takes a 10% rake, the rest is paid out to the winner. Higher tiers carry the same edge mechanics, just bigger payouts.",
        headers: ["Account", "Entry", "Winner prize"],
        rows: tiers,
      }}
      cta={{
        primaryLabel: "Enter a duel",
        primaryHref: "/app/duel",
        secondaryLabel: "Browse live duels",
        secondaryHref: "/app/duel",
      }}
    />
  );
}
