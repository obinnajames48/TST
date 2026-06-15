// Central API client for THE SELECT TRADERS.
// All requests go through one fetch wrapper that handles JSON, headers, and errors.

const BASE = process.env.REACT_APP_BACKEND_URL;

async function http(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = "Request failed";
    try {
      const j = await res.json();
      detail = j.detail || detail;
    } catch (_) {}
    const err = new Error(detail);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---------- Me / Dashboard / Stats ----------
export const getMe = () => http("/me");
export const updateMe = (patch) => http("/me", { method: "PATCH", body: patch });
export const getMyStats = () => http("/me/stats");
export const getDashboard = () => http("/dashboard");
export const getLiveStats = () => http("/stats/live");

// ---------- Duels ----------
export const listLiveDuels = () => http("/duels/live");
export const listOpenDuels = () => http("/duels/open");
export const getTradingStation = () => http("/me/trading-station");
export const getDuel = (id) => http(`/duels/${id}`);
export const spawnJoin = (account_size) =>
  http("/duels/spawn", { method: "POST", body: { account_size } });
export const enterDuel = (account_size) =>
  http("/duels/enter", { method: "POST", body: { account_size } });
export const getQueueState = (duel_id) => http(`/duels/queue/${duel_id}`);
export const cancelQueue = (duel_id) =>
  http(`/duels/queue/${duel_id}/cancel`, { method: "POST" });
export const readyDuel = (duel_id) =>
  http(`/duels/${duel_id}/ready`, { method: "POST" });
export const createCustomDuel = (payload) =>
  http("/duels/custom", { method: "POST", body: payload });
export const getMt5Creds = (id) => http(`/duels/${id}/mt5`);
export const confirmMt5Login = (id) =>
  http(`/duels/${id}/confirm-login`, { method: "POST" });

// ---------- Royale ----------
export const listLobbies = (filters = {}) => {
  const qs = new URLSearchParams();
  if (filters.size) qs.set("size", filters.size);
  if (filters.timeline) qs.set("timeline", filters.timeline);
  const q = qs.toString();
  return http(`/royale/lobbies${q ? `?${q}` : ""}`);
};
export const getLobby = (id) => http(`/royale/lobbies/${id}`);
export const joinLobby = (id) => http(`/royale/lobbies/${id}/join`, { method: "POST" });

// ---------- Tournaments ----------
export const listTournaments = () => http("/tournaments");
export const getTournament = (id) => http(`/tournaments/${id}`);
export const registerTournament = (id) =>
  http(`/tournaments/${id}/register`, { method: "POST" });

// ---------- Teams ----------
export const listTeams = () => http("/teams");
export const createTeam = (payload) => http("/teams", { method: "POST", body: payload });

// ---------- Wallet ----------
export const getWallet = () => http("/wallet");
export const deposit = (amount, method) =>
  http("/wallet/deposit", { method: "POST", body: { amount, method } });
export const withdraw = (amount) =>
  http("/wallet/withdraw", { method: "POST", body: { amount } });
export const listTransactions = () => http("/wallet/transactions");

// ---------- Notifications ----------
export const listNotifications = () => http("/notifications");
export const markAllRead = () => http("/notifications/mark-all-read", { method: "POST" });

// ---------- Match history ----------
export const matchHistory = () => http("/match-history");

// ---------- Settings ----------
export const kycUpload = () => http("/settings/kyc/upload", { method: "POST" });
export const listLinkedAccounts = () => http("/settings/linked-accounts");

// ---------- Community ----------
export const communityNotify = (email, source = "landing") =>
  http("/community/notify", { method: "POST", body: { email, source } });
