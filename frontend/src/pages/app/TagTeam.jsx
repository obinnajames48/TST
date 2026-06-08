import { useState } from "react";
import { Users, ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { currentUser, myTeams } from "@/lib/mockData";

export default function TagTeam() {
  return (
    <div data-testid="tagteam-page" className="space-y-8">
      <PageHeader
        eyebrow="Compete"
        title="Tag Team"
        description="Build a squad. Distribute capital. Trade as one."
        actions={
          <CreateTeamDialog>
            <button
              data-testid="create-team-btn"
              className="inline-flex items-center gap-2 bg-[#0F0F12] text-white font-medium text-[14px] px-4 py-2.5 rounded-full hover:bg-[#1F2024]"
            >
              <Plus className="w-4 h-4" /> Create team
            </button>
          </CreateTeamDialog>
        }
      />

      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF] mb-3">My teams</div>
        <div className="grid md:grid-cols-2 gap-4">
          {myTeams.map((t) => (
            <div key={t.id} data-testid={`team-${t.id}`} className="bg-white border border-[#ECECEA] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#EDE7FE] grid place-items-center">
                    <Users className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#0F0F12]">Team {t.name}</div>
                    <div className="text-[11px] font-mono text-[#6B7280]">{t.format} · {t.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full">
                  {t.record}
                </span>
              </div>

              <div className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF] mb-2">Roster</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {t.members.map((m, i) => {
                  const isYou = m === currentUser.username;
                  return (
                    <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] ${isYou ? "bg-[#E6F4C2] border-[#B4E04C]" : "bg-[#FAFAF7] border-[#F1F1EF]"}`}>
                      <span className="w-5 h-5 rounded-full bg-[#0F0F12] text-white text-[9px] grid place-items-center font-bold">
                        {m[0]}
                      </span>
                      <span className="font-medium text-[#0F0F12]">@{m}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0F0F12] text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1F2024]">
                  Challenge team
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button className="px-4 bg-white border border-[#ECECEA] text-[#0F0F12] text-[13px] font-medium rounded-full hover:bg-[#F5F5F2]">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active match preview */}
      <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Active match</div>
            <div className="text-base font-semibold text-[#0F0F12]">Alpha vs Capital · 3v3 · $1M combined</div>
          </div>
          <div className="font-mono text-sm text-[#0F0F12]">02:14:36</div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <TeamPanel name="Alpha" pnl={8420} tone="lime" members={[{ n: "Riley", p: 3140 }, { n: "Jess", p: 3200 }, { n: "Mo", p: 2080 }]} />
          <TeamPanel name="Capital" pnl={6180} tone="purple" members={[{ n: "Jay", p: 2410 }, { n: "Sam", p: 1900 }, { n: "Nina", p: 1870 }]} />
        </div>
      </div>
    </div>
  );
}

function TeamPanel({ name, pnl, tone, members }) {
  const bg = tone === "lime" ? "bg-[#E6F4C2]" : "bg-[#EDE7FE]";
  return (
    <div className={`${bg} rounded-2xl p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#1F2024]/70">Team {name}</div>
        <div className={`font-mono text-2xl font-semibold ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
          {pnl >= 0 ? "+" : "−"}${Math.abs(pnl).toLocaleString()}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {members.map((m, i) => (
          <div key={i} className="bg-white rounded-xl border border-white p-3">
            <div className="w-8 h-8 rounded-full mx-auto bg-[#0F0F12] text-white text-xs grid place-items-center font-bold">
              {m.n[0]}
            </div>
            <div className="mt-1.5 text-xs text-[#1F2024]">{m.n}</div>
            <div className="font-mono text-xs font-semibold text-[#10B981]">+${m.p.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreateTeamDialog({ children }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [format, setFormat] = useState("3v3");
  const [total, setTotal] = useState(100000);
  const [splits, setSplits] = useState([33333, 33333, 33334]);
  const slots = format === "3v3" ? 3 : 5;

  const sum = splits.slice(0, slots).reduce((a, b) => a + b, 0);
  const valid = sum === total && name.length > 1;

  const setSlot = (i, v) => {
    const next = [...splits];
    next[i] = Number(v) || 0;
    setSplits(next);
  };

  const submit = () => {
    if (!valid) {
      toast.error("Capital distribution must sum exactly to total");
      return;
    }
    toast.success(`Team "${name}" created — invite teammates by username`);
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg rounded-3xl bg-white border-[#ECECEA]">
        <DialogHeader>
          <DialogTitle className="text-[#0F0F12]">Create a team</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Field label="Team name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alpha"
              className="w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#0F0F12]"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Format">
              <div className="flex gap-2">
                {["3v3", "5v5"].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFormat(f);
                      const n = f === "3v3" ? 3 : 5;
                      const each = Math.floor(total / n);
                      setSplits(Array.from({ length: n }, (_, i) => i === 0 ? total - each * (n - 1) : each));
                    }}
                    className={`flex-1 text-[13px] px-3 py-2 rounded-xl border ${format === f ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-white border-[#ECECEA]"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Total combined account">
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                className="w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-2.5 text-[14px] font-mono focus:outline-none focus:border-[#0F0F12]"
              />
            </Field>
          </div>

          <Field label={`Capital split (sum must equal $${total.toLocaleString()})`}>
            <div className="space-y-2">
              {Array.from({ length: slots }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#6B7280] w-16">Trader {i + 1}</span>
                  <input
                    type="number"
                    value={splits[i] || 0}
                    onChange={(e) => setSlot(i, e.target.value)}
                    className="flex-1 bg-[#FAFAF7] border border-[#ECECEA] rounded-lg px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-[#0F0F12]"
                  />
                </div>
              ))}
              <div className={`text-[11px] font-mono ${valid ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                Sum: ${sum.toLocaleString()} / ${total.toLocaleString()}
              </div>
            </div>
          </Field>

          <button
            onClick={submit}
            className="w-full bg-[#0F0F12] text-white font-medium text-[14px] py-3 rounded-full hover:bg-[#1F2024]"
          >
            Create team
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#0F0F12] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
