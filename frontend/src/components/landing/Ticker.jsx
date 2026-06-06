const items = [
  { type: "live", text: "@TradeFury_ vs @GoldHands · LEADING +$1,247", tone: "green" },
  { type: "royale", text: "ROYALE FINAL · 3 TRADERS REMAINING · 50-Player Lobby", tone: "gold" },
  { type: "duel", text: "NEW DUEL · $100K Account · Open for Pairing", tone: "teal" },
  { type: "win", text: "@StealthAlpha WON $5,000 · 1v1 DUEL · $250K Account", tone: "green" },
  { type: "loss", text: "@CryptoKing −$2,840 · Royale R3 Eliminated", tone: "red" },
  { type: "tournament", text: "MULTI TRADER QF · 8 SEATS · Starts 14:00 UTC", tone: "gold" },
  { type: "team", text: "TEAM ALPHA vs TEAM CAPITAL · 5v5 · $1M COMBINED", tone: "teal" },
  { type: "win", text: "@PaperHands_NO_MORE +$11,400 · 24h Royale Champion", tone: "green" },
];

const toneClass = {
  green: "text-[#00E676]",
  red: "text-[#FF4C6A]",
  gold: "text-[#D4AF37]",
  teal: "text-[#00C9A7]",
};

const labelMap = {
  live: "LIVE",
  royale: "ROYALE",
  duel: "DUEL",
  win: "WIN",
  loss: "LOSS",
  tournament: "TOURNAMENT",
  team: "TEAM",
};

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <div key={i} className="flex items-center px-8 gap-3 shrink-0">
          <span className="text-[#94A3B8] font-mono text-[10px] tracking-[0.32em] uppercase border border-white/15 px-2 py-1">
            {labelMap[it.type]}
          </span>
          <span className={`font-mono text-sm uppercase tracking-wider whitespace-nowrap ${toneClass[it.tone]}`}>
            {it.text}
          </span>
          <span className="text-[#1E2A45]">•</span>
        </div>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <section
      id="ticker"
      data-testid="live-ticker-section"
      className="relative bg-[#0A0E1A] border-y border-[#D4AF37]/30 py-5 overflow-hidden gold-glow"
    >
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#0A0E1A] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#0A0E1A] to-transparent pointer-events-none" />

      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF4C6A] pulse-dot" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4C6A]" />
        </span>
        <span className="hidden sm:inline font-mono text-[10px] tracking-[0.42em] uppercase text-[#FF4C6A]">
          Live Feed
        </span>
      </div>

      <div className="flex animate-marquee whitespace-nowrap pl-44">
        <Row />
        <Row />
      </div>
    </section>
  );
}
