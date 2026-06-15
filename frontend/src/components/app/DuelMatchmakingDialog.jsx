import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Sparkles, Check, X, Wallet, ShieldCheck, KeyRound, Copy, AlertCircle, Loader2, Bot } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { enterDuel, getQueueState, cancelQueue, readyDuel, getMt5Creds, confirmMt5Login, getMe } from "@/lib/api";

/**
 * Multi-step 1v1 Duel matchmaking flow:
 *   confirm → queueing (5m) → paired (ready up, 3m) → starting (MT5 + 3m countdown) → live (navigate)
 *
 * Drives itself via short polling (2s) once a duel exists.
 */
export default function DuelMatchmakingDialog({ open, account, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("confirm"); // confirm | entering | queueing | paired | starting | cancelled
  const [duelId, setDuelId] = useState(null);
  const [state, setState] = useState(null); // queue state from server
  const [me, setMe] = useState(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const pollRef = useRef(null);

  // Local 1s tick for countdowns
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load current user (for balance display)
  useEffect(() => {
    if (open) {
      getMe().then(setMe).catch(() => {});
      setStep("confirm");
      setDuelId(null);
      setState(null);
    }
  }, [open]);

  // Poll queue state while a duel is in flight
  const tick = useCallback(async (id) => {
    try {
      const s = await getQueueState(id);
      setState(s);
      if (s.status === "queueing") setStep("queueing");
      else if (s.status === "paired") setStep("paired");
      else if (s.status === "starting") setStep("starting");
      else if (s.status === "live") {
        // Trading has begun
        clearInterval(pollRef.current);
        pollRef.current = null;
        toast.success("Match is live — good luck!");
        onClose?.();
        navigate(`/app/match/${id}`);
      } else if (s.status === "cancelled") {
        clearInterval(pollRef.current);
        pollRef.current = null;
        setStep("cancelled");
      }
    } catch (e) {
      // Don't spam toasts
    }
  }, [navigate, onClose]);

  useEffect(() => {
    if (!duelId) return;
    tick(duelId); // immediate
    pollRef.current = setInterval(() => tick(duelId), 2000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); pollRef.current = null; };
  }, [duelId, tick]);

  const handlePay = async () => {
    if (!account) return;
    setBusy(true);
    try {
      const res = await enterDuel(account.size);
      setDuelId(res.duel_id);
      setStep(res.status === "paired" ? "paired" : "queueing");
      toast.success(`Paid $${account.entry} — ${res.status === "paired" ? "opponent found!" : "searching for opponent…"}`);
    } catch (e) {
      toast.error(e.message);
      onClose?.();
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!duelId) { onClose?.(); return; }
    setBusy(true);
    try {
      await cancelQueue(duelId);
      toast.message("Queue cancelled — entry fee refunded");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
      onClose?.();
    }
  };

  const handleReady = async () => {
    if (!duelId) return;
    setBusy(true);
    try {
      const s = await readyDuel(duelId);
      setState(s);
      toast.success("You're ready. Waiting for opponent…");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose?.()}>
      <DialogContent className="max-w-md rounded-3xl border-[var(--border)] bg-[var(--surface)]" data-testid="matchmaking-dialog">
        <DialogHeader>
          <DialogTitle className="text-[var(--ink)] text-xl">1v1 Duel Matchmaking</DialogTitle>
          <DialogDescription className="text-[var(--muted)]">
            {account ? `$${account.size.toLocaleString()} account · $${account.entry} entry · $${account.prize} prize` : ""}
          </DialogDescription>
        </DialogHeader>

        {step === "confirm" && (
          <ConfirmStep account={account} me={me} onCancel={() => onClose?.()} onPay={handlePay} busy={busy} />
        )}
        {step === "queueing" && (
          <QueueingStep state={state} now={now} onCancel={handleCancel} busy={busy} />
        )}
        {step === "paired" && (
          <PairedStep state={state} now={now} onReady={handleReady} busy={busy} />
        )}
        {step === "starting" && (
          <StartingStep state={state} now={now} duelId={duelId} />
        )}
        {step === "cancelled" && (
          <CancelledStep state={state} onClose={() => onClose?.()} />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---- Steps ----

function ConfirmStep({ account, me, onCancel, onPay, busy }) {
  const balance = me?.balance ?? 0;
  const insufficient = account && balance < account.entry;
  return (
    <div className="py-2 space-y-5" data-testid="step-confirm">
      <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-4 space-y-3">
        <Row k="Wallet balance" v={`$${balance.toLocaleString()}`} />
        <Row k="Entry fee" v={`−$${account?.entry || 0}`} negative />
        <div className="h-px bg-[var(--border-soft)]" />
        <Row k="Balance after" v={`$${Math.max(0, balance - (account?.entry || 0)).toLocaleString()}`} bold />
      </div>
      <div className="text-[12.5px] text-[var(--muted)] leading-relaxed">
        Tapping <strong className="text-[var(--ink)]">Pay & enter queue</strong> deducts the entry fee from your wallet. You'll be matched with an opponent within 5 minutes — if none is found, you'll be paired with an AI opponent.
      </div>
      {insufficient && (
        <div className="flex items-start gap-2 bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl p-3 text-[12.5px] text-[#991B1B]" data-testid="insufficient-balance">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Insufficient balance. Top up your wallet to enter this duel.</span>
        </div>
      )}
      <div className="flex gap-2">
        <button data-testid="confirm-cancel" onClick={onCancel} disabled={busy}
          className="flex-1 inline-flex items-center justify-center gap-2 text-[13px] font-medium px-4 py-2.5 rounded-full border border-[var(--border)] hover:bg-[var(--bg-soft)] disabled:opacity-50">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button data-testid="confirm-pay" onClick={onPay} disabled={busy || insufficient}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-50">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
          Pay &amp; enter queue
        </button>
      </div>
    </div>
  );
}

function QueueingStep({ state, now, onCancel, busy }) {
  const remaining = useRemaining(state?.pairing_expires_at, now);
  return (
    <div className="py-6 text-center space-y-4" data-testid="step-queueing">
      <div className="mx-auto w-20 h-20 rounded-full bg-[var(--lime-soft)] grid place-items-center relative">
        <div className="absolute inset-0 rounded-full border-2 border-[#B4E04C] animate-ping opacity-40" />
        <Clock className="w-7 h-7 text-[var(--ink)]" />
      </div>
      <div>
        <div className="font-mono text-3xl font-semibold text-[var(--ink)]" data-testid="queue-countdown">{formatMs(remaining)}</div>
        <div className="mt-2 text-[14px] text-[var(--body)]">Searching for an opponent…</div>
        <div className="mt-1 text-[12px] text-[var(--muted)]">If no peer is found, you'll be paired with an AI opponent.</div>
      </div>
      <button data-testid="queue-cancel" onClick={onCancel} disabled={busy}
        className="inline-flex items-center justify-center gap-2 text-[13px] font-medium px-5 py-2 rounded-full border border-[var(--border)] hover:bg-[var(--bg-soft)] disabled:opacity-50">
        <X className="w-3.5 h-3.5" /> Cancel &amp; refund
      </button>
    </div>
  );
}

function PairedStep({ state, now, onReady, busy }) {
  const remaining = useRemaining(state?.ready_deadline, now);
  const youReady = state?.you_ready;
  const oppReady = state?.opponent_ready;
  const opp = state?.opponent;
  return (
    <div className="py-2 space-y-4" data-testid="step-paired">
      <div className="bg-[var(--purple-soft)] border border-[#A78BFA]/40 rounded-2xl p-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#A78BFA] text-white px-2 py-0.5 rounded-full mb-3">
          <Sparkles className="w-3 h-3" /> Opponent found
        </div>
        <div className="text-[15px] font-semibold text-[var(--ink)]">@{opp?.username || "—"}</div>
        <div className="text-[12px] text-[var(--muted)] mt-0.5 flex items-center justify-center gap-1.5">
          {opp?.is_bot && <Bot className="w-3 h-3" />}
          {opp?.tier} · {opp?.is_bot ? "AI opponent" : "Live trader"}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ReadyTile name="You" ready={youReady} />
        <ReadyTile name={`@${opp?.username || "Opponent"}`} ready={oppReady} />
      </div>
      <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl p-3 text-center">
        <div className="text-[11px] uppercase tracking-wider font-mono text-[var(--muted-2)]">Ready up before</div>
        <div className="font-mono text-2xl font-semibold text-[var(--ink)]" data-testid="ready-countdown">{formatMs(remaining)}</div>
        <div className="text-[11px] text-[var(--muted)] mt-1">If anyone doesn't ready up in time, the match is cancelled &amp; refunded.</div>
      </div>
      <button data-testid="ready-btn" onClick={onReady} disabled={busy || youReady}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[14px] font-semibold py-3 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-50">
        {youReady ? <><Check className="w-4 h-4" /> You're ready — waiting for opponent</> : <><ShieldCheck className="w-4 h-4" /> I'm ready</>}
      </button>
    </div>
  );
}

function StartingStep({ state, now, duelId }) {
  const remaining = useRemaining(state?.trade_starts_at, now);
  const [creds, setCreds] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (duelId) {
      getMt5Creds(duelId).then(setCreds).catch(() => {});
    }
  }, [duelId]);

  const copy = (txt, label) => {
    navigator.clipboard?.writeText(txt);
    toast.success(`${label} copied`);
  };

  const onConfirm = async () => {
    try {
      await confirmMt5Login(duelId);
      setConfirmed(true);
      toast.success("Login confirmed");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="py-2 space-y-4" data-testid="step-starting">
      <div className="bg-[#0F0F12] text-white rounded-2xl p-4 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#B4E04C] rounded-full blur-[60px] opacity-20" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#B4E04C] text-[#0F0F12] px-2 py-0.5 rounded-full mb-3">
            <KeyRound className="w-3 h-3" /> Trading account ready
          </div>
          <div className="text-[11px] uppercase tracking-wider font-mono text-white/60">Trading begins in</div>
          <div className="font-mono text-4xl font-bold mt-1" data-testid="trade-countdown">{formatMs(remaining)}</div>
          <div className="text-[11.5px] text-white/70 mt-1.5">Log in to MetaTrader 5 now using the credentials below.</div>
        </div>
      </div>

      <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-2xl p-4 space-y-2.5" data-testid="mt5-creds">
        <CredRow label="Platform" value={creds?.platform || "—"} />
        <CredRow label="Server" value={creds?.server || "—"} copyable onCopy={() => copy(creds.server, "Server")} />
        <CredRow label="Login" value={creds?.login || "—"} copyable onCopy={() => copy(creds.login, "Login")} mono />
        <CredRow label="Password" value={creds?.password || "—"} copyable onCopy={() => copy(creds.password, "Password")} mono />
      </div>

      <button data-testid="confirm-login-btn" onClick={onConfirm} disabled={confirmed}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-semibold py-2.5 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-50">
        {confirmed ? <><Check className="w-3.5 h-3.5" /> Logged in</> : <><ShieldCheck className="w-3.5 h-3.5" /> I've logged in to MT5</>}
      </button>
    </div>
  );
}

function CancelledStep({ state, onClose }) {
  return (
    <div className="py-6 text-center space-y-3" data-testid="step-cancelled">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#FEE2E2] grid place-items-center">
        <X className="w-6 h-6 text-[#991B1B]" />
      </div>
      <div className="text-lg font-semibold text-[var(--ink)]">Match cancelled</div>
      <div className="text-[13px] text-[var(--muted)] max-w-xs mx-auto">{state?.void_reason || "The match was cancelled. Your entry fee has been refunded."}</div>
      <button onClick={onClose} className="inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-semibold px-5 py-2 rounded-full hover:bg-[var(--ink-soft)]">
        Close
      </button>
    </div>
  );
}

// ---- Bits ----

function Row({ k, v, bold, negative }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[13px] ${bold ? "text-[var(--ink)] font-semibold" : "text-[var(--muted)]"}`}>{k}</span>
      <span className={`font-mono text-[13.5px] ${bold ? "text-[var(--ink)] font-semibold" : negative ? "text-[#EF4444]" : "text-[var(--ink)]"}`}>{v}</span>
    </div>
  );
}

function ReadyTile({ name, ready }) {
  return (
    <div className={`rounded-xl p-3 border text-center ${ready ? "bg-[#DCFCE7] border-[#86EFAC]" : "bg-[var(--bg)] border-[var(--border-soft)]"}`}>
      <div className={`mx-auto w-8 h-8 rounded-full grid place-items-center mb-1 ${ready ? "bg-[#16A34A] text-white" : "bg-[var(--tag)] text-[var(--muted-2)]"}`}>
        {ready ? <Check className="w-4 h-4" strokeWidth={3} /> : <Loader2 className="w-4 h-4 animate-spin" />}
      </div>
      <div className="text-[12.5px] font-medium text-[var(--ink)] truncate">{name}</div>
      <div className="text-[10.5px] text-[var(--muted)]">{ready ? "Ready" : "Waiting…"}</div>
    </div>
  );
}

function CredRow({ label, value, copyable, onCopy, mono }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11.5px] uppercase tracking-wider font-mono text-[var(--muted-2)]">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-[13px] text-[var(--ink)] ${mono ? "font-mono" : ""}`}>{value}</span>
        {copyable && (
          <button onClick={onCopy} className="text-[var(--muted-2)] hover:text-[var(--ink)]" data-testid={`copy-${label.toLowerCase()}`}>
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---- Helpers ----

function useRemaining(isoTs, nowMs) {
  if (!isoTs) return 0;
  const target = new Date(isoTs).getTime();
  return Math.max(0, target - nowMs);
}

function formatMs(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
