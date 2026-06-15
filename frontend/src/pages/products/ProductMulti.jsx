import { Trophy } from "lucide-react";
import ProductPageLayout from "@/components/products/ProductPageLayout";

const stages = [
  { stage: "Round of 16 qualifiers", share: "25%", amount: "Split 16 ways", featured: false },
  { stage: "Quarter-final qualifiers", share: "25%", amount: "Split 8 ways", featured: false },
  { stage: "Semi-finalists", share: "20%", amount: "Split 4 ways", featured: false },
  { stage: "Finalist (Runner-up)", share: "15%", amount: "Full share", featured: false },
  { stage: "Champion", share: "15%", amount: "Full share + glory", featured: true },
];

export default function ProductMulti() {
  return (
    <ProductPageLayout
      eyebrow="Product · 03"
      name="Multi Trader"
      tagline="Group stages. Knockouts. One champion."
      description="32 traders, 8 groups of 4. Over multiple weeks, the best advance from a round-robin group stage through Round of 16, Quarter-Finals, Semi-Finals and the Final. Money is paid out at every qualifying stage — not just the top 3."
      icon={Trophy}
      accent="lime"
      stats={[
        { label: "Field", value: "32 traders" },
        { label: "Groups", value: "8 × 4" },
        { label: "Stages", value: "Group → R16 → QF → SF → Final" },
        { label: "Pool paid out", value: "100%" },
      ]}
      model={{
        title: "Earn at every stage, not just the podium.",
        paragraphs: [
          "Most prop firms pay only the top 3. We pay everyone who advances. Qualify for the Round of 16 and you've already earned. Reach the Quarter-Finals and you've doubled up. Make Semi-Finals and you're in real-money territory. The Champion takes 15% of the pool — but so does the runner-up.",
          "Every match in every stage is a sealed duel: equal accounts, same clock, no negotiated edges. Stage advancement is decided by equity at match end.",
        ],
        bullets: [
          "32 traders divided into 8 groups of 4",
          "Top 2 from each group advance after Week 1 round-robin",
          "Weekly knockout rounds — 16 → 8 → 4 → 2 → 1",
          "Per-stage prize splits paid on stage completion",
          "Full bracket and group standings visible to all",
        ],
      }}
      rules={[
        { k: "Field", v: "32 traders per tournament" },
        { k: "Account size", v: "$50K – $100K depending on tournament" },
        { k: "Group stage format", v: "Round-robin (3 matches per trader)" },
        { k: "Group qualification", v: "Top 2 by W-D-L, then equity tiebreaker" },
        { k: "Knockout format", v: "Single match per round (no replays)" },
        { k: "Match duration", v: "4h per knockout match" },
        { k: "Group stage duration", v: "1 week" },
        { k: "Knockouts duration", v: "1 week per round (4 weeks total)" },
        { k: "3rd place match", v: "Yes — between SF losers" },
        { k: "Total tournament length", v: "5 weeks" },
      ]}
      prize={{
        title: "Pool distributed across 5 stages.",
        subtitle: "Every trader who advances earns a share. The Champion's 15% is paid as a full single share; lower stages are split across all qualifiers at that stage.",
        headers: ["Stage", "Pool share", "Per qualifier"],
        rows: stages,
      }}
      cta={{
        primaryLabel: "Enter a tournament",
        primaryHref: "/app/tournament",
        secondaryLabel: "View my journey",
        secondaryHref: "/app/tournament",
      }}
    />
  );
}
