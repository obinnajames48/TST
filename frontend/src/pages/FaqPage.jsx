import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Search, ArrowLeft, Sparkles, Swords, Crown, Trophy, Users, Globe, Wallet, ShieldCheck, Settings } from "lucide-react";
import ProductNav from "@/components/products/ProductNav";
import Footer from "@/components/landing/Footer";
import { NeonBeam } from "@/components/products/ProductPrimitives";

/* -----------------------------------------------------------
   FAQ DATA — organized into 8 sections, fully detailed
   ----------------------------------------------------------- */

const SECTIONS = [
  {
    id: "general",
    icon: Sparkles,
    title: "General",
    sub: "Platform basics, accounts, KYC, wallet, payouts.",
    qs: [
      { q: "What is The Select Traders?",
        a: "The Select Traders is a peer-to-peer trading competition platform. Traders compete head-to-head — 1v1 duels, royales, tournaments, team matches — for real money. Every match uses identical brokerage accounts, the same clock, the same rules. The winner takes the pool minus a transparent platform rake (10–15% depending on product). No prop-firm tricks, no rebates, no broker-side games." },
      { q: "Is this real money, or simulated?",
        a: "Real money. Every entry fee is deducted from your wallet in real currency. Every prize is paid in real currency. The trading itself uses real broker accounts (MT5) — the trades you execute would behave identically on any retail MT5 broker. There's nothing simulated about the outcomes." },
      { q: "How do I create an account?",
        a: "Tap Get Started, enter your email, verify it, and you're in. Basic features (browsing, joining standard duels, royale spectating) are immediate. To deposit money or compete with funds you'll need to complete KYC: a photo ID plus a quick liveness check, usually verified within 24 hours." },
      { q: "What countries are supported?",
        a: "47 countries today, primarily across the EU, UK, US (excluding NY, WA), Canada, Australia, Singapore, UAE, and most LATAM. We're rolling out additional jurisdictions monthly. If your country isn't supported yet, you can still browse and spectate — just can't deposit or compete until your region is enabled." },
      { q: "How do deposits and withdrawals work?",
        a: "Deposit via card, bank transfer, or supported crypto (USDC, USDT, BTC). Funds land in your platform wallet, which you use to pay entry fees. Withdrawals go back to your original deposit method (or your verified bank/crypto address) — processed in 1–3 business days, no hidden fees besides the standard payment-processor cost." },
      { q: "What is Pro membership and do I need it?",
        a: "Pro membership ($49/month, 14-day free trial) unlocks: creating custom 1v1 Pro duels (your own rules, instruments, drawdown, timeline), captaining Tag Team matches, advanced analytics + trade replay, highlighted broadcast listings, priority matchmaking, and access to high-stakes tournaments. You can compete fully in standard 1v1 duels and royales on the Free tier — Pro just unlocks more formats and tools." },
      { q: "How is the platform regulated?",
        a: "We operate as a regulated competitions platform, not a brokerage. Each region we operate in has appropriate licensing. Funds are held in segregated accounts with tier-1 partners. KYC/AML is enforced for every depositing user. We don't take the other side of your trades — we run the arena, the broker runs the trading." },
      { q: "Is my data and money safe?",
        a: "Yes. Funds are held in segregated escrow accounts, not in our operating capital. KYC documents are encrypted at rest and only accessible to verification staff. Trading data + match results are immutable once settled (audit-hashed). 2FA is required for any withdrawal." },
      { q: "What's the platform rake on each product?",
        a: "1v1 Duel: 10% rake (winner takes 90% of combined entries · ~1.8× multiplier on entry). Trading Royale: 15% rake (winner takes 85% of pool). Tournaments: 10% rake on the combined prize pool. Tag Team: 10% rake. Affiliate fees are paid out of the platform rake — they don't reduce winner prizes." },
      { q: "Can I have multiple accounts?",
        a: "No. One verified human, one account. Multi-accounting violates platform rules and triggers permanent ban + forfeiture. We use KYC + device fingerprinting + behavioural detection to enforce this. If you have a legitimate edge case (e.g. account recovery), contact support." },
    ],
  },
  {
    id: "duel",
    icon: Swords,
    title: "1v1 Duel",
    sub: "Head-to-head match mechanics.",
    qs: [
      { q: "How do I enter a duel?",
        a: "Go to the Duel page, pick a Spawn account size ($5K–$1M), confirm payment from your wallet. You'll enter a 5-minute pairing queue. If a matching opponent appears, you're paired instantly; otherwise you'll be paired with an AI opponent at the end of the queue. Both traders ready up within 3 minutes, MT5 credentials reveal, and a 3-minute pre-trade countdown begins before the match goes live." },
      { q: "What if no opponent is found?",
        a: "After the 5-minute queue expires, you're paired with an AI opponent. The AI uses a deterministic strategy based on the match seed — it's not perfect, but it's not trivial either. You still play for the full prize and can absolutely win." },
      { q: "What happens if my opponent doesn't ready up?",
        a: "Both traders have 3 minutes to ready up after pairing. If either side fails to ready up in time, the match is cancelled and both entry fees are refunded automatically. No penalty either way." },
      { q: "Can I customise duel rules?",
        a: "Yes — Pro Duels let you set your own rules: leverage (up to 1:200), instruments (FX only, crypto only, etc.), max drawdown (0–30%), daily drawdown, timeline (15 min – 7 days). Custom Pro duels show in the Pro lane and are visible to other Pro members." },
      { q: "Standard vs Pro Duel — what's the difference?",
        a: "Standard Duels: platform-set rules (1:50 leverage, 15% daily DD, 20% max DD, full instrument access, 4h / 24h timelines by tier). Pro Duels: every rule is custom and your duel is highlighted in the broadcast lane. Pro is required to create a Pro Duel, but anyone can join one if it matches their tier." },
      { q: "What instruments can I trade?",
        a: "Forex (28 pairs majors/minors/exotics), Crypto (BTC, ETH, SOL, plus 12 others), Indices (S&P, Nasdaq, DAX, Nikkei, ASX, FTSE), Commodities (Gold, Silver, Oil, Gas). On Pro Duels the captain can restrict the universe." },
      { q: "What happens if I disconnect?",
        a: "Your positions stay open and the server clock keeps running. You can reconnect from any device and your positions are still there. Disconnect does NOT pause the match. If you don't reconnect before the buzzer, your equity is snapshotted as-is." },
      { q: "How are ties handled?",
        a: "Exact equity ties (rare) trigger automatic refunds of both entry fees minus a 5% network fee. The match is recorded as a draw on both traders' records." },
      { q: "Can I trade overnight in a 24h match?",
        a: "Yes. There's no forced flat-out at session close. You manage your own risk — including weekend gap risk, swap charges, and overnight positioning." },
      { q: "What's the maximum I can win?",
        a: "$20,000 on the $1M tier (1.8× the $11,000 entry). Pro Duels can be configured for arbitrary stakes by mutual agreement — there's no hard cap." },
      { q: "Can I duel a specific person?",
        a: "Yes. From their profile or via username search, send a direct duel challenge specifying tier and rules. They have 24 hours to accept or decline. Direct challenges bypass the matching queue." },
    ],
  },
  {
    id: "royale",
    icon: Crown,
    title: "Trading Royale",
    sub: "Survival lobbies and two-phase elimination.",
    qs: [
      { q: "How does Trading Royale work?",
        a: "Multiple traders spawn into the same lobby with identical $50,000 accounts. The first half of the lobby timeline is Phase 1 (free-for-all, no eliminations). The second half is Phase 2 — at equal intervals (rounded to nearest 30s), the trader with the lowest equity is eliminated. The last trader standing wins 85% of the pool." },
      { q: "What are the lobby sizes?",
        a: "10-player, 20-player, and 50-player lobbies. Each has a $20 flat entry fee, so pools are $200/$400/$1,000 respectively, with the winner receiving 85% ($170/$340/$850)." },
      { q: "What are the timelines?",
        a: "We offer 5min, 30min, 1h, 4h, 24h, and 72h lobbies. Shorter lobbies are aggressive sprints; longer lobbies reward risk management and patience. The 50-player 72h lobby is the platform's marquee survival event." },
      { q: "How are eliminations calculated?",
        a: "Elimination interval = (timeline ÷ 2) ÷ (lobby_size − 1), rounded to the nearest 30 seconds. Example: 50-player 1h lobby → Phase 2 is 30 min, divided by 49 = ~37s per elimination, rounded to 30s." },
      { q: "Can I be eliminated even if I'm profitable?",
        a: "Yes. Elimination is relative — you're out if your equity is the lowest in the lobby at that interval, even if you're still up overall. Surviving requires not just making money, but making more than the worst-performing trader." },
      { q: "Can I rejoin after being eliminated?",
        a: "No. Elimination is permanent within a lobby. You can immediately join a different lobby — no cooldown — but the lobby you were eliminated from is closed to you." },
      { q: "What happens when a lobby doesn't fill?",
        a: "If a lobby hasn't filled within its lobby-fill window (usually 2 hours), AI opponents are added to complete the roster. The total pool stays the same; you still play for the full 85% winner share." },
      { q: "How is the leaderboard updated?",
        a: "Live, updated every 3 seconds. You see equity, P&L, current rank, and a colour-coded status (alive vs eliminated). Eliminated traders stay visible on the leaderboard with strike-through styling." },
      { q: "Can I spectate a royale?",
        a: "Yes. Any free user can spectate any live royale lobby. Spectators see the full leaderboard, can click into individual trader profiles, and can see the phase timer and elimination countdown." },
    ],
  },
  {
    id: "tournament",
    icon: Trophy,
    title: "Multi Trader",
    sub: "32-player tournament brackets.",
    qs: [
      { q: "What is Multi Trader?",
        a: "A tournament format — 32 traders, 8 groups of 4, a group stage followed by knockout rounds (R16, QF, SF, Final). Each stage runs either 1 trading day or 5 trading days, set per tournament. Money is paid at every qualifying stage, not just the final podium." },
      { q: "How does the group stage work?",
        a: "All 4 traders in your group trade simultaneously over a single fixed timeline (1 or 5 trading days). There are NO head-to-head matches inside the group — every trader is just trying to maximise their own equity. At the end of the timeline, the top 2 by equity advance to the Round of 16. Bottom 2 are out." },
      { q: "How do the knockouts work?",
        a: "R16, QF, SF and Final are sealed 1v1 sealed-equity matches: you and your opponent each trade your own account for the full stage timeline (1 or 5 trading days). At the buzzer, whoever has the higher equity advances. There's no real-time interaction — just two parallel accounts and one metric." },
      { q: "How long is each stage?",
        a: "Each stage is either 1 trading day or 5 trading days — set per tournament when it's created. 1-day tournaments are sprints (the whole thing wraps in ~5 days). 5-day tournaments are marathons (5 weeks total) and reward consistency over flashes of brilliance." },
      { q: "How much does it cost to enter?",
        a: "Entry fees vary by tournament tier: a $50K-account tournament costs $500 entry, while a $100K-account tournament costs $1,000. The Diamond Open ($100K, $120K prize pool) is currently the largest active tournament." },
      { q: "How is the prize pool distributed?",
        a: "Champion gets 15%, Runner-up 15%, the 4 Semi-finalists split 20% (5% each), the 8 QF qualifiers split 25% (3.125% each), and the 16 R16 qualifiers split the remaining 25%. Every advancing trader earns." },
      { q: "What's the tiebreaker if equities tie exactly?",
        a: "Maximum equity reached during the stage. If two traders finish at identical closing equity, whoever hit the higher peak wins. If even those tie, the trader with the lower max drawdown advances. Exact triple-tie has never happened in production." },
      { q: "Can I lose money in a tournament?",
        a: "Yes — your tournament entry fee is your buy-in, and if you don't advance past the group stage you lose it. But you can also win significantly more than your entry: even reaching the Quarter-Finals in a $120K pool tournament earns you ~$3,750." },
      { q: "Can I see other traders' equity during the stage?",
        a: "Yes. Live leaderboards show every trader's current equity within your group (during group stage) or your match (during knockouts). Strategically, watching your prospective next opponent is a real edge — you can scout playing styles and risk patterns." },
    ],
  },
  {
    id: "tagteam",
    icon: Users,
    title: "Tag Team",
    sub: "3v3 and 5v5 squad trading.",
    qs: [
      { q: "What is Tag Team Trading?",
        a: "Two teams of 3 (3v3) or 5 (5v5) traders compete against each other. Each team has a combined account; the captain decides how to split it among teammates. Each teammate trades independently with their own MT5 login, but the team's total equity at the buzzer is what wins." },
      { q: "Do I need Pro to play?",
        a: "Pro is required only to CAPTAIN a team. Anyone (Free or Pro) can join an existing team as a member when invited. The captain handles roster, capital allocation, and tournament entry." },
      { q: "How does the captain allocate the combined account?",
        a: "Before the match starts, the captain chooses the split — equal across all teammates, or weighted however they like. The split is disclosed to all teammates before the match locks. Captains can also pre-set the prize split (default is equal among winning team)." },
      { q: "What if a teammate disconnects mid-match?",
        a: "Their MT5 sub-account stays active server-side. Their positions remain open. If they don't reconnect before the buzzer, their final equity is snapshotted in place. Mid-match exits don't pause the match." },
      { q: "Can I be on multiple teams?",
        a: "Yes — you can join different teams between matches. But you can only be on one team per match (no double-dipping in a single competition)." },
      { q: "How big are the combined accounts?",
        a: "3v3 Standard: $3K total · 3v3 High-Stakes: $300K total · 5v5 Standard: $5K total · 5v5 High-Stakes: $1M total. The High-Stakes 5v5 ($1M combined) is the largest single-match format on the platform." },
      { q: "How are team standings tracked?",
        a: "Live combined-equity feed updates every 3 seconds. Each member's individual P&L is visible to teammates and the captain. The opposing team's combined equity is visible to everyone too — there are no hidden positions between teams." },
    ],
  },
  {
    id: "community",
    icon: Globe,
    title: "Community Battles",
    sub: "Pre-launch — Q3 2026.",
    qs: [
      { q: "What are Community Battles?",
        a: "A seasonal format where entire trading communities — Discord groups, prop firms, trading schools, regional clubs — go head-to-head. Members play standard formats (Duel, Royale, Multi, Tag Team) under their community banner; results aggregate into a community-wide score." },
      { q: "When does it launch?",
        a: "Q3 2026 target. The first season will be invite-based with a curated list of verified communities. Drop your email on the Community Battles product page to be notified at launch." },
      { q: "How does scoring work?",
        a: "Each community's score is the aggregate of its members' wins × tier multipliers across all platform formats. Larger lobbies and higher-tier matches contribute more points. The season ends with the highest-scoring community taking a prize allocation paid into the community's wallet." },
      { q: "What's the minimum community size?",
        a: "10 verified traders minimum, 100 maximum per roster. The community admin verifies the roster — only roster members contribute to the score." },
      { q: "Can communities challenge each other directly?",
        a: "Yes — inter-community challenges will be bookable for direct head-to-head events (Discord A vs Discord B, for example). These run alongside the season scoring." },
      { q: "How is the prize distributed?",
        a: "Winning community's prize is paid to a community wallet, which the community admin distributes among members per the community's own rules (split equally, weighted by contribution, etc.). We don't dictate how communities split their winnings internally." },
    ],
  },
  {
    id: "affiliate",
    icon: Sparkles,
    title: "Affiliate Program",
    sub: "Refer traders. Earn rev-share for life.",
    qs: [
      { q: "How does the affiliate program work?",
        a: "Get a unique referral link from your dashboard. Share it. When someone signs up using your link and enters their first match, they're permanently attributed to you. You then earn 10–25% of every entry fee they ever pay, for life. Auto-paid into your wallet on the 1st of every month." },
      { q: "What are the four tiers?",
        a: "Rookie (10% rev-share, $5 signup bonus, no targets) · Pro (15%, $10 bonus, requires 5 refs + $5K volume) · Elite (20%, $15 bonus, requires 20 refs + $25K volume) · Legend (25%, $25 bonus, requires 50 refs + $100K volume). Targets are lifetime — once hit, the tier is permanent." },
      { q: "Can my tier go down?",
        a: "Never. Once you've earned a tier, it's permanent. Even if your ref activity drops to zero later, you keep that rev-share rate on any new refs you bring in." },
      { q: "When do I get paid?",
        a: "Auto-deposited into your platform wallet on the 1st of every month. No claim flow, no minimum threshold, no broker-style hidden conditions. If you earned $0.50 last month, you get $0.50 on the 1st." },
      { q: "Can I withdraw affiliate earnings?",
        a: "Yes. Affiliate earnings are real wallet credit — you can withdraw them via the same channels as any other wallet balance (bank, card refund, supported crypto)." },
      { q: "What counts as a referral?",
        a: "Any new trader who signs up via your unique link, completes KYC, and enters at least one paid match. Browsing-only signups don't count until they actually transact." },
      { q: "Is there self-referral protection?",
        a: "Yes. KYC + device fingerprinting + payment-method matching prevents self-referrals. If detected, the referral is voided and the referring account is flagged. We don't penalise honest mistakes — but coordinated fraud rings get banned." },
      { q: "Can I see what my refs are doing?",
        a: "You see aggregate volume per ref (entry fees they've paid in the last 30 days) and your earnings per ref. You don't see their match results, positions, or P&L — that's their private data." },
    ],
  },
  {
    id: "trading",
    icon: Settings,
    title: "Trading & MT5",
    sub: "Account credentials, leverage, technical setup.",
    qs: [
      { q: "What broker do you use?",
        a: "Every competition account is provisioned on our regulated MT5 broker partner. The platform is MetaTrader 5 — industry standard. You can trade from the MT5 desktop client, mobile app, web terminal, or any third-party EA-compatible interface." },
      { q: "When do I get my MT5 credentials?",
        a: "For duels: as soon as both traders are paired and ready, MT5 login + password + server are displayed in your match dashboard with a 3-minute pre-trade countdown. For royales/tournaments/team matches: credentials are revealed at the lobby start time." },
      { q: "Can I use a trading EA / bot?",
        a: "Yes — EAs and automated strategies are allowed on all standard products, since both sides have equal access. Custom Pro Duels can restrict EA usage if the captain sets that rule. Latency-arbitrage EAs are forbidden across all products." },
      { q: "What about copy trading?",
        a: "Not allowed. Copying live signals from another trader during your own competition match is a violation — the platform is for individual skill expression. We detect copy-trading patterns automatically." },
      { q: "What's the leverage?",
        a: "Standard: 1:50 across all instruments. Pro: up to 1:200 if the captain configures it. Higher leverage = bigger upside AND bigger downside — manage your drawdown." },
      { q: "What spreads / commissions apply?",
        a: "Raw spreads from our liquidity providers + a $7/lot round-turn commission. Both traders pay identical spreads + commissions — no asymmetry. Total trading cost is typically 30–40% lower than retail MT5 brokers." },
      { q: "Are there swap / overnight fees?",
        a: "Yes, standard overnight swap rates apply on all positions held past 22:00 UTC. Pro Duels can be configured as swap-free at the captain's discretion." },
      { q: "What's the max drawdown rule?",
        a: "Standard: 20% max drawdown (hard liquidation point). 15% daily drawdown (you can lose up to 15% in a single day before liquidation). Pro Duels can set custom DD (0–30%)." },
      { q: "What happens if I hit max drawdown?",
        a: "Your account is liquidated instantly — all positions closed at market, account frozen. Your opponent automatically wins the duel. Liquidation is hard — no margin call grace period." },
      { q: "Can I use multiple devices?",
        a: "Yes. MT5 credentials work on any number of devices simultaneously. Just don't share them — anyone with your credentials can trade on your account." },
    ],
  },
];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("general");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Track active section as user scrolls
  useEffect(() => {
    const handler = () => {
      const offsets = SECTIONS.map((s) => {
        const el = document.getElementById(`faq-${s.id}`);
        if (!el) return { id: s.id, top: Infinity };
        return { id: s.id, top: el.getBoundingClientRect().top };
      });
      const above = offsets.filter((o) => o.top < 180).sort((a, b) => b.top - a.top);
      if (above[0]) setActiveSection(above[0].id);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const q = query.trim().toLowerCase();
    return SECTIONS.map((s) => ({
      ...s,
      qs: s.qs.filter((qa) => qa.q.toLowerCase().includes(q) || qa.a.toLowerCase().includes(q)),
    })).filter((s) => s.qs.length > 0);
  }, [query]);

  const totalQs = SECTIONS.reduce((acc, s) => acc + s.qs.length, 0);

  return (
    <main className="min-h-screen bg-[#0F0F12] text-white" data-testid="faq-page">
      <ProductNav />

      {/* HERO */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#B4E04C] rounded-full blur-[160px] opacity-15" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <Link to="/" data-testid="back-to-landing" className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.18em] text-white/40 hover:text-[#B4E04C] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <div className="mt-8 flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#B4E04C]">FAQ · {totalQs} answers</div>
              <h1 data-testid="faq-hero-title" className="mt-4 text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white">
                Every question, <br />
                <span className="text-[#B4E04C]">answered.</span>
              </h1>
              <p className="mt-5 text-lg text-white/60 max-w-xl leading-relaxed">
                Platform basics, product mechanics, MT5 setup, payouts, affiliate program — sorted by topic. If something's still unclear, hit support.
              </p>
            </div>
            <div className="w-full md:w-[380px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search all questions…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="faq-search"
                className="w-full bg-[#16161D] border border-white/10 rounded-full pl-12 pr-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#B4E04C] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT — Sidebar nav + sections */}
      <section className="relative py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-10">
          {/* Sticky sidebar nav (desktop) */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40 mb-3 px-2">Sections</div>
              <nav className="space-y-1" data-testid="faq-sidebar">
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const active = activeSection === s.id;
                  return (
                    <a key={s.id} href={`#faq-${s.id}`} data-testid={`faq-nav-${s.id}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-colors ${active ? "bg-[#B4E04C]/15 border border-[#B4E04C]/30 text-white" : "text-white/55 hover:text-white hover:bg-white/5 border border-transparent"}`}>
                      <Icon className={`w-3.5 h-3.5 ${active ? "text-[#B4E04C]" : "text-white/40"}`} />
                      <span className="font-medium">{s.title}</span>
                      <span className={`ml-auto font-mono text-[10px] ${active ? "text-[#B4E04C]" : "text-white/35"}`}>{s.qs.length}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Mobile section selector pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto -mx-5 px-5 pb-2 -mb-2" data-testid="faq-mobile-pills">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#faq-${s.id}`} data-testid={`faq-pill-${s.id}`} className="shrink-0 inline-flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-full bg-[#16161D] border border-white/10 text-white/65 hover:text-white">
                {s.title}
              </a>
            ))}
          </div>

          {/* Sections list */}
          <div className="lg:col-span-9 space-y-14" data-testid="faq-sections">
            {filtered.length === 0 && (
              <div className="bg-[#16161D] border border-dashed border-white/10 rounded-3xl p-12 text-center" data-testid="faq-empty">
                <div className="text-[14px] text-white/50">No questions match "{query}". Try a different keyword.</div>
              </div>
            )}
            {filtered.map((s) => <FaqSection key={s.id} section={s} highlight={query} />)}
          </div>
        </div>
      </section>

      {/* SUPPORT CTA */}
      <section className="relative py-20 lg:py-24 border-t border-white/5 bg-[#0B0B0F]">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]">Still have a question?</h2>
          <p className="mt-4 text-[15px] text-white/55">Drop us a line — we usually respond in under 4 hours during trading hours.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <NeonBeam href="mailto:support@selecttraders.com" dataTestid="faq-support-cta">Email support</NeonBeam>
            <a href="https://discord.gg/selecttraders" data-testid="faq-discord-cta" className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-medium text-[14px] px-5 py-3.5 rounded-full hover:bg-white/10">
              Join Discord
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ---- Section + question rendering ----

function FaqSection({ section, highlight }) {
  const Icon = section.icon;
  return (
    <section id={`faq-${section.id}`} className="scroll-mt-28" data-testid={`faq-section-${section.id}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-[#B4E04C]/15 border border-[#B4E04C]/30 grid place-items-center">
          <Icon className="w-4 h-4 text-[#B4E04C]" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">{section.qs.length} questions</div>
          <div className="text-2xl md:text-3xl font-black tracking-tight text-white">{section.title}</div>
        </div>
      </div>
      <p className="text-[14px] text-white/50 mb-6 max-w-2xl">{section.sub}</p>
      <div className="space-y-2">
        {section.qs.map((qa, i) => <FaqItem key={i} qa={qa} sectionId={section.id} index={i} highlight={highlight} />)}
      </div>
    </section>
  );
}

function FaqItem({ qa, sectionId, index, highlight }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-[#16161D] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors" data-testid={`faq-item-${sectionId}-${index}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left group">
        <span className="text-[14.5px] md:text-[15px] font-semibold text-white pr-4">
          <Highlight text={qa.q} term={highlight} />
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-white/45 group-hover:text-white transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.6, 0.35, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-[14px] text-white/65 leading-relaxed border-t border-white/5 pt-4">
              <Highlight text={qa.a} term={highlight} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Highlight({ text, term }) {
  if (!term?.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, "ig"));
  return parts.map((p, i) => p.toLowerCase() === term.toLowerCase()
    ? <mark key={i} className="bg-[#B4E04C]/30 text-white rounded px-0.5">{p}</mark>
    : <span key={i}>{p}</span>);
}

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
