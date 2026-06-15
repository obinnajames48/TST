import { Users } from "lucide-react";
import ProductPageLayout from "@/components/products/ProductPageLayout";

const formats = [
  { stage: "3v3 (Standard)", share: "$3K combined", amount: "$300 per team", featured: false },
  { stage: "5v5 (Standard)", share: "$5K combined", amount: "$500 per team", featured: false },
  { stage: "3v3 (High-Stakes)", share: "$300K combined", amount: "$30K per team", featured: true },
  { stage: "5v5 (High-Stakes)", share: "$1M combined", amount: "$100K per team", featured: false },
];

export default function ProductTagTeam() {
  return (
    <ProductPageLayout
      eyebrow="Product · 04"
      name="Tag Team Trading"
      tagline="Build your squad. Trade as one. Win as one."
      description="Trading is usually a solo sport. Tag Team breaks that. Assemble a roster of 3 or 5 traders, allocate combined capital across teammates however you like, and compete against another squad. Highest combined equity at the buzzer wins."
      icon={Users}
      accent="purple"
      stats={[
        { label: "Formats", value: "3v3 · 5v5" },
        { label: "Combined accounts", value: "$5K – $1M" },
        { label: "Capital split", value: "Your call" },
        { label: "Match length", value: "4h – 24h" },
      ]}
      model={{
        title: "The first real team sport for traders.",
        paragraphs: [
          "Each team receives a combined account. The captain decides how to split it — equal across all teammates, or stacked on the strongest hands. That allocation is the team's first strategic decision.",
          "Every teammate gets their own MT5 login. They trade independently but their results aggregate live into a single team equity feed. The team with the higher combined equity when time expires wins the entire match prize.",
        ],
        bullets: [
          "3v3 or 5v5 formats — pick the squad size that fits",
          "Captain creates the team and invites by username",
          "Pro membership required to create a team",
          "Combined account split is the captain's call",
          "Aggregated live equity feed for both teams",
        ],
      }}
      rules={[
        { k: "Format", v: "3v3 or 5v5 (no asymmetric squads)" },
        { k: "Team composition", v: "Captain + 2 or 4 teammates" },
        { k: "Capital allocation", v: "Captain chooses · disclosed to teammates" },
        { k: "Account combination", v: "$5K – $1M combined per team" },
        { k: "Leverage", v: "1:50 across all teammates" },
        { k: "Match duration", v: "4h (≤$50K) · 24h (≥$100K)" },
        { k: "Settlement", v: "Combined team equity at buzzer" },
        { k: "Tie", v: "Refund both teams, minus 5% network fee" },
        { k: "Captain requirements", v: "Pro membership + KYC verified" },
        { k: "Teammate departure", v: "Mid-match exits forfeit that allocation" },
      ]}
      prize={{
        title: "Same 1.8x edge. Bigger pool. Shared glory.",
        subtitle: "Prize is awarded to the winning team and split equally across all team members — or per the captain's pre-match split if one was agreed.",
        headers: ["Format", "Combined account", "Team prize"],
        rows: formats,
      }}
      cta={{
        primaryLabel: "Create your team",
        primaryHref: "/app/tagteam",
        secondaryLabel: "Join an open team",
        secondaryHref: "/app/tagteam",
      }}
    />
  );
}
