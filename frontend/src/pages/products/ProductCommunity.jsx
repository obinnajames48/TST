import { useState } from "react";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import ProductPageLayout from "@/components/products/ProductPageLayout";
import { communityNotify } from "@/lib/api";

export default function ProductCommunity() {
  const [email, setEmail] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) { toast.error("Please enter a valid email"); return; }
    try {
      const res = await communityNotify(email, "product-community");
      toast.success(res.already ? "You're already on the list" : "You're on the list. We'll notify you at launch.");
      setEmail("");
    } catch (err) { toast.error(err.message); }
  };

  return (
    <ProductPageLayout
      eyebrow="Product · 05 · Coming soon"
      name="Community Battles"
      tagline="Community vs community. Trading school vs trading school."
      description="A 6th-mode that's bigger than individual matches. Entire communities — Discord groups, prop firms, trading schools, regional clubs — go head-to-head over a multi-week season. Collective skill wins."
      icon={Globe}
      accent="dark"
      badge="Coming soon"
      stats={[
        { label: "Format", v: "TBA" },
        { label: "Season length", value: "4 – 12 weeks" },
        { label: "Roster size", value: "10 – 100" },
        { label: "Status", value: "Pre-launch" },
        { label: "Notify list", value: "Open" },
      ]}
      model={{
        title: "Imagine your Discord on a leaderboard.",
        paragraphs: [
          "Each community fields a roster. Members play standard formats (Duel, Royale, Multi, Tag Team) under their community banner. Wins, equity gains and tournament finishes contribute to the community's seasonal score.",
          "At the end of each season, the top communities receive recognition + prize allocations distributed to their members. Bragging rights, real money, and a permanent banner in the platform's hall of communities.",
        ],
        bullets: [
          "Communities recognised: Discord, schools, prop firms, regional clubs",
          "Seasonal scoring across all platform formats",
          "Per-community leaderboards visible to everyone",
          "Prize allocation paid to the community's wallet on season close",
          "Inter-community challenges (Discord A vs Discord B, etc.)",
        ],
      }}
      rules={[
        { k: "Status", v: "Pre-launch (Q3 2026 target)" },
        { k: "Min roster", v: "10 traders" },
        { k: "Max roster", v: "100 traders" },
        { k: "Verification", v: "Community admin verifies roster" },
        { k: "Scoring", v: "Aggregate wins × tier multipliers" },
        { k: "Season length", v: "4 – 12 weeks" },
        { k: "Inter-community challenges", v: "Direct head-to-head bookable" },
        { k: "Prize handling", v: "Paid to community wallet, distributed by admin" },
      ]}
      cta={{
        primaryLabel: "Notify me at launch",
        primaryHref: "#notify",
      }}
      extra={
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#6B7280]">Join the waitlist</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">Get notified when Community Battles is live.</h2>
            <p className="mt-4 text-[15px] text-[#4B5563] max-w-lg leading-relaxed">Drop your email — we'll only message you when sign-ups for the first season open. No marketing spam, no third-party sharing.</p>
          </div>
          <div className="lg:col-span-5">
            <form id="notify" onSubmit={submit} data-testid="community-notify-form-page" className="bg-[#0F0F12] text-white rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#A78BFA] rounded-full blur-[100px] opacity-30 pointer-events-none" />
              <label className="relative text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Email</label>
              <div className="relative mt-3 flex gap-2">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trader@email.com" data-testid="community-notify-email-page" className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-3 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#B4E04C]" />
                <button type="submit" data-testid="community-notify-submit-page" className="bg-[#B4E04C] text-[#0F0F12] font-semibold text-sm px-5 rounded-full hover:bg-white">Notify me</button>
              </div>
              <p className="relative mt-3 text-xs text-white/40">We'll only email you when Community Battles is live.</p>
            </form>
          </div>
        </div>
      }
    />
  );
}
