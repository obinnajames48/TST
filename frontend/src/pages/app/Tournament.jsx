import { useState } from "react";
import { Trophy, ArrowUpRight, Crown, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFetch } from "@/lib/useFetch";
import { listTournaments, getTournament, registerTournament, getMyTournamentJourneys, getTournamentBracket } from "@/lib/api";

export default function Tournament() {
  const [tab, setTab] = useState("journey");
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

      {selectedId && detail ? (
        <BracketView tournament={detail} onBack={() => setSelectedId(null)} />
      ) : (
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 inline-flex h-auto" data-testid="tournament-tabs">
            <TabsTrigger value="journey" data-testid="tab-journey" className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[var(--inverse)] data-[state=active]:text-[var(--inverse-fg)]">My Journey</TabsTrigger>
            <TabsTrigger value="browse" data-testid="tab-browse" className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[var(--inverse)] data-[state=active]:text-[var(--inverse-fg)]">Browse all</TabsTrigger>
          </TabsList>
          <TabsContent value="journey" className="mt-6">
            <JourneyList onOpen={setSelectedId} />
          </TabsContent>
          <TabsContent value="browse" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.map((t) => (
                <TournamentCard key={t.id} t={t} onOpen={() => setSelectedId(t.id)} onRegister={() => handleRegister(t.id)} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function JourneyList({ onOpen }) {
  const { data: journeysRaw } = useFetch(getMyTournamentJourneys);
  const journeys = journeysRaw || [];

  if (!journeys.length) {
    return (
      <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl p-12 text-center" data-testid="journey-empty">
        <div className="text-[13px] text-[var(--muted)]">You haven't joined any tournaments yet. Browse open tournaments to register.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="journey-list">
      {journeys.map((j) => (
        <JourneyCard key={j.tournament_id} journey={j} onOpen={() => onOpen(j.tournament_id)} />
      ))}
    </div>
  );
}

function JourneyCard({ journey, onOpen }) {
  const [open, setOpen] = useState(false);
  const completed = journey.tournament_stage === "Completed";
  const ongoing = journey.tournament_stage && !["Registration", "Completed"].includes(journey.tournament_stage);
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden" data-testid={`journey-card-${journey.tournament_id}`}>
      <div className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${journey.is_champion ? "bg-[#FEF3C7] text-[#B45309]" : completed ? "bg-[var(--purple-soft)] text-[#7C3AED]" : "bg-[var(--lime-soft)] text-[var(--ink)]"}`}>
          {journey.is_champion ? <Crown className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-[var(--muted-2)]">{journey.tournament_id}</span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${completed ? "bg-[#10B981]/10 text-[#10B981]" : ongoing ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>
              {journey.tournament_stage}
            </span>
          </div>
          <div className="text-[15px] font-semibold text-[var(--ink)] mt-1 truncate">{journey.tournament_name}</div>
          <div className="text-[12px] text-[var(--muted)] mt-0.5">
            Started {journey.tournament_start} · ${journey.account_size?.toLocaleString()} account · Pool ${journey.tournament_prize_pool?.toLocaleString()}
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end shrink-0 mr-2">
          <div className="text-[10px] uppercase tracking-wider font-mono text-[var(--muted-2)]">Exit</div>
          <div className="text-[13.5px] font-semibold text-[var(--ink)]">{journey.exit_stage}</div>
          {(journey.prize_won > 0 || journey.is_champion) && (
            <div className="text-[12px] font-mono text-[#10B981] font-semibold mt-0.5">+${journey.prize_won?.toLocaleString()}</div>
          )}
        </div>
        <button onClick={() => setOpen(!open)} data-testid={`journey-toggle-${journey.tournament_id}`}
          className="grid place-items-center w-9 h-9 rounded-full border border-[var(--border)] hover:bg-[var(--bg)] shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
      {open && (
        <div className="px-5 pb-5 border-t border-[var(--border-soft)] bg-[var(--bg)]" data-testid={`journey-expand-${journey.tournament_id}`}>
          <div className="pt-4 space-y-2">
            {(!journey.path || journey.path.length === 0) && (
              <div className="text-[13px] text-[var(--muted)] py-3 text-center">No matches played yet.</div>
            )}
            {journey.path?.map((p, i) => (
              <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${p.advanced ? "bg-[var(--lime-soft)]/40 border-[#B4E04C]/40" : "bg-[#FEE2E2] border-[#FCA5A5]"}`}>
                <div className={`w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold ${p.advanced ? "bg-[#16A34A] text-white" : "bg-[#DC2626] text-white"}`}>{p.advanced ? "✓" : "✕"}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--ink)]">{p.stage}</div>
                  <div className="text-[11.5px] text-[var(--muted)] truncate">
                    {p.opponent && <>vs {p.opponent}</>}
                    {p.details && <> · {p.details}</>}
                    {p.date_label && <> · {p.date_label}</>}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-[13px] font-semibold ${p.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {p.pnl >= 0 ? "+" : "−"}${Math.abs(p.pnl).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{p.result}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onOpen} data-testid={`expand-bracket-${journey.tournament_id}`}
            className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium px-4 py-2 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] hover:bg-[var(--ink-soft)]">
            <Eye className="w-3.5 h-3.5" /> Expand to full bracket
          </button>
        </div>
      )}
    </div>
  );
}

function TournamentCard({ t, onOpen, onRegister }) {
  return (
    <div data-testid={`tournament-card-${t.id}`} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-12px_rgba(15,15,18,0.1)] transition-all">
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
        <button onClick={onOpen} className="flex-1 inline-flex items-center justify-center gap-2 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-medium py-2.5 rounded-full hover:bg-[var(--ink-soft)]">
          View bracket <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        {t.stage === "Registration" && !t.is_registered && (
          <button onClick={onRegister} className="px-4 bg-[#B4E04C] text-[#0F0F12] text-[13px] font-semibold rounded-full hover:bg-[var(--surface)]">Enter</button>
        )}
        {t.is_registered && <span className="px-4 text-[12px] text-[#10B981] inline-flex items-center">✓ Registered</span>}
      </div>
    </div>
  );
}

function Row({ k, v, accent }) {
  return <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-1.5"><span className="text-[var(--muted)]">{k}</span><span className={`font-mono font-semibold ${accent ? "text-[#10B981]" : "text-[var(--ink)]"}`}>{v}</span></div>;
}

function BracketView({ tournament, onBack }) {
  const { data: bracketData } = useFetch(() => getTournamentBracket(tournament.id), { deps: [tournament.id] });
  return (
    <div className="space-y-6">
      <button onClick={onBack} data-testid="bracket-back" className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)]">← Back to tournaments</button>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">{tournament.id}</div>
            <div className="text-xl font-bold text-[var(--ink)]">{tournament.name}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Group", "R16", "QF", "SF", "Final"].map((s) => {
              const active = tournament.stage.toLowerCase().startsWith(s.toLowerCase());
              return <span key={s} className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${active ? "bg-[var(--inverse)] text-[var(--inverse-fg)]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{s}</span>;
            })}
          </div>
        </div>

        {tournament.groups?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3" data-testid="group-stage">
            {tournament.groups.map((g) => {
              const sortedRows = [...g.rows].sort((a, b) => (b.equity ?? 0) - (a.equity ?? 0));
              return (
                <div key={g.label} className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl p-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-2)] mb-2">Group {g.label}</div>
                  <table className="w-full text-[12px]">
                    <thead className="text-[var(--muted-2)]">
                      <tr>
                        <th className="text-left font-normal py-1 w-6">#</th>
                        <th className="text-left font-normal py-1">Trader</th>
                        <th className="text-right font-normal py-1">Equity P&amp;L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRows.map((r, i) => (
                        <tr key={i} className={`border-t border-[var(--border)] ${r.is_you ? "bg-[var(--lime-soft)]" : ""}`}>
                          <td className={`py-1.5 font-mono text-[11px] ${i < 2 ? "text-[#10B981] font-bold" : "text-[var(--muted-2)]"}`}>{i + 1}</td>
                          <td className="py-1.5 truncate">{i < 2 && <span className="text-[#10B981] mr-1">●</span>}@{r.username}</td>
                          <td className={`py-1.5 text-right font-mono font-semibold ${r.equity >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{r.equity >= 0 ? "+" : "−"}${Math.abs(r.equity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2 text-[10px] font-mono text-[var(--muted-2)] uppercase tracking-wider">Top 2 by equity advance</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-[13px] text-[var(--muted)] py-8 text-center">Bracket will be generated when registration closes.</div>
        )}
      </div>

      {bracketData && Object.values(bracketData.bracket || {}).some((arr) => arr.length > 0) && (
        <KnockoutBracket bracket={bracketData} />
      )}

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

function KnockoutBracket({ bracket }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6" data-testid="knockout-bracket">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Knockout bracket</div>
          <div className="text-base font-semibold text-[var(--ink)]">Every match from R16 to Final</div>
        </div>
        {bracket.winner && (
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-mono text-[var(--muted-2)]">Champion</div>
            <div className="text-[14px] font-bold text-[var(--ink)] inline-flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-[#B45309]" /> @{bracket.winner.username}
              {bracket.winner.is_you && <span className="text-[9px] font-bold uppercase tracking-wider bg-[#0F0F12] text-[#B4E04C] px-1.5 py-0.5 rounded">You</span>}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {bracket.stages.map((stage) => {
          const matches = bracket.bracket?.[stage] || [];
          if (matches.length === 0) return null;
          return (
            <div key={stage} className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl p-3 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-2)] mb-1">{stageLabel(stage)}</div>
              {matches.map((m, i) => (
                <BracketMatch key={m.match_id || i} m={m} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BracketMatch({ m }) {
  const wa = m.winner_id && m.user_a && m.winner_id === m.user_a.id;
  const wb = m.winner_id && m.user_b && m.winner_id === m.user_b.id;
  const youInside = (m.user_a?.is_you || m.user_b?.is_you);
  return (
    <div className={`rounded-lg p-2 text-[11.5px] border ${youInside ? "bg-[var(--lime-soft)]/40 border-[#B4E04C]/50" : "bg-[var(--surface)] border-[var(--border)]"}`} data-testid={`bracket-match-${m.match_id}`}>
      <BracketSide t={m.user_a} pnl={m.pnl_a} winner={wa} />
      <BracketSide t={m.user_b} pnl={m.pnl_b} winner={wb} />
      {m.date_label && <div className="text-[9.5px] text-[var(--muted-2)] mt-0.5 font-mono">{m.date_label}</div>}
    </div>
  );
}

function BracketSide({ t, pnl, winner }) {
  if (!t) return <div className="text-[var(--muted-2)] italic">TBD</div>;
  return (
    <div className={`flex items-center justify-between gap-2 py-0.5 ${winner ? "font-semibold text-[var(--ink)]" : "text-[var(--muted)]"}`}>
      <span className="truncate inline-flex items-center gap-1">
        @{t.username}
        {t.is_you && <span className="text-[8.5px] font-bold uppercase tracking-wider bg-[#0F0F12] text-[#B4E04C] px-1 py-0.5 rounded">You</span>}
      </span>
      <span className={`font-mono ${pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"} ${winner ? "" : "opacity-70"}`}>
        {pnl >= 0 ? "+" : "−"}${Math.abs(pnl)}
      </span>
    </div>
  );
}

function stageLabel(s) {
  return { R16: "Round of 16", QF: "Quarter-Finals", SF: "Semi-Finals", Final: "Final" }[s] || s;
}
