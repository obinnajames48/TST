import { useState } from "react";
import { useFetch } from "@/lib/useFetch";
import { toast } from "sonner";

const BASE = process.env.REACT_APP_BACKEND_URL;
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("admin_token") || ""}` });
const get = (p) => fetch(`${BASE}/api/admin${p}`, { headers: auth() }).then(r => r.json());
const post = (p, body) => fetch(`${BASE}/api/admin${p}`, { method: "POST", headers: { ...auth(), "Content-Type": "application/json" }, body: JSON.stringify(body || {}) }).then(r => r.json());

export function AdminTransactions() {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const { data } = useFetch(() => get(`/transactions?type=${type}&status=${status}`), { deps: [type, status], pollMs: 6000 });

  return (
    <div className="space-y-6" data-testid="admin-transactions">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Money</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Transactions</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "Deposit", "Withdrawal", "Entry Fee", "Prize", "Refund"].map(t =>
          <button key={t} onClick={() => setType(t)} className={`text-[12px] px-3 py-1.5 rounded-full border ${type === t ? "bg-[var(--inverse)] text-[var(--inverse-fg)] border-[var(--ink)]" : "bg-[var(--surface)] border-[var(--border)]"}`}>{t}</button>
        )}
        <span className="mx-2 text-[var(--muted-2)]">|</span>
        {["all", "completed", "processing", "rejected"].map(s =>
          <button key={s} onClick={() => setStatus(s)} className={`text-[12px] px-3 py-1.5 rounded-full border ${status === s ? "bg-[var(--inverse)] text-[var(--inverse-fg)] border-[var(--ink)]" : "bg-[var(--surface)] border-[var(--border)]"}`}>{s}</button>
        )}
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[700px]">
          <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]"><tr><th className="text-left py-3 px-5 font-medium">User</th><th className="text-left py-3 px-3 font-medium">Type</th><th className="text-left py-3 px-3 font-medium">Reference</th><th className="text-right py-3 px-3 font-medium">Amount</th><th className="text-left py-3 px-3 font-medium">Date</th><th className="text-left py-3 px-5 font-medium">Status</th></tr></thead>
          <tbody>
            {(data || []).map(t => (
              <tr key={t.id} className="border-b border-[var(--border-soft)]">
                <td className="py-3 px-5 text-[var(--ink)]">@{t.username}</td>
                <td className="py-3 px-3 text-[var(--ink-soft)]">{t.type}</td>
                <td className="py-3 px-3 font-mono text-[12px] text-[var(--ink-soft)]">{t.reference}</td>
                <td className={`py-3 px-3 text-right font-mono font-semibold ${t.amount >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>{t.amount >= 0 ? "+" : "−"}${Math.abs(t.amount).toLocaleString()}</td>
                <td className="py-3 px-3 font-mono text-[12px] text-[var(--muted)]">{new Date(t.created_at).toLocaleString()}</td>
                <td className="py-3 px-5"><span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : t.status === "processing" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminAffiliates() {
  const { data, refetch } = useFetch(() => get("/affiliates"));

  const payout = async (id, current_pending) => {
    const amt = prompt(`Payout amount for this affiliate? (pending $${current_pending})`, String(current_pending));
    if (!amt) return;
    await post(`/affiliates/${id}/payout`, { amount: Number(amt) });
    toast.success(`Paid out $${amt}`);
    refetch();
  };

  return (
    <div className="space-y-6" data-testid="admin-affiliates">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Growth</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Affiliates</h1>
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[700px]">
          <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]"><tr><th className="text-left py-3 px-5 font-medium">Affiliate</th><th className="text-left py-3 px-3 font-medium">Tier</th><th className="text-right py-3 px-3 font-medium">Refs</th><th className="text-right py-3 px-3 font-medium">Volume</th><th className="text-right py-3 px-3 font-medium">Lifetime</th><th className="text-right py-3 px-3 font-medium">Pending</th><th className="text-right py-3 px-5 font-medium">Action</th></tr></thead>
          <tbody>
            {(data || []).map(a => (
              <tr key={a.user_id} className="border-b border-[var(--border-soft)]">
                <td className="py-3 px-5 text-[var(--ink)] font-medium">@{a.username}</td>
                <td className="py-3 px-3"><span className="text-[10px] font-bold uppercase bg-[var(--purple-soft)] text-[#7C3AED] px-2 py-0.5 rounded">{a.tier}</span></td>
                <td className="py-3 px-3 text-right font-mono">{a.active_refs}</td>
                <td className="py-3 px-3 text-right font-mono">${a.volume.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-[#10B981] font-semibold">${a.lifetime_earnings.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-[#A78BFA] font-semibold">${a.pending_payout.toLocaleString()}</td>
                <td className="py-3 px-5 text-right">
                  {a.pending_payout > 0 && <button onClick={() => payout(a.user_id, a.pending_payout)} className="text-[11px] font-medium text-[var(--ink)] hover:underline">Pay out</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminSettlements() {
  const { data: items } = useFetch(() => get("/settlements"));
  const [selected, setSelected] = useState(null);
  const { data: detail } = useFetch(() => selected ? get(`/settlements/${selected}`) : Promise.resolve(null), { deps: [selected] });

  const summary = detail?.summary || {};

  return (
    <div className="space-y-6" data-testid="admin-settlements">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Terminal</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Settlements</h1>
        <p className="text-[13px] text-[var(--muted)] mt-2">Every settled match across the platform. Tap a row to see the event summary.</p>
      </div>
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
          <table className="w-full text-[13px] min-w-[560px]">
            <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]"><tr><th className="text-left py-3 px-5 font-medium">ID</th><th className="text-left py-3 px-3 font-medium">Kind</th><th className="text-left py-3 px-3 font-medium">Status</th><th className="text-left py-3 px-3 font-medium">Winner</th><th className="text-right py-3 px-3 font-medium">Prize</th><th className="text-left py-3 px-5 font-medium">Settled</th></tr></thead>
            <tbody>
              {(items || []).map(s => (
                <tr key={s.id} onClick={() => setSelected(s.id)} data-testid={`settlement-row-${s.id}`} className={`border-b border-[var(--border-soft)] cursor-pointer hover:bg-[var(--bg)] transition-colors ${selected === s.id ? "bg-[var(--lime-soft)]" : ""}`}>
                  <td className="py-3 px-5 font-mono font-semibold text-[var(--ink)] truncate max-w-[110px]" title={s.id}>{String(s.id).slice(0, 8)}…</td>
                  <td className="py-3 px-3"><span className="text-[10px] font-bold uppercase bg-[var(--tag)] text-[var(--muted)] px-2 py-0.5 rounded">{s.kind}</span></td>
                  <td className="py-3 px-3"><span className={`text-[10px] px-2 py-0.5 rounded-full ${s.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>{s.status}</span></td>
                  <td className="py-3 px-3 text-[var(--ink)]">@{s.winner}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#10B981]">${s.prize?.toLocaleString?.() || "—"}</td>
                  <td className="py-3 px-5 font-mono text-[11px] text-[var(--muted)]">{s.settled_at ? new Date(s.settled_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!items || items.length === 0) && <div className="p-10 text-center text-[var(--muted)]">No settlements yet.</div>}
        </div>
        <div className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6" data-testid="settlement-detail">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Event summary</div>
          <div className="text-base font-semibold text-[var(--ink)] mb-5 font-mono truncate" title={selected}>{selected ? `${String(selected).slice(0, 14)}…` : "Select a settlement"}</div>
          {!selected && <div className="text-[13px] text-[var(--muted)]">Click any row to load the full event detail.</div>}
          {selected && detail && (
            <div className="space-y-4">
              {summary.trader_a && (
                <div className="grid grid-cols-2 gap-3">
                  <Block label="Trader A" value={`@${summary.trader_a}`} />
                  <Block label="Trader B" value={`@${summary.trader_b}`} />
                </div>
              )}
              {summary.winner && summary.winner !== "—" && (
                <div className="bg-[var(--lime-soft)] border border-[#B4E04C]/40 rounded-2xl p-4">
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--ink)]">Winner</div>
                  <div className="text-[18px] font-bold text-[var(--ink)] mt-1">@{summary.winner}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {summary.account_size !== undefined && <Block label="Account size" value={`$${summary.account_size.toLocaleString()}`} mono />}
                {summary.entry_fee !== undefined && <Block label="Entry fee" value={`$${summary.entry_fee.toLocaleString()}`} mono />}
                {summary.prize !== undefined && <Block label="Prize" value={`$${summary.prize.toLocaleString()}`} mono accent />}
                {summary.status && <Block label="Status" value={summary.status} />}
              </div>
              {summary.started_at && (
                <div className="text-[11.5px] font-mono text-[var(--muted)] border-t border-[var(--border-soft)] pt-3">
                  <div>Started · {new Date(summary.started_at).toLocaleString()}</div>
                  {summary.ends_at && <div>Ended · {new Date(summary.ends_at).toLocaleString()}</div>}
                </div>
              )}
              {summary.void_reason && (
                <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-xl p-3">
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#7F1D1D]">Voided</div>
                  <div className="text-[13px] text-[#7F1D1D] mt-1">{summary.void_reason}</div>
                </div>
              )}
              {summary.note && (
                <div className="text-[13px] text-[var(--muted)] italic">{summary.note}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Block({ label, value, mono, accent }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border-soft)] rounded-xl px-3 py-2.5">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[var(--muted-2)]">{label}</div>
      <div className={`text-[14px] font-semibold mt-0.5 ${mono ? "font-mono" : ""} ${accent ? "text-[#10B981]" : "text-[var(--ink)]"}`}>{value}</div>
    </div>
  );
}
