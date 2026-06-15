import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFetch } from "@/lib/useFetch";
import { adminListDuels, adminVoidDuel } from "@/lib/adminApi";

const STATUS_GROUPS = {
  active: ["live"],
  inactive: ["pairing", "cancelled"],
  completed: ["completed"],
};

export default function AdminMatches() {
  const [tab, setTab] = useState("active");
  const { data: duels, refetch } = useFetch(() => adminListDuels("all"), { pollMs: 4000 });

  const voidDuel = async (id) => {
    const reason = prompt("Reason for voiding the duel? (refunds both traders)");
    if (!reason) return;
    try { await adminVoidDuel(id, reason); toast.success("Duel voided and both refunded"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const grouped = useMemo(() => {
    const out = { active: [], inactive: [], completed: [] };
    (duels || []).forEach((d) => {
      Object.entries(STATUS_GROUPS).forEach(([k, statuses]) => {
        if (statuses.includes(d.status)) out[k].push(d);
      });
    });
    return out;
  }, [duels]);

  return (
    <div className="space-y-6" data-testid="admin-matches">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Manage</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Matches</h1>
        <p className="text-[13px] text-[var(--muted)] mt-2">Monitor every duel across the platform — including the 3-minute MT5 login window before live trading begins.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-[var(--surface)] border border-[var(--border)] rounded-full p-1 inline-flex h-auto" data-testid="match-tabs">
          {["active", "inactive", "completed"].map((k) => (
            <TabsTrigger
              key={k}
              value={k}
              data-testid={`match-tab-${k}`}
              className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[var(--inverse)] data-[state=active]:text-[var(--inverse-fg)]"
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
              <span className="ml-2 inline-flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--bg-soft)] text-[var(--ink)] data-[state=active]:bg-[var(--inverse-fg)] data-[state=active]:text-[var(--inverse)]">
                {grouped[k].length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(STATUS_GROUPS).map((k) => (
          <TabsContent key={k} value={k} className="mt-5">
            <MatchTable rows={grouped[k]} group={k} onVoid={voidDuel} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function MatchTable({ rows, group, onVoid }) {
  if (!rows.length) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center">
        <div className="text-[13px] text-[var(--muted)]">No matches in this category.</div>
      </div>
    );
  }
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto" data-testid={`match-table-${group}`}>
      <table className="w-full text-[13px] min-w-[980px]">
        <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]">
          <tr>
            <th className="text-left font-medium py-3 px-5">Duel</th>
            <th className="text-left font-medium py-3 px-3">Type</th>
            <th className="text-left font-medium py-3 px-3">Status</th>
            <th className="text-left font-medium py-3 px-3">Trader A</th>
            <th className="text-left font-medium py-3 px-3">Trader B</th>
            <th className="text-right font-medium py-3 px-3">Account</th>
            {group === "active" ? (
              <>
                <th className="text-right font-medium py-3 px-3">P&amp;L A / B</th>
                <th className="text-left font-medium py-3 px-3">MT5 login</th>
              </>
            ) : (
              <>
                <th className="text-right font-medium py-3 px-3">P&amp;L A</th>
                <th className="text-right font-medium py-3 px-3">P&amp;L B</th>
              </>
            )}
            <th className="text-right font-medium py-3 px-5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="border-b border-[var(--border-soft)] hover:bg-[var(--bg)]">
              <td className="py-3 px-5 font-mono text-[var(--ink)] font-semibold truncate max-w-[120px]" title={d.id}>{d.id.slice(0, 8)}…</td>
              <td className="py-3 px-3"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${d.type === "custom" ? "bg-[var(--purple-soft)] text-[#7C3AED]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{d.type}</span></td>
              <td className="py-3 px-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${d.status === "live" ? "bg-[#EF4444]/10 text-[#EF4444]" : d.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{d.status}</span></td>
              <td className="py-3 px-3 text-[var(--ink)]">@{d.trader_a}</td>
              <td className="py-3 px-3 text-[var(--ink)]">@{d.trader_b}</td>
              <td className="py-3 px-3 text-right font-mono">${(d.account_size / 1000).toFixed(0)}K</td>
              {group === "active" ? (
                <>
                  <td className="py-3 px-3 text-right font-mono text-[12px]">
                    <span className={`font-semibold ${d.pnl_a >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{d.pnl_a >= 0 ? "+" : "−"}${Math.abs(d.pnl_a).toFixed(0)}</span>
                    <span className="text-[var(--muted-2)] mx-1">/</span>
                    <span className={`font-semibold ${d.pnl_b >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{d.pnl_b >= 0 ? "+" : "−"}${Math.abs(d.pnl_b).toFixed(0)}</span>
                  </td>
                  <td className="py-3 px-3"><Mt5Monitor duel={d} /></td>
                </>
              ) : (
                <>
                  <td className={`py-3 px-3 text-right font-mono font-semibold ${d.pnl_a >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{d.pnl_a >= 0 ? "+" : "−"}${Math.abs(d.pnl_a).toFixed(0)}</td>
                  <td className={`py-3 px-3 text-right font-mono font-semibold ${d.pnl_b >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{d.pnl_b >= 0 ? "+" : "−"}${Math.abs(d.pnl_b).toFixed(0)}</td>
                </>
              )}
              <td className="py-3 px-5 text-right">
                {(d.status === "live" || d.status === "pairing") && <button onClick={() => onVoid(d.id)} data-testid={`void-${d.id}`} className="text-[11px] font-medium text-[#EF4444] hover:underline">Void</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Shows the 3-minute MT5 confirmation window for each live duel
function Mt5Monitor({ duel }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const tradingStarted = !!duel.trading_started_at;
  const start = duel.started_at ? new Date(duel.started_at).getTime() : now;
  const deadline = start + 180_000;
  const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
  const minsStr = String(Math.floor(remaining / 60));
  const secsStr = String(remaining % 60).padStart(2, "0");

  if (tradingStarted) {
    return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#10B981]"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Trading live</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <div className={`font-mono text-[12px] font-semibold ${remaining === 0 ? "text-[#EF4444]" : remaining < 60 ? "text-[#EF4444]" : "text-[var(--ink)]"}`}>{minsStr}:{secsStr}</div>
      <div className="flex items-center gap-1">
        <Pip ok={!!duel.login_confirmed_a} label="A" />
        <Pip ok={!!duel.login_confirmed_b} label="B" />
      </div>
    </div>
  );
}

function Pip({ ok, label }) {
  return (
    <span title={`Trader ${label} ${ok ? "confirmed" : "pending"}`} className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${ok ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[var(--tag)] text-[var(--muted-2)]"}`}>{label}</span>
  );
}
