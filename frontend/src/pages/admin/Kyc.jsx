import { Check, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/lib/useFetch";
import { adminKycQueue, adminApproveKyc, adminRejectKyc } from "@/lib/adminApi";

export default function AdminKyc() {
  const { data: queue, refetch } = useFetch(adminKycQueue);

  const approve = async (id) => {
    try { await adminApproveKyc(id); toast.success("KYC approved"); refetch(); }
    catch (e) { toast.error(e.message); }
  };
  const reject = async (id) => {
    const r = prompt("Reason?");
    if (!r) return;
    try { await adminRejectKyc(id, r); toast.success("KYC rejected"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6" data-testid="admin-kyc">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Compliance</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">KYC queue</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(queue || []).map((u) => (
          <div key={u.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] text-sm grid place-items-center font-bold">{u.username[0]}</div>
                <div>
                  <div className="text-[14px] font-semibold text-[var(--ink)]">@{u.username}</div>
                  <div className="text-[11px] font-mono text-[var(--muted)]">{u.email}</div>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${u.kyc_status === "pending" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{u.kyc_status}</span>
            </div>
            <div className="rounded-xl bg-[var(--bg)] border-2 border-dashed border-[var(--border)] p-6 text-center mb-3">
              <ShieldCheck className="w-6 h-6 text-[var(--muted-2)] mx-auto mb-1" />
              <div className="text-[11px] text-[var(--muted)]">Mock document preview</div>
            </div>
            {u.kyc_status === "pending" ? (
              <div className="flex gap-2">
                <button onClick={() => approve(u.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--inverse)] text-[var(--inverse-fg)] text-[13px] font-medium py-2 rounded-full"><Check className="w-3.5 h-3.5" /> Approve</button>
                <button onClick={() => reject(u.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] text-[#EF4444] text-[13px] font-medium py-2 rounded-full"><X className="w-3.5 h-3.5" /> Reject</button>
              </div>
            ) : (
              <div className="text-[12px] text-[var(--muted)] text-center">No documents submitted yet.</div>
            )}
          </div>
        ))}
      </div>
      {(!queue || queue.length === 0) && <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center text-[var(--muted)]">Queue empty.</div>}
    </div>
  );
}
