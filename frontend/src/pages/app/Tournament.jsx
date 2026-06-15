import { useState } from "react";
import { Trophy, ArrowUpRight, Crown } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { useFetch } from "@/lib/useFetch";
import { listTournaments, getTournament, registerTournament } from "@/lib/api";

export default function Tournament() {
  const [selectedId, setSelectedId] = useState(null);
  const { data: tournamentsRaw, refetch } = useFetch(listTournaments);
  const tournaments = tournamentsRaw || [];
  const { data: detail } = useFetch(() => selectedId ? getTournament(selectedId) : Promise.resolve(null), { deps: [selectedId] });

  const handleRegister = async (id) => {
    try {
      await registerTournament(id);
      toast.success("Registered");
      refetch();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div data-testid="tournament-page" className="space-y-8">
      <PageHeader eyebrow="Compete" title="Multi Trader" description="32 traders. 8 groups of 4. Group stage → Round of 16 → QF → SF → Final. Prizes at every stage." />

      {!selectedId ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((t) => (
            <div key={t.id} data-testid={`tournament-card-${t.id}`} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(15,15,18,0.1)] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--lime-soft)] grid place-items-center"><Trophy className="w-5 h-5 text-[var(--ink)]" /></div>
                <span className="text-[10px] font-medium bg-[var(--inverse)] text-[var(--inverse-fg)] px-2 py-0.5 rounded-full uppercase tracking-wider">{t.stage}</span>
              </div>
              <div className="text-[15px] font-semibold text-[var(--ink)]">{t.name}</div>
              <div className="text-[11px] font-mono text-[var(--muted)] mt-0.5">{t.id}</div>
              <div className="mt-4 space-y-2 text-[13px]">
                <Row k="Registered" v={`${t.registered} / ${t.capacity}`} />
                <Row k="Starts" v={t.start_date} />
                <Row k="Prize pool" v={`$${t.prize_pool.toLocaleString()}`} accent />
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setSelectedId(t.id)} className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-medium py-2.5 rounded-full hover:bg-[var(--ink-soft)]">
                  View bracket <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                {t.stage === "Registration" && !t.is_registered && (
                  <button onClick={() => handleRegister(t.id)} className="px-4 bg-[#B4E04C] text-[#0F0F12] text-[13px] font-semibold rounded-full hover:bg-[var(--surface)]">Enter</button>
                )}
                {t.is_registered && <span className="px-4 text-[12px] text-[#10B981] inline-flex items-center">✓ Registered</span>}
              </div>
            </div>
          ))}
        </div>
      ) : detail ? (
        <BracketView tournament={detail} onBack={() => setSelectedId(null)} />
      ) : (
        <div className="h-40 bg-[var(--surface)] rounded-2xl border border-[var(--border)] animate-pulse" />
      )}
    </div>
  );
}

function Row({ k, v, accent }) {
  return <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-1.5"><span className="text-[var(--muted)]">{k}</span><span className={`font-mono font-semibold ${accent ? "text-[#10B981]" : "text-[var(--ink)]"}`}>{v}</span></div>;
}

function BracketView({ tournament, onBack }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)]">← Back to tournaments</button>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">{tournament.id}</div>
            <div className="text-xl font-bold text-[var(--ink)]">{tournament.name}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Group", "R16", "QF", "SF", "Final"].map((s, i) => {
              const active = tournament.stage.toLowerCase().startsWith(s.toLowerCase());
              return <span key={s} className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${active ? "bg-[var(--inverse)] text-[var(--inverse-fg)]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{s}</span>;
            })}
          </div>
        </div>

        {tournament.groups?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="group-stage">
            {tournament.groups.map((g) => (
              <div key={g.label} className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-2)] mb-2">Group {g.label}</div>
                <table className="w-full text-[12px]">
                  <thead className="text-[var(--muted-2)]">
                    <tr>
                      <th className="text-left font-normal py-1">Trader</th>
                      <th className="text-right font-normal py-1">W-D-L</th>
                      <th className="text-right font-normal py-1">P&amp;L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((r, i) => (
                      <tr key={i} className={`border-t border-[var(--border)] ${r.is_you ? "bg-[var(--lime-soft)]" : ""}`}>
                        <td className="py-1.5 truncate">{r.advanced && <span className="text-[#10B981] mr-1">●</span>}@{r.username}</td>
                        <td className="py-1.5 text-right font-mono">{r.w}-{r.d}-{r.l}</td>
                        <td className={`py-1.5 text-right font-mono font-semibold ${r.equity >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{r.equity >= 0 ? "+" : "−"}${Math.abs(r.equity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[13px] text-[var(--muted)] py-8 text-center">Bracket will be generated when registration closes.</div>
        )}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4"><Crown className="w-4 h-4 text-[var(--ink)]" /><div className="text-base font-semibold text-[var(--ink)]">Prize distribution</div></div>
        <div className="grid md:grid-cols-5 gap-3">
          {tournament.prize_distribution.map((p, i) => {
            const champion = i === tournament.prize_distribution.length - 1;
            return (
              <div key={p.stage} className={`rounded-xl p-4 border ${champion ? "bg-[var(--lime-soft)] border-[#B4E04C]" : "bg-[var(--bg)] border-[var(--border-soft)]"}`}>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">{p.stage}</div>
                <div className="font-mono text-2xl font-semibold text-[var(--ink)] mt-1">{p.share}%</div>
                <div className="text-[11px] font-mono text-[var(--muted)]">${p.amount.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
