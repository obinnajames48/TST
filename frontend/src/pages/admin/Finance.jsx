import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/lib/useFetch";
import { adminWithdrawals, adminApproveWd, adminRejectWd } from "@/lib/adminApi";

export default function AdminFinance() {
  const { data: wds, refetch } = useFetch(adminWithdrawals);

  const approve = async (id) => {
    try { await adminApproveWd(id); toast.success("Approved"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const reject = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (!reason) return;
    try { await adminRejectWd(id, reason); toast.success("Rejected — balance refunded"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const pending = (wds || []).filter((w) => w.status === "processing");

  return (
    <div className="space-y-6" data-testid="admin-finance">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Money</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Withdrawal queue</h1>
        <p className="mt-1 text-[13px] text-[var(--muted)]">{pending.length} pending · {wds ? wds.length - pending.length : 0} processed</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[700px]">
          <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]">
            <tr>
              <th className="text-left font-medium py-3 px-5">User</th>
              <th className="text-left font-medium py-3 px-3">KYC</th>
              <th className="text-left font-medium py-3 px-3">Reference</th>
              <th className="text-right font-medium py-3 px-3">Amount</th>
              <th className="text-left font-medium py-3 px-3">Requested</th>
              <th className="text-left font-medium py-3 px-3">Status</th>
              <th className="text-right font-medium py-3 px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {(wds || []).map((w) => (
              <tr key={w.id} className="border-b border-[var(--border-soft)]">
                <td className="py-3 px-5 text-[var(--ink)] font-medium">@{w.username}</td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${w.kyc_status === "verified" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#FEF3C7] text-[#92400E]"}`}>{w.kyc_status}</span></td>
                <td className="py-3 px-3 font-mono text-[12px] text-[var(--ink-soft)]">{w.reference}</td>
                <td className="py-3 px-3 text-right font-mono font-semibold text-[#EF4444]">−${Math.abs(w.amount).toLocaleString()}</td>
                <td className="py-3 px-3 text-[var(--muted)] font-mono text-[12px]">{new Date(w.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${w.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : w.status === "processing" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>{w.status}</span></td>
                <td className="py-3 px-5 text-right">
                  {w.status === "processing" && (
                    <div className="inline-flex gap-2">
                      <button onClick={() => approve(w.id)} className="text-[11px] font-medium text-[#10B981] hover:underline inline-flex items-center gap-1"><Check className="w-3 h-3" /> Approve</button>
                      <button onClick={() => reject(w.id)} className="text-[11px] font-medium text-[#EF4444] hover:underline inline-flex items-center gap-1"><X className="w-3 h-3" /> Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!wds || wds.length === 0) && <div className="p-10 text-center text-[var(--muted)] text-[13px]">No withdrawals.</div>}
      </div>
    </div>
  );
}
