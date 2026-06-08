// Shared mock data for the client area (replace with real APIs in P1+)

export const currentUser = {
  username: "TradeFury",
  fullName: "Riley Chen",
  plan: "PRO", // or "FREE"
  avatar: null,
  country: "🇺🇸",
  balance: 12480.5,
  pending: 3200,
  lifetimeEarned: 48720,
  globalRank: 142,
  tier: "Gold",
  winRate: 62.4,
};

export const liveMatches = [
  { id: "4781", type: "duel", custom: false, traderA: "TradeFury", traderB: "GoldHands", account: 100000, pnlA: 2847, pnlB: -1600, timeLeft: "03:42:11", spectators: 247, status: "live" },
  { id: "4782", type: "duel", custom: true, traderA: "StealthAlpha", traderB: "PaperHandsNoMore", account: 250000, pnlA: 5240, pnlB: 3010, timeLeft: "01:18:45", spectators: 412, status: "live" },
  { id: "4783", type: "duel", custom: false, traderA: "FXSamurai", traderB: "CryptoKing", account: 50000, pnlA: -340, pnlB: 1240, timeLeft: "00:24:08", spectators: 89, status: "live" },
  { id: "4784", type: "duel", custom: false, traderA: "TradeNova", traderB: "MarketBeast", account: 25000, pnlA: 180, pnlB: -90, timeLeft: "00:08:32", spectators: 54, status: "live" },
];

export const myMatches = [
  { id: "4781", type: "duel", opponent: "GoldHands", account: 100000, pnl: 2847, timeLeft: "03:42:11", status: "live" },
];

export const recentResults = [
  { id: "r1", date: "Feb 4", format: "1v1 Duel", opponent: "@FXSamurai", account: 50000, pnl: 850, result: "win", prize: 1000 },
  { id: "r2", date: "Feb 3", format: "Royale 50p", opponent: "Lobby R-2188", account: 5000, pnl: -45, result: "loss", prize: 0 },
  { id: "r3", date: "Feb 2", format: "1v1 Duel", opponent: "@StealthAlpha", account: 25000, pnl: 410, result: "win", prize: 500 },
  { id: "r4", date: "Feb 1", format: "Tag Team 3v3", opponent: "Team Beta", account: 100000, pnl: 1240, result: "win", prize: 800 },
  { id: "r5", date: "Jan 30", format: "1v1 Duel", opponent: "@TradeNova", account: 10000, pnl: -180, result: "loss", prize: 0 },
];

export const upcomingTournaments = [
  { id: "t-2026-09", name: "February Open", registered: 28, capacity: 32, startDate: "Feb 10", prizePool: 12800, stage: "Registration" },
  { id: "t-2026-10", name: "Crypto Circuit", registered: 32, capacity: 32, startDate: "Feb 12", prizePool: 25600, stage: "Group Stage" },
];

export const accountSizes = [
  { size: 5000, entry: 60, prize: 100, waiting: 1 },
  { size: 10000, entry: 125, prize: 200, waiting: 3 },
  { size: 25000, entry: 280, prize: 500, waiting: 0 },
  { size: 50000, entry: 550, prize: 1000, waiting: 2 },
  { size: 100000, entry: 1100, prize: 2000, waiting: 1 },
  { size: 250000, entry: 2800, prize: 5000, waiting: 0 },
  { size: 500000, entry: 5500, prize: 10000, waiting: 0 },
  { size: 1000000, entry: 11000, prize: 20000, waiting: 1 },
];

export const royaleLobbies = [
  { id: "R-3001", size: 50, joined: 47, timeline: "24h", startsIn: "12m", entry: 20, status: "filling" },
  { id: "R-3002", size: 20, joined: 20, timeline: "1h", startsIn: "live", entry: 20, status: "live" },
  { id: "R-3003", size: 10, joined: 6, timeline: "5min", startsIn: "Filling", entry: 20, status: "filling" },
  { id: "R-3004", size: 50, joined: 12, timeline: "72h", startsIn: "Filling", entry: 20, status: "filling" },
  { id: "R-3005", size: 20, joined: 15, timeline: "4h", startsIn: "2h", entry: 20, status: "filling" },
  { id: "R-3006", size: 10, joined: 10, timeline: "30min", startsIn: "Starting", entry: 20, status: "starting" },
];

export const royaleLeaderboard = [
  { rank: 1, name: "@StealthAlpha", equity: 51840, pnl: 1840, change: 0 },
  { rank: 2, name: "@TradeNova", equity: 51420, pnl: 1420, change: 1 },
  { rank: 3, name: "@FXSamurai", equity: 51113, pnl: 1113, change: -1 },
  { rank: 4, name: "@TradeFury", equity: 50847, pnl: 847, change: 2 },
  { rank: 5, name: "@MarketBeast", equity: 50412, pnl: 412, change: 0 },
  { rank: 6, name: "@GoldHands", equity: 50180, pnl: 180, change: -1 },
  { rank: 7, name: "@PaperHandsNoMore", equity: 49920, pnl: -80, change: 1 },
  { rank: 8, name: "@CryptoKing", equity: 49760, pnl: -240, change: -2 },
];

export const myTeams = [
  { id: "team-1", name: "Alpha", format: "3v3", role: "Captain", members: ["TradeFury", "Riley", "Jess"], record: "4-1" },
  { id: "team-2", name: "Capital", format: "5v5", role: "Member", members: ["Mo", "Jay", "Sam", "Nina", "TradeFury"], record: "2-3" },
];

export const transactions = [
  { id: "tx1", date: "Feb 5", type: "Prize", amount: 1000, status: "completed", ref: "Duel #4779" },
  { id: "tx2", date: "Feb 4", type: "Entry Fee", amount: -550, status: "completed", ref: "Duel #4779" },
  { id: "tx3", date: "Feb 3", type: "Deposit", amount: 500, status: "completed", ref: "Card •••4242" },
  { id: "tx4", date: "Feb 2", type: "Prize", amount: 500, status: "completed", ref: "Duel #4756" },
  { id: "tx5", date: "Feb 1", type: "Withdrawal", amount: -2000, status: "processing", ref: "Bank •••1184" },
  { id: "tx6", date: "Jan 30", type: "Entry Fee", amount: -280, status: "completed", ref: "Duel #4731" },
];

export const notifications = [
  { id: "n1", type: "pair", title: "Opponent found", body: "You've been paired with @FXSamurai for a $50K Duel.", time: "2m ago", unread: true },
  { id: "n2", type: "prize", title: "Prize credited", body: "$1,000 added to your wallet for Duel #4779.", time: "1h ago", unread: true },
  { id: "n3", type: "tournament", title: "Tournament starting soon", body: "February Open registration closes in 2 days.", time: "5h ago", unread: false },
  { id: "n4", type: "system", title: "KYC reminder", body: "Complete KYC before your first withdrawal.", time: "1d ago", unread: false },
];

export const earningsTrend = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  earnings: Math.round(2000 + Math.sin(i / 4) * 800 + i * 120 + Math.random() * 400),
}));

export const winRateByFormat = [
  { name: "1v1 Duel", value: 68 },
  { name: "Royale", value: 41 },
  { name: "Multi Trader", value: 55 },
  { name: "Tag Team", value: 72 },
];

export const winRateByMarket = [
  { name: "Forex", value: 64 },
  { name: "Crypto", value: 58 },
  { name: "Stocks", value: 71 },
  { name: "Commodities", value: 52 },
];
