import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ArrowRight, Sparkles, Lock, Clock, Hourglass, Radio } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetch } from "@/lib/useFetch";
import { listLiveDuels, listOpenDuels, spawnJoin, createCustomDuel, getMe } from "@/lib/api";

const accountSizes = [
  { size: 5000, entry: 60, prize: 100 },
  { size: 10000, entry: 125, prize: 200 },
  { size: 25000, entry: 280, prize: 500 },
  { size: 50000, entry: 550, prize: 1000 },
  { size: 100000, entry: 1100, prize: 2000 },
  { size: 250000, entry: 2800, prize: 5000 },
  { size: 500000, entry: 5500, prize: 10000 },
  { size: 1000000, entry: 11000, prize: 20000 },
];

export default function Duel() {
  const navigate = useNavigate();
  const { data: liveDuelsRaw } = useFetch(listLiveDuels, { pollMs: 3000 });
  const { data: openDuelsRaw } = useFetch(listOpenDuels, { pollMs: 3000 });
  const liveDuels = liveDuelsRaw || [];
  const openDuels = openDuelsRaw || [];
  const { data: me } = useFetch(getMe);
  const [spawnOpen, setSpawnOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [phase, setPhase] = useState("idle");

  const isPro = me?.plan === "PRO";

  // Four ordered lanes as requested:
  // 1. Open Pro Duels  2. Open Standard Duels  3. Live Pro Duels  4. Live Standard Duels
  const lanes = useMemo(() => [
    { key: "open-pro", title: "Open Pro Duels", subtitle: "Custom rules. Waiting for a challenger.", tone: "pro", state: "open", items: openDuels.filter((d) => d.custom) },
    { key: "open-standard", title: "Open Standard Duels", subtitle: "Standard rules. Waiting to pair.", tone: "standard", state: "open", items: openDuels.filter((d) => !d.custom) },
    { key: "live-pro", title: "Live Pro Duels", subtitle: "Custom rules. In progress.", tone: "pro", state: "live", items: liveDuels.filter((d) => d.custom) },
    { key: "live-standard", title: "Live Standard Duels", subtitle: "Standard rules. In progress.", tone: "standard", state: "live", items: liveDuels.filter((d) => !d.custom) },
  ], [openDuels, liveDuels]);

  const startSpawn = async (acc) => {
    setSelectedAccount(acc);
    setSpawnOpen(true);
    setPhase("searching");
    try {
      setTimeout(async () => {
        const res = await spawnJoin(acc.size);
        setPhase("paired");
        setTimeout(() => setPhase("activating"), 1500);
        setTimeout(() => setPhase("starting"), 3000);
        setTimeout(() => {
          setSpawnOpen(false);
          setPhase("idle");
          toast.success(`Your $${acc.size.toLocaleString()} duel is live!`);
          navigate(`/app/match/${res.duel_id}`);
        }, 5000);
      }, 2000);
    } catch (e) {
      toast.error(e.message);
      setSpawnOpen(false);
      setPhase("idle");
    }
  };

  return (
    <div data-testid="duel-page" className="space-y-8">
      <PageHeader eyebrow="Compete" title="1v1 Duel Centre" description="Spectate live duels, enter the spawn queue, or create a custom duel." />

      <Tabs defaultValue="broadcast" className="w-full">
        <TabsList className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 inline-flex h-auto" data-testid="duel-tabs">
          <TabsTrigger value="broadcast" className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[var(--inverse)] data-[state=active]:text-[var(--inverse-fg)]" data-testid="tab-broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="spawn" className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[var(--inverse)] data-[state=active]:text-[var(--inverse-fg)]" data-testid="tab-spawn">Spawn centre</TabsTrigger>
          <TabsTrigger value="create" className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[var(--inverse)] data-[state=active]:text-[var(--inverse-fg)]" data-testid="tab-create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="broadcast" className="mt-6 space-y-10" data-testid="broadcast-lanes">
          {lanes.map((lane) => (
            <DuelLane key={lane.key} lane={lane} onJoin={(m) => navigate(`/app/match/${m.id}`)} />
          ))}
        </TabsContent>

        <TabsContent value="spawn" className="mt-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--lime-soft)] grid place-items-center"><Clock className="w-5 h-5 text-[var(--ink)]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[var(--ink)]">How spawning works</div>
                <p className="text-[13px] text-[var(--body)] mt-1 max-w-xl">Pick an account size and pay the entry fee. We pair you within 5 minutes. Both traders accept, accounts activate, then a 60-second countdown begins.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="spawn-grid">
            {accountSizes.map((a) => (
              <button key={a.size} onClick={() => startSpawn(a)} data-testid={`spawn-card-${a.size}`} className="text-left bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(15,15,18,0.1)] transition-all">
                <div className="font-mono text-2xl font-semibold text-[var(--ink)] tracking-tight">${a.size >= 1000000 ? "1M" : `${a.size / 1000}K`}</div>
                <div className="mt-2 text-xs text-[var(--muted)] font-mono">Entry ${a.entry} · Prize <span className="text-[#10B981] font-semibold">${a.prize}</span></div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--muted)]">Tap to join queue</span>
                  <span className="text-[11px] font-medium text-[var(--ink)]">Join →</span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          {isPro ? <CreateDuelForm /> : <UpgradeGate />}
        </TabsContent>
      </Tabs>

      <SpawnDialog open={spawnOpen} onClose={() => { setSpawnOpen(false); setPhase("idle"); }} phase={phase} account={selectedAccount} />
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Trader({ name, pnl }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] text-[10px] grid place-items-center font-bold">{name[0]}</span>
        <span className="text-[13px] font-medium text-[var(--ink)]">@{name}</span>
      </div>
      <span className={`font-mono text-sm font-semibold ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
        {pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}
      </span>
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl px-3 py-2">
      <div className="text-[10px] font-mono text-[var(--muted-2)] uppercase tracking-wider">{label}</div>
      <div className="text-[13px] font-mono font-semibold text-[var(--ink)]">{value}</div>
    </div>
  );
}

function SpawnDialog({ open, onClose, phase, account }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-[var(--border)] bg-[var(--surface)]" data-testid="spawn-dialog">
        <DialogHeader>
          <DialogTitle className="text-[var(--ink)] text-xl">Spawn Centre</DialogTitle>
          <DialogDescription className="text-[var(--muted)]">
            {account ? `$${account.size.toLocaleString()} account · $${account.entry} entry` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center">
          {phase === "searching" && (<><div className="mx-auto w-20 h-20 rounded-full bg-[var(--lime-soft)] grid place-items-center mb-4 relative"><div className="absolute inset-0 rounded-full border-2 border-[#B4E04C] animate-ping opacity-40" /><Clock className="w-7 h-7 text-[var(--ink)]" /></div><div className="font-mono text-2xl font-semibold text-[var(--ink)]">04:58</div><div className="mt-2 text-[14px] text-[var(--body)]">Searching for an opponent…</div></>)}
          {phase === "paired" && (<><div className="mx-auto w-20 h-20 rounded-full bg-[var(--purple-soft)] grid place-items-center mb-4"><Sparkles className="w-7 h-7 text-[#7C3AED]" /></div><div className="text-lg font-semibold text-[var(--ink)]">Opponent found</div><div className="mt-2 text-[14px] text-[var(--body)]">Waiting for acceptance…</div></>)}
          {phase === "activating" && (<><div className="mx-auto w-20 h-20 rounded-full bg-[#0F0F12] text-[#B4E04C] grid place-items-center mb-4"><Lock className="w-7 h-7" /></div><div className="text-lg font-semibold text-[var(--ink)]">Both traders confirmed</div><div className="mt-2 text-[14px] text-[var(--body)]">Activating your trading account…</div></>)}
          {phase === "starting" && (<><div className="mx-auto w-20 h-20 rounded-full bg-[#B4E04C] grid place-items-center mb-4"><ArrowRight className="w-7 h-7 text-[var(--ink)]" strokeWidth={2.5} /></div><div className="font-mono text-3xl font-semibold text-[var(--ink)]">0:60</div><div className="mt-2 text-[14px] text-[var(--body)]">Trading begins in…</div></>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpgradeGate() {
  const navigate = useNavigate();
  return (
    <div data-dark className="bg-[#0F0F12] text-white rounded-2xl p-10 lg:p-16 text-center relative overflow-hidden" data-testid="duel-upgrade-gate">
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#A78BFA] rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="relative max-w-xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#A78BFA] grid place-items-center mb-5"><Sparkles className="w-6 h-6 text-white" /></div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Creating custom duels is a Pro feature.</h3>
        <p className="mt-3 text-white/70">Set your own leverage, drawdown rules, account size, timeline and instruments.</p>
        <button onClick={() => navigate("/app/settings")} className="mt-6 inline-flex items-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[14px] px-6 py-3 rounded-full hover:bg-[var(--surface)]">Upgrade to Pro <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></button>
      </div>
    </div>
  );
}

function CreateDuelForm() {
  const [accountSize, setAccountSize] = useState("100000");
  const [entry, setEntry] = useState(1100);
  const [leverage, setLeverage] = useState("1:100");
  const [dailyDD, setDailyDD] = useState([10]);
  const [maxDD, setMaxDD] = useState([20]);
  const [instruments, setInstruments] = useState("All");
  const [accountType, setAccountType] = useState("Swap-Free");
  const [spreadType, setSpreadType] = useState("Raw spread");
  const [timeline, setTimeline] = useState("24h");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await createCustomDuel({
        account_size: Number(accountSize), entry_fee: Number(entry), timeline,
        leverage, daily_dd: dailyDD[0], max_dd: maxDD[0], instruments,
        account_type: accountType, spread_type: spreadType,
      });
      toast.success(`Custom duel ${res.duel_id} created — awaiting an opponent`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5" data-testid="create-duel-form">
      <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-6">
        <Field label="Account size">
          <Select value={accountSize} onValueChange={setAccountSize}>
            <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{accountSizes.map((a) => (<SelectItem key={a.size} value={String(a.size)}>${a.size.toLocaleString()}</SelectItem>))}</SelectContent>
          </Select>
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Entry fee (USD)">
            <input type="number" value={entry} onChange={(e) => setEntry(Number(e.target.value))} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 font-mono text-[14px] focus:outline-none focus:border-[var(--ink)]" />
          </Field>
          <Field label="Trading timeline">
            <Select value={timeline} onValueChange={setTimeline}>
              <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{["1h", "4h", "24h", "36h", "48h", "72h"].map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Leverage">
          <div className="flex flex-wrap gap-2">
            {["1:10", "1:25", "1:50", "1:100", "1:200", "1:500"].map((l) => (
              <button key={l} onClick={() => setLeverage(l)} className={`text-[13px] px-3 py-1.5 rounded-full border ${leverage === l ? "bg-[var(--inverse)] text-[var(--inverse-fg)] border-[var(--ink)]" : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-soft)] hover:bg-[var(--bg-soft)]"}`}>{l}</button>
            ))}
          </div>
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label={`Daily drawdown: ${dailyDD[0]}%`}><Slider value={dailyDD} onValueChange={setDailyDD} max={20} step={1} className="mt-2" /></Field>
          <Field label={`Max overall drawdown: ${maxDD[0]}%`}><Slider value={maxDD} onValueChange={setMaxDD} max={30} step={1} className="mt-2" /></Field>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Instruments">
            <Select value={instruments} onValueChange={setInstruments}>
              <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{["All", "Forex", "Crypto", "Stocks/Indices", "Commodities"].map((i) => (<SelectItem key={i} value={i}>{i}</SelectItem>))}</SelectContent>
            </Select>
          </Field>
          <Field label="Account type">
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Swap">Swap</SelectItem><SelectItem value="Swap-Free">Swap-Free</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Spread">
            <Select value={spreadType} onValueChange={setSpreadType}>
              <SelectTrigger className="bg-[var(--bg)] border-[var(--border)] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Raw spread">Raw spread</SelectItem><SelectItem value="Commission">Commission-based</SelectItem></SelectContent>
            </Select>
          </Field>
        </div>
        <button onClick={handleCreate} disabled={submitting} data-testid="create-duel-submit" className="inline-flex items-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-50">
          {submitting ? "Creating..." : "Create custom duel"}
          <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[var(--ink)]"><ArrowRight className="w-3 h-3" strokeWidth={2.5} /></span>
        </button>
      </div>
      <div className="bg-gradient-to-br from-[var(--purple-soft)] to-[var(--bg)] border border-[#A78BFA]/40 rounded-2xl p-6 h-fit sticky top-24">
        <div className="text-[10px] font-bold uppercase tracking-wider bg-[#A78BFA] text-white px-2 py-1 rounded-full inline-flex items-center gap-1 mb-4"><Sparkles className="w-3 h-3" /> Live preview</div>
        <div className="font-mono text-2xl font-semibold text-[var(--ink)]">${Number(accountSize).toLocaleString()}</div>
        <div className="mt-1 text-xs font-mono text-[var(--muted)]">Custom Pro Duel</div>
        <div className="mt-5 space-y-2 text-[13px]">
          <Row k="Entry fee" v={`$${entry}`} />
          <Row k="Timeline" v={timeline} />
          <Row k="Leverage" v={leverage} />
          <Row k="Daily DD" v={`${dailyDD[0]}%`} />
          <Row k="Max DD" v={`${maxDD[0]}%`} />
          <Row k="Instruments" v={instruments} />
          <Row k="Account" v={accountType} />
          <Row k="Spread" v={spreadType} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="block text-[12px] font-medium text-[var(--ink)] mb-2">{label}</label>{children}</div>;
}

function Row({ k, v }) {
  return <div className="flex items-center justify-between border-b border-[#A78BFA]/15 pb-2"><span className="text-[var(--muted)]">{k}</span><span className="font-mono font-semibold text-[var(--ink)]">{v}</span></div>;
}

function DuelLane({ lane, onJoin }) {
  const isPro = lane.tone === "pro";
  const isLive = lane.state === "live";
  return (
    <div data-testid={`lane-${lane.key}`}>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isPro ? "bg-[#A78BFA] text-[var(--inverse-fg)]" : "bg-[var(--inverse)] text-[var(--inverse-fg)]"}`}>
              {isPro ? <><Sparkles className="w-2.5 h-2.5" /> Pro</> : "Standard"}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${isLive ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[var(--lime-soft)] text-[var(--ink)]"}`}>
              {isLive ? <><Radio className="w-2.5 h-2.5" /> LIVE</> : <><Hourglass className="w-2.5 h-2.5" /> OPEN</>}
            </span>
            <span className="text-[11px] font-mono text-[var(--muted-2)]">{lane.items.length}</span>
          </div>
          <h3 className="text-lg font-bold tracking-tight text-[var(--ink)]">{lane.title}</h3>
          <div className="text-[12.5px] text-[var(--muted)]">{lane.subtitle}</div>
        </div>
      </div>

      {lane.items.length === 0 ? (
        <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl p-8 text-center">
          <div className="text-[13px] text-[var(--muted)]">
            No {lane.state === "open" ? "open" : "live"} {isPro ? "Pro" : "Standard"} duels right now.
            {lane.state === "open" && (isPro ? " Be the first to create one in the Create tab." : " Hit Spawn centre to start one.")}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lane.items.map((m) => (
            <DuelCard key={m.id} m={m} isLive={isLive} isPro={isPro} onJoin={onJoin} />
          ))}
        </div>
      )}
    </div>
  );
}

function DuelCard({ m, isLive, isPro, onJoin }) {
  return (
    <div
      data-testid={`broadcast-card-${m.id}`}
      className={`relative rounded-2xl p-5 border transition-all hover:-translate-y-0.5 ${isPro ? "bg-gradient-to-br from-[var(--purple-soft)] to-[var(--bg)] border-[#A78BFA]/40" : "bg-[var(--surface)] border-[var(--border)]"}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[var(--muted)]">{m.id}</span>
        {isLive ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#EF4444]"><span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full pulse-soft" />LIVE</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--ink)]"><Hourglass className="w-2.5 h-2.5" /> WAITING</span>
        )}
      </div>
      {isLive ? (
        <div className="space-y-3 mb-4">
          <Trader name={m.trader_a?.username || "?"} pnl={m.pnl_a} />
          <div className="text-center text-[10px] font-mono uppercase tracking-widest text-[var(--muted-2)]">vs</div>
          <Trader name={m.trader_b?.username || "?"} pnl={m.pnl_b} />
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] text-[10px] grid place-items-center font-bold">{(m.trader_a?.username || "?")[0]}</span>
            <span className="text-[13px] font-medium text-[var(--ink)]">@{m.trader_a?.username || "Unknown"}</span>
          </div>
          <div className="text-center text-[10px] font-mono uppercase tracking-widest text-[var(--muted-2)] my-2">vs</div>
          <div className="flex items-center gap-2 text-[var(--muted-2)]">
            <span className="w-7 h-7 rounded-full bg-[var(--tag)] text-[var(--muted-2)] text-[10px] grid place-items-center font-bold">?</span>
            <span className="text-[13px] italic">Waiting for opponent…</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <Pill label="Account" value={`$${(m.account_size / 1000).toFixed(0)}K`} />
        <Pill label={isLive ? "Time left" : "Prize"} value={isLive ? formatTime(m.time_left_seconds) : `$${(m.prize || 0).toLocaleString()}`} />
      </div>
      <button
        onClick={() => onJoin(m)}
        data-testid={`${isLive ? "spectate" : "view-open"}-${m.id}`}
        className="w-full inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-medium py-2.5 rounded-full hover:bg-[var(--ink-soft)]"
      >
        {isLive ? (<><Eye className="w-3.5 h-3.5" /> Spectate · {m.spectators}</>) : (<><ArrowRight className="w-3.5 h-3.5" /> View details</>)}
      </button>
    </div>
  );
}
