import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ArrowRight, Sparkles, Lock, Clock } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentUser, liveMatches, accountSizes } from "@/lib/mockData";

export default function Duel() {
  const navigate = useNavigate();
  const [spawnOpen, setSpawnOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | searching | paired | activating | starting

  const isPro = currentUser.plan === "PRO";

  const startSpawn = (acc) => {
    setSelectedAccount(acc);
    setSpawnOpen(true);
    setPhase("searching");
    setTimeout(() => setPhase("paired"), 2500);
    setTimeout(() => setPhase("activating"), 4500);
    setTimeout(() => setPhase("starting"), 6500);
    setTimeout(() => {
      setSpawnOpen(false);
      setPhase("idle");
      toast.success(`Your $${acc.size.toLocaleString()} duel is live!`);
      navigate("/app/match/4781");
    }, 8500);
  };

  return (
    <div data-testid="duel-page" className="space-y-8">
      <PageHeader
        eyebrow="Compete"
        title="1v1 Duel Centre"
        description="Spectate live duels, enter the spawn queue, or create a custom duel."
      />

      <Tabs defaultValue="broadcast" className="w-full">
        <TabsList className="bg-white border border-[#ECECEA] rounded-full p-1 inline-flex h-auto" data-testid="duel-tabs">
          <TabsTrigger
            value="broadcast"
            className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[#0F0F12] data-[state=active]:text-white"
            data-testid="tab-broadcast"
          >
            Broadcast
          </TabsTrigger>
          <TabsTrigger
            value="spawn"
            className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[#0F0F12] data-[state=active]:text-white"
            data-testid="tab-spawn"
          >
            Spawn centre
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[#0F0F12] data-[state=active]:text-white"
            data-testid="tab-create"
          >
            Create
          </TabsTrigger>
        </TabsList>

        {/* BROADCAST */}
        <TabsContent value="broadcast" className="mt-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {liveMatches.map((m) => (
              <div
                key={m.id}
                data-testid={`broadcast-card-${m.id}`}
                className={`relative rounded-2xl p-5 border transition-all hover:-translate-y-0.5 ${
                  m.custom
                    ? "bg-gradient-to-br from-[#EDE7FE] to-[#FAFAF7] border-[#A78BFA]/40"
                    : "bg-white border-[#ECECEA]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {m.custom ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#A78BFA] text-white px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" /> Pro Custom
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full">
                        Standard
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#EF4444]">
                      <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full" />
                      LIVE
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#6B7280]">#{m.id}</span>
                </div>

                <div className="space-y-3 mb-4">
                  <Trader name={m.traderA} pnl={m.pnlA} />
                  <div className="text-center text-[10px] font-mono uppercase tracking-widest text-[#9CA3AF]">
                    vs
                  </div>
                  <Trader name={m.traderB} pnl={m.pnlB} />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <Pill label="Account" value={`$${(m.account / 1000).toFixed(0)}K`} />
                  <Pill label="Time" value={m.timeLeft} />
                </div>

                <button
                  onClick={() => navigate(`/app/match/${m.id}`)}
                  data-testid={`spectate-${m.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0F0F12] text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1F2024]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Spectate · {m.spectators}
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* SPAWN CENTRE */}
        <TabsContent value="spawn" className="mt-6">
          <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4C2] grid place-items-center">
                <Clock className="w-5 h-5 text-[#0F0F12]" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#0F0F12]">How spawning works</div>
                <p className="text-[13px] text-[#4B5563] mt-1 max-w-xl">
                  Pick an account size and pay the entry fee. We pair you within 5 minutes. Both traders accept, accounts activate, then a 60-second countdown begins. If we can't pair you, your entry is automatically refunded.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3" data-testid="spawn-grid">
            {accountSizes.map((a) => (
              <button
                key={a.size}
                onClick={() => startSpawn(a)}
                data-testid={`spawn-card-${a.size}`}
                className="text-left bg-white border border-[#ECECEA] rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(15,15,18,0.1)] transition-all"
              >
                <div className="font-mono text-2xl font-semibold text-[#0F0F12] tracking-tight">
                  ${a.size >= 1000000 ? "1M" : `${a.size / 1000}K`}
                </div>
                <div className="mt-2 text-xs text-[#6B7280] font-mono">
                  Entry ${a.entry} · Prize <span className="text-[#10B981] font-semibold">${a.prize}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#6B7280] inline-flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${a.waiting > 0 ? "bg-[#10B981]" : "bg-[#D1D5DB]"}`} />
                    {a.waiting > 0 ? `${a.waiting} waiting` : "Be the first"}
                  </span>
                  <span className="text-[11px] font-medium text-[#0F0F12]">Join →</span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* CREATE */}
        <TabsContent value="create" className="mt-6">
          {isPro ? <CreateDuelForm /> : <UpgradeGate />}
        </TabsContent>
      </Tabs>

      <SpawnDialog
        open={spawnOpen}
        onClose={() => {
          setSpawnOpen(false);
          setPhase("idle");
        }}
        phase={phase}
        account={selectedAccount}
      />
    </div>
  );
}

function Trader({ name, pnl }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-7 h-7 rounded-full bg-[#0F0F12] text-white text-[10px] grid place-items-center font-bold">
          {name[0]}
        </span>
        <span className="text-[13px] font-medium text-[#0F0F12]">@{name}</span>
      </div>
      <span className={`font-mono text-sm font-semibold ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
        {pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}
      </span>
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div className="bg-[#FAFAF7] border border-[#F1F1EF] rounded-xl px-3 py-2">
      <div className="text-[10px] font-mono text-[#9CA3AF] uppercase tracking-wider">{label}</div>
      <div className="text-[13px] font-mono font-semibold text-[#0F0F12]">{value}</div>
    </div>
  );
}

function SpawnDialog({ open, onClose, phase, account }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-[#ECECEA] bg-white" data-testid="spawn-dialog">
        <DialogHeader>
          <DialogTitle className="text-[#0F0F12] text-xl">Spawn Centre</DialogTitle>
          <DialogDescription className="text-[#6B7280]">
            {account ? `$${account.size.toLocaleString()} account · $${account.entry} entry` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center">
          {phase === "searching" && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-[#E6F4C2] grid place-items-center mb-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-[#B4E04C] animate-ping opacity-40" />
                <Clock className="w-7 h-7 text-[#0F0F12]" />
              </div>
              <div className="font-mono text-2xl font-semibold text-[#0F0F12]">04:58</div>
              <div className="mt-2 text-[14px] text-[#4B5563]">Searching for an opponent…</div>
            </>
          )}
          {phase === "paired" && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-[#EDE7FE] grid place-items-center mb-4">
                <Sparkles className="w-7 h-7 text-[#7C3AED]" />
              </div>
              <div className="text-lg font-semibold text-[#0F0F12]">Opponent found</div>
              <div className="mt-2 text-[14px] text-[#4B5563]">Waiting for acceptance…</div>
            </>
          )}
          {phase === "activating" && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-[#0F0F12] text-[#B4E04C] grid place-items-center mb-4">
                <Lock className="w-7 h-7" />
              </div>
              <div className="text-lg font-semibold text-[#0F0F12]">Both traders confirmed</div>
              <div className="mt-2 text-[14px] text-[#4B5563]">Activating your trading account…</div>
            </>
          )}
          {phase === "starting" && (
            <>
              <div className="mx-auto w-20 h-20 rounded-full bg-[#B4E04C] grid place-items-center mb-4">
                <ArrowRight className="w-7 h-7 text-[#0F0F12]" strokeWidth={2.5} />
              </div>
              <div className="font-mono text-3xl font-semibold text-[#0F0F12]">0:60</div>
              <div className="mt-2 text-[14px] text-[#4B5563]">Trading begins in…</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpgradeGate() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#0F0F12] text-white rounded-2xl p-10 lg:p-16 text-center relative overflow-hidden" data-testid="duel-upgrade-gate">
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-[#A78BFA] rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-20 pointer-events-none" />
      <div className="relative max-w-xl mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#A78BFA] grid place-items-center mb-5">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
          Creating custom duels is a Pro feature.
        </h3>
        <p className="mt-3 text-white/70">
          Set your own leverage, drawdown rules, account size, timeline and instruments. Custom Duels get a highlighted listing in the broadcast centre.
        </p>
        <button
          onClick={() => navigate("/app/settings")}
          className="mt-6 inline-flex items-center gap-2 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[14px] px-6 py-3 rounded-full hover:bg-white"
        >
          Upgrade to Pro <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
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

  const handleCreate = () => {
    toast.success("Custom duel created — awaiting an opponent");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5" data-testid="create-duel-form">
      <div className="lg:col-span-2 bg-white border border-[#ECECEA] rounded-2xl p-6 space-y-6">
        <Field label="Account size">
          <Select value={accountSize} onValueChange={setAccountSize}>
            <SelectTrigger className="bg-[#FAFAF7] border-[#ECECEA] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {accountSizes.map((a) => (
                <SelectItem key={a.size} value={String(a.size)}>${a.size.toLocaleString()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Entry fee (USD)">
            <input
              type="number"
              value={entry}
              onChange={(e) => setEntry(Number(e.target.value))}
              className="w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-2.5 font-mono text-[14px] focus:outline-none focus:border-[#0F0F12]"
            />
          </Field>
          <Field label="Trading timeline">
            <Select value={timeline} onValueChange={setTimeline}>
              <SelectTrigger className="bg-[#FAFAF7] border-[#ECECEA] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1h", "4h", "24h", "36h", "48h", "72h"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Leverage">
          <div className="flex flex-wrap gap-2">
            {["1:10", "1:25", "1:50", "1:100", "1:200", "1:500"].map((l) => (
              <button
                key={l}
                onClick={() => setLeverage(l)}
                className={`text-[13px] px-3 py-1.5 rounded-full border ${
                  leverage === l
                    ? "bg-[#0F0F12] text-white border-[#0F0F12]"
                    : "bg-white border-[#ECECEA] text-[#1F2024] hover:bg-[#F5F5F2]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label={`Daily drawdown: ${dailyDD[0]}%`}>
            <Slider value={dailyDD} onValueChange={setDailyDD} max={20} step={1} className="mt-2" />
          </Field>
          <Field label={`Max overall drawdown: ${maxDD[0]}%`}>
            <Slider value={maxDD} onValueChange={setMaxDD} max={30} step={1} className="mt-2" />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Instruments">
            <Select value={instruments} onValueChange={setInstruments}>
              <SelectTrigger className="bg-[#FAFAF7] border-[#ECECEA] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["All", "Forex", "Crypto", "Stocks/Indices", "Commodities"].map((i) => (
                  <SelectItem key={i} value={i}>{i}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Account type">
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="bg-[#FAFAF7] border-[#ECECEA] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Swap">Swap</SelectItem>
                <SelectItem value="Swap-Free">Swap-Free</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Spread">
            <Select value={spreadType} onValueChange={setSpreadType}>
              <SelectTrigger className="bg-[#FAFAF7] border-[#ECECEA] rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Raw spread">Raw spread</SelectItem>
                <SelectItem value="Commission">Commission-based</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <button
          onClick={handleCreate}
          data-testid="create-duel-submit"
          className="inline-flex items-center gap-2 bg-[#0F0F12] text-white text-[14px] font-semibold px-6 py-3 rounded-full hover:bg-[#1F2024]"
        >
          Create custom duel
          <span className="grid place-items-center w-5 h-5 bg-[#B4E04C] rounded-full text-[#0F0F12]">
            <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
          </span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#EDE7FE] to-[#FAFAF7] border border-[#A78BFA]/40 rounded-2xl p-6 h-fit sticky top-24">
        <div className="text-[10px] font-bold uppercase tracking-wider bg-[#A78BFA] text-white px-2 py-1 rounded-full inline-flex items-center gap-1 mb-4">
          <Sparkles className="w-3 h-3" /> Live preview
        </div>
        <div className="font-mono text-2xl font-semibold text-[#0F0F12]">
          ${Number(accountSize).toLocaleString()}
        </div>
        <div className="mt-1 text-xs font-mono text-[#6B7280]">Custom Pro Duel</div>
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
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#0F0F12] mb-2">{label}</label>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between border-b border-[#A78BFA]/15 pb-2">
      <span className="text-[#6B7280]">{k}</span>
      <span className="font-mono font-semibold text-[#0F0F12]">{v}</span>
    </div>
  );
}
