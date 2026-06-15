import { useState } from "react";
import { Search, Ban, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/lib/useFetch";
import { adminListUsers, adminSetPlan, adminSuspend, adminUnsuspend } from "@/lib/adminApi";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [plan, setPlan] = useState("all");
  const { data: users, refetch } = useFetch(() => adminListUsers(q, plan), { deps: [q, plan] });

  const togglePlan = async (u) => {
    try { await adminSetPlan(u.id, u.plan === "PRO" ? "FREE" : "PRO"); toast.success("Plan updated"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  const toggleSuspend = async (u) => {
    try {
      if (u.suspended) { await adminUnsuspend(u.id); toast.success("Unsuspended"); }
      else { await adminSuspend(u.id, "Manual admin action"); toast.success("Suspended"); }
      refetch();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6" data-testid="admin-users">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Manage</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Users</h1>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-2)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search username or email…" className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full pl-10 pr-4 py-2.5 text-[13px] placeholder:text-[var(--muted-2)] focus:outline-none focus:border-[var(--ink)]" />
        </div>
        {["all", "FREE", "PRO"].map((p) => (
          <button key={p} onClick={() => setPlan(p)} className={`text-[12px] px-3 py-1.5 rounded-full border ${plan === p ? "bg-[var(--inverse)] text-[var(--inverse-fg)] border-[var(--ink)]" : "bg-[var(--surface)] border-[var(--border)] text-[var(--ink-soft)]"}`}>{p}</button>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[800px]">
          <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]">
            <tr>
              <th className="text-left font-medium py-3 px-5">User</th>
              <th className="text-left font-medium py-3 px-3">Email</th>
              <th className="text-left font-medium py-3 px-3">Country</th>
              <th className="text-left font-medium py-3 px-3">Plan</th>
              <th className="text-left font-medium py-3 px-3">KYC</th>
              <th className="text-right font-medium py-3 px-3">Balance</th>
              <th className="text-right font-medium py-3 px-3">Lifetime</th>
              <th className="text-right font-medium py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map((u) => (
              <tr key={u.id} className="border-b border-[var(--border-soft)] hover:bg-[var(--bg)]" data-testid={`admin-user-${u.username}`}>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[var(--inverse)] text-[var(--inverse-fg)] text-[10px] grid place-items-center font-bold">{u.username[0]}</span>
                    <span className="font-medium text-[var(--ink)]">@{u.username}</span>
                    {u.suspended && <span className="text-[9px] font-bold uppercase bg-[#FEE2E2] text-[#DC2626] px-1.5 py-0.5 rounded">Susp.</span>}
                  </div>
                </td>
                <td className="py-3 px-3 text-[var(--ink-soft)] font-mono text-[12px]">{u.email}</td>
                <td className="py-3 px-3">{u.country}</td>
                <td className="py-3 px-3">
                  <button onClick={() => togglePlan(u)} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${u.plan === "PRO" ? "bg-[#0F0F12] text-[#B4E04C]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{u.plan}</button>
                </td>
                <td className="py-3 px-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${u.kyc_status === "verified" ? "bg-[#10B981]/10 text-[#10B981]" : u.kyc_status === "pending" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[var(--tag)] text-[var(--muted)]"}`}>{u.kyc_status}</span></td>
                <td className="py-3 px-3 text-right font-mono text-[var(--ink)]">${u.balance.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-mono text-[#10B981] font-semibold">${u.lifetime_earned.toLocaleString()}</td>
                <td className="py-3 px-5 text-right">
                  <button onClick={() => toggleSuspend(u)} className="text-[11px] font-medium text-[#EF4444] hover:underline inline-flex items-center gap-1">
                    <Ban className="w-3 h-3" /> {u.suspended ? "Unsusp" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && <div className="p-10 text-center text-[var(--muted)] text-[13px]">No users found.</div>}
      </div>
    </div>
  );
}
