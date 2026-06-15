import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Eye, ArrowUpRight, ArrowDownRight, Activity, Copy, Lock, Server, ShieldCheck, Clock as ClockIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, YAxis, XAxis, Tooltip } from "recharts";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useFetch } from "@/lib/useFetch";
import { getDuel, getMe, getMt5Creds, confirmMt5Login } from "@/lib/api";

const sampleTrades = [
  { side: "buy", instrument: "EUR/USD", size: "0.5 lot", entry: 1.0821, exit: 1.0856, pnl: 175 },
  { side: "sell", instrument: "BTC/USD", size: "0.1", entry: 68420, exit: 67980, pnl: 44 },
  { side: "buy", instrument: "XAU/USD", size: "1.2 lot", entry: 2031.4, exit: 2042.8, pnl: 1368 },
  { side: "sell", instrument: "USOIL", size: "5 lot", entry: 76.42, exit: 76.85, pnl: -215 },
  { side: "buy", instrument: "GBP/JPY", size: "0.3 lot", entry: 189.42, exit: 189.78, pnl: 108 },
];

export default function Match() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { data: duel } = useFetch(() => getDuel(matchId), { pollMs: 2000, deps: [matchId] });
  const { data: me } = useFetch(getMe);
  const [mt5Dismissed, setMt5Dismissed] = useState(false);

  if (!duel) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg)] grid place-items-center">
        <div className="text-[var(--muted)]">Loading match…</div>
      </div>
    );
  }

  const youAreA = duel.trader_a?.username === me?.username;
  const youAreB = duel.trader_b?.username === me?.username;
  const isParticipant = youAreA || youAreB;
  const youName = youAreA ? duel.trader_a?.username : duel.trader_b?.username;
  const opName = youAreA ? duel.trader_b?.username : duel.trader_a?.username;
  const youPnl = youAreA ? duel.pnl_a : duel.pnl_b;
  const opPnl = youAreA ? duel.pnl_b : duel.pnl_a;

  // MT5 3-min login window: shows for participants while trading hasn't started AND not dismissed
  const showMt5 = isParticipant && !duel.trading_started_at && !mt5Dismissed;
  const myConfirmed = youAreA ? !!duel.login_confirmed_a : !!duel.login_confirmed_b;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg)] overflow-y-auto" data-testid="match-page">
      <Mt5LoginDialog
        open={showMt5}
        duelId={duel.id}
        startedAt={duel.started_at}
        myConfirmed={myConfirmed}
        opConfirmed={youAreA ? !!duel.login_confirmed_b : !!duel.login_confirmed_a}
        accountSize={duel.account_size}
        opName={opName}
        onClose={() => setMt5Dismissed(true)}
        onExitMatch={() => navigate("/app/duel")}
      />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 grid place-items-center rounded-full bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--bg-soft)]" data-testid="match-close"><X className="w-4 h-4" /></button>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Duel {duel.id}</div>
              <div className="text-[15px] font-semibold text-[var(--ink)]">${duel.account_size.toLocaleString()} account</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Time left</div>
              <div className="font-mono text-2xl md:text-3xl font-semibold tracking-tight text-[var(--ink)]" data-testid="match-timer">{formatTime(duel.time_left_seconds)}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[var(--inverse)] text-[var(--inverse-fg)] px-3 py-1.5 rounded-full text-[11px] font-medium"><Eye className="w-3 h-3" /> {duel.spectators}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-5">
          <TraderColumn name={youName || "—"} pnl={youPnl} you balance={duel.account_size + youPnl} color="#10B981" series={duel.equity_series || []} sideKey="a" />
          <TraderColumn name={opName || "—"} pnl={opPnl} balance={duel.account_size + opPnl} color="#A78BFA" series={duel.equity_series || []} sideKey="b" />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-5" data-testid="match-chart">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-semibold text-[var(--ink)]">Equity over time</div>
            <div className="flex items-center gap-4 text-[12px] font-mono">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-[#10B981] rounded-full" /> @{duel.trader_a?.username}</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 bg-[#A78BFA] rounded-full" /> @{duel.trader_b?.username}</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={duel.equity_series || []} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.35} /><stop offset="100%" stopColor="#10B981" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A78BFA" stopOpacity={0.3} /><stop offset="100%" stopColor="#A78BFA" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="i" hide />
                <YAxis stroke="var(--muted-2)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0F0F12", border: "none", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="a" stroke="#10B981" strokeWidth={2} fill="url(#g-a)" isAnimationActive={false} />
                <Area type="monotone" dataKey="b" stroke="#A78BFA" strokeWidth={2} fill="url(#g-b)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-[var(--ink)]" /><div className="text-base font-semibold text-[var(--ink)]">Recent trades</div></div>
          <table className="w-full text-[13px] min-w-[640px]">
            <thead className="text-[var(--muted-2)] text-[11px]"><tr><th className="text-left font-medium py-2 pr-4">Side</th><th className="text-left font-medium py-2 pr-4">Instrument</th><th className="text-left font-medium py-2 pr-4">Size</th><th className="text-right font-medium py-2 pr-4">Entry</th><th className="text-right font-medium py-2 pr-4">Exit</th><th className="text-right font-medium py-2">P&amp;L</th></tr></thead>
            <tbody className="font-mono">
              {sampleTrades.map((t, i) => (
                <tr key={i} className="border-t border-[var(--border-soft)]">
                  <td className="py-3 pr-4"><span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${t.side === "buy" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#EF4444]/10 text-[#EF4444]"}`}>{t.side}</span></td>
                  <td className="py-3 pr-4 text-[var(--ink)] font-semibold">{t.instrument}</td>
                  <td className="py-3 pr-4 text-[var(--ink-soft)]">{t.size}</td>
                  <td className="py-3 pr-4 text-right">{t.entry}</td>
                  <td className="py-3 pr-4 text-right">{t.exit}</td>
                  <td className={`py-3 text-right font-semibold ${t.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{t.pnl >= 0 ? "+" : "−"}${Math.abs(t.pnl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function TraderColumn({ name, pnl, you, balance, color, series, sideKey }) {
  return (
    <div className={`rounded-2xl p-5 border ${you ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-[var(--surface)] border-[var(--border)]"}`} data-testid={`trader-col-${name.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full grid place-items-center font-bold ${you ? "bg-[#B4E04C] text-[#0F0F12]" : "bg-[var(--inverse)] text-[var(--inverse-fg)]"}`}>{name[0]}</div>
          <div>
            <div className="text-[14px] font-semibold">@{name}</div>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${you ? "text-white/40" : "text-[var(--muted-2)]"}`}>{you ? "You" : "Opponent"}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-mono uppercase tracking-wider ${you ? "text-white/40" : "text-[var(--muted-2)]"}`}>Equity</div>
          <div className="font-mono text-base font-semibold tracking-tight">${balance.toLocaleString()}</div>
        </div>
      </div>
      <div className={`font-mono text-4xl font-semibold tracking-tight flex items-center gap-2 ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
        {pnl >= 0 ? <ArrowUpRight className="w-7 h-7" strokeWidth={2.5} /> : <ArrowDownRight className="w-7 h-7" strokeWidth={2.5} />}
        {pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}
      </div>
      <div className={`mt-1 text-[12px] font-mono ${you ? "text-white/40" : "text-[var(--muted)]"}`}>P&amp;L · since open</div>
      <div className="mt-4 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <defs><linearGradient id={`tc-${sideKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.4} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
            <YAxis hide />
            <Area type="monotone" dataKey={sideKey} stroke={color} strokeWidth={2} fill={`url(#tc-${sideKey})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ------------- MT5 login dialog with 3-minute countdown -------------
function Mt5LoginDialog({ open, duelId, startedAt, myConfirmed, opConfirmed, accountSize, opName, onClose, onExitMatch }) {
  const [creds, setCreds] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!open || !duelId) return undefined;
    let cancelled = false;
    getMt5Creds(duelId).then((r) => { if (!cancelled) setCreds(r); }).catch(() => {});
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { cancelled = true; clearInterval(t); };
  }, [open, duelId]);

  if (!open) return null;
  const start = startedAt ? new Date(startedAt).getTime() : now;
  const deadline = start + 180_000; // 3 minutes
  const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
  const minsStr = String(Math.floor(remaining / 60));
  const secsStr = String(remaining % 60).padStart(2, "0");
  const expired = remaining === 0;
  const progress = Math.min(100, ((180 - remaining) / 180) * 100);

  const copy = (txt, label) => {
    navigator.clipboard.writeText(txt);
    toast.success(`${label} copied`);
  };

  const onConfirm = async () => {
    setConfirming(true);
    try {
      await confirmMt5Login(duelId);
      toast.success("Login confirmed. You can close this and watch the chart while waiting for your opponent.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent
        data-testid="mt5-dialog"
        className="max-w-xl rounded-3xl border-[var(--border)] bg-[var(--surface)] p-0 overflow-hidden"
      >
        <div className="bg-[#0F0F12] text-white px-6 py-5 relative">
          <button
            onClick={() => onClose?.()}
            data-testid="mt5-dialog-close"
            className="absolute top-4 right-4 w-8 h-8 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close MT5 dialog"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <DialogHeader className="text-left pr-10">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">
              <Server className="w-3 h-3" /> Trading account · MetaTrader 5
            </div>
            <DialogTitle className="text-white text-xl mt-2">Confirm your login to start</DialogTitle>
            <DialogDescription className="text-white/60 text-[13px]">
              Both traders must confirm within 3 minutes. Your ${accountSize?.toLocaleString()} duel against @{opName} starts as soon as both confirm.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Login window</div>
              <div className={`font-mono text-3xl font-bold tracking-tight ${expired ? "text-[#EF4444]" : remaining < 60 ? "text-[#EF4444]" : "text-[var(--ink)]"}`} data-testid="mt5-countdown">
                {minsStr}:{secsStr}
              </div>
            </div>
            <div className="h-1.5 bg-[var(--border-soft)] rounded-full overflow-hidden">
              <div className={`h-full transition-all ${expired ? "bg-[#EF4444]" : "bg-[#B4E04C]"}`} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border)]">
            <CredRow icon={Lock} label="Login" value={creds?.login || "—"} onCopy={() => copy(creds?.login, "Login")} testId="mt5-login" />
            <CredRow icon={ShieldCheck} label="Password" value={creds?.password || "—"} mono onCopy={() => copy(creds?.password, "Password")} testId="mt5-password" />
            <CredRow icon={Server} label="Server" value={creds?.server || "—"} onCopy={() => copy(creds?.server, "Server")} testId="mt5-server" />
            <CredRow icon={ClockIcon} label="Platform" value={creds?.platform || "MetaTrader 5"} testId="mt5-platform" />
          </div>

          <div className="flex items-center gap-3 text-[12px]">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${myConfirmed ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[var(--tag)] text-[var(--muted)]"}`} data-testid="mt5-you-status">
              <span className={`w-1.5 h-1.5 rounded-full ${myConfirmed ? "bg-[#10B981]" : "bg-[var(--muted-2)]"}`} />
              You {myConfirmed ? "confirmed" : "pending"}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${opConfirmed ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[var(--tag)] text-[var(--muted)]"}`} data-testid="mt5-op-status">
              <span className={`w-1.5 h-1.5 rounded-full ${opConfirmed ? "bg-[#10B981]" : "bg-[var(--muted-2)]"}`} />
              @{opName || "Opponent"} {opConfirmed ? "confirmed" : "pending"}
            </span>
          </div>

          <button
            onClick={onConfirm}
            disabled={confirming || myConfirmed || expired}
            data-testid="mt5-confirm-btn"
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[14px] font-semibold py-3.5 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {myConfirmed ? "Login confirmed · waiting for opponent" : confirming ? "Confirming…" : expired ? "Window expired" : "I've logged in — confirm"}
            {!myConfirmed && !expired && <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full" />}
          </button>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => onExitMatch?.()}
              data-testid="mt5-exit-match"
              className="text-[12px] font-medium text-[var(--muted)] hover:text-[#EF4444] transition-colors"
            >
              Exit match
            </button>
            {myConfirmed && (
              <button
                onClick={() => onClose?.()}
                data-testid="mt5-watch-chart"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--ink)] hover:gap-2 transition-all"
              >
                Watch the chart while you wait →
              </button>
            )}
          </div>
          {expired && !myConfirmed && (
            <div className="text-[12px] text-[#EF4444] text-center font-medium">3-minute window expired. This duel may be voided by an admin.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CredRow({ icon: Icon, label, value, mono, onCopy, testId }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3" data-testid={testId}>
      <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] grid place-items-center text-[var(--ink)]">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">{label}</div>
        <div className={`text-[14px] text-[var(--ink)] font-semibold ${mono ? "font-mono tracking-wide" : ""} truncate`}>{value}</div>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-[var(--bg-soft)] text-[var(--muted)]">
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

