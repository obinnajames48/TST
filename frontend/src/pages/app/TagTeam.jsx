import { useState } from "react";
import { Users, ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFetch } from "@/lib/useFetch";
import { listTeams, createTeam, getMe } from "@/lib/api";

export default function TagTeam() {
  const { data: me } = useFetch(getMe);
  const { data: teamsRaw, refetch } = useFetch(listTeams);
  const teams = teamsRaw || [];

  return (
    <div data-testid="tagteam-page" className="space-y-8">
      <PageHeader
        eyebrow="Compete"
        title="Tag Team"
        description="Build a squad. Distribute capital. Trade as one."
        actions={
          <CreateTeamDialog onCreated={refetch}>
            <button data-testid="create-team-btn" className="inline-flex items-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] font-medium text-[14px] px-4 py-2.5 rounded-full hover:bg-[var(--ink-soft)]">
              <Plus className="w-4 h-4" /> Create team
            </button>
          </CreateTeamDialog>
        }
      />

      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)] mb-3">My teams</div>
        {teams.length === 0 ? (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
            <Users className="w-8 h-8 text-[var(--muted-2)] mx-auto mb-3" />
            <div className="text-[14px] font-semibold text-[var(--ink)]">No teams yet</div>
            <div className="text-[13px] text-[var(--muted)] mt-1">Create one and invite teammates by username.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {teams.map((t) => (
              <div key={t.id} data-testid={`team-${t.id}`} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--purple-soft)] grid place-items-center"><Users className="w-5 h-5 text-[#7C3AED]" /></div>
                    <div>
                      <div className="text-[15px] font-semibold text-[var(--ink)]">Team {t.name}</div>
                      <div className="text-[11px] font-mono text-[var(--muted)]">{t.format} · {t.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-[var(--tag)] text-[var(--muted)] px-2 py-0.5 rounded-full">{t.record}</span>
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-2)] mb-2">Roster</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {t.members.map((m, i) => {
                    const isYou = m === me?.username;
                    return (
                      <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] ${isYou ? "bg-[var(--lime-soft)] border-[#B4E04C]" : "bg-[var(--bg)] border-[var(--border-soft)]"}`}>
                        <span className="w-5 h-5 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] text-[9px] grid place-items-center font-bold">{m[0]}</span>
                        <span className="font-medium text-[var(--ink)]">@{m}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-medium py-2.5 rounded-full hover:bg-[var(--ink-soft)]">
                    Challenge team <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button className="px-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] text-[13px] font-medium rounded-full hover:bg-[var(--bg-soft)]">Manage</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateTeamDialog({ children, onCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [format, setFormat] = useState("3v3");
  const [total, setTotal] = useState(100000);
  const [splits, setSplits] = useState([33333, 33333, 33334]);
  const [usernames, setUsernames] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const slots = format === "3v3" ? 3 : 5;

  const sum = splits.slice(0, slots).reduce((a, b) => a + b, 0);
  const sumValid = sum === total;
  const valid = sumValid && name.length > 1;

  const setSlot = (i, v) => {
    const next = [...splits];
    next[i] = Number(v) || 0;
    setSplits(next);
  };

  const submit = async () => {
    if (!valid) {
      toast.error(sumValid ? "Team name too short" : "Capital distribution must sum exactly to total");
      return;
    }
    setSubmitting(true);
    try {
      await createTeam({
        name, format, total_account: total, splits: splits.slice(0, slots),
        member_usernames: usernames.filter(Boolean),
      });
      toast.success(`Team "${name}" created`);
      setOpen(false);
      setName("");
      onCreated?.();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg rounded-3xl bg-[var(--surface)] border-[var(--border)] max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[var(--ink)]">Create a team</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <Field label="Team name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alpha" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[var(--ink)]" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Format">
              <div className="flex gap-2">
                {["3v3", "5v5"].map((f) => (
                  <button key={f} onClick={() => {
                    setFormat(f);
                    const n = f === "3v3" ? 3 : 5;
                    const each = Math.floor(total / n);
                    setSplits(Array.from({ length: n }, (_, i) => i === 0 ? total - each * (n - 1) : each));
                  }} className={`flex-1 text-[13px] px-3 py-2 rounded-xl border ${format === f ? "bg-[var(--inverse)] text-[var(--inverse-fg)] border-[var(--ink)]" : "bg-[var(--surface)] border-[var(--border)]"}`}>{f}</button>
                ))}
              </div>
            </Field>
            <Field label="Total combined account">
              <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-[14px] font-mono focus:outline-none focus:border-[var(--ink)]" />
            </Field>
          </div>
          <Field label={`Capital split (sum must equal $${total.toLocaleString()})`}>
            <div className="space-y-2">
              {Array.from({ length: slots }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[var(--muted)] w-16">Trader {i + 1}</span>
                  <input type="number" value={splits[i] || 0} onChange={(e) => setSlot(i, e.target.value)} className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-[var(--ink)]" />
                </div>
              ))}
              <div className={`text-[11px] font-mono ${sumValid ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                Sum: ${sum.toLocaleString()} / ${total.toLocaleString()}
              </div>
            </div>
          </Field>
          <Field label="Invite teammates by username (optional)">
            <div className="space-y-2">
              {usernames.map((u, i) => (
                <input key={i} value={u} onChange={(e) => { const n = [...usernames]; n[i] = e.target.value; setUsernames(n); }} placeholder={`@username ${i + 1}`} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2 text-[13px] focus:outline-none focus:border-[var(--ink)]" />
              ))}
            </div>
          </Field>
          <button onClick={submit} disabled={submitting} className="w-full bg-[var(--inverse)] text-[var(--inverse-fg)] font-medium text-[14px] py-3 rounded-full hover:bg-[var(--ink-soft)] disabled:opacity-50">
            {submitting ? "Creating..." : "Create team"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }) {
  return <div><label className="block text-[12px] font-medium text-[var(--ink)] mb-1.5">{label}</label>{children}</div>;
}
