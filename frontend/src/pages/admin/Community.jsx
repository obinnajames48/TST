import { Mail } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import { adminCommunitySignups } from "@/lib/adminApi";

export default function AdminCommunity() {
  const { data: signups } = useFetch(adminCommunitySignups);

  return (
    <div className="space-y-6" data-testid="admin-community">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Lead capture</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Community Battles waitlist</h1>
        <p className="mt-1 text-[13px] text-[var(--muted)]">{(signups || []).length} signups collected</p>
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[500px]">
          <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]"><tr><th className="text-left font-medium py-3 px-5">Email</th><th className="text-left font-medium py-3 px-3">Source</th><th className="text-left font-medium py-3 px-5">Joined</th></tr></thead>
          <tbody>
            {(signups || []).map((s) => (
              <tr key={s.id} className="border-b border-[var(--border-soft)]">
                <td className="py-3 px-5 font-mono text-[var(--ink)]"><Mail className="w-3.5 h-3.5 inline mr-2 text-[var(--muted-2)]" />{s.email}</td>
                <td className="py-3 px-3"><span className="text-[10px] uppercase tracking-wider bg-[var(--tag)] text-[var(--muted)] px-2 py-0.5 rounded">{s.source}</span></td>
                <td className="py-3 px-5 font-mono text-[12px] text-[var(--muted)]">{new Date(s.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!signups || signups.length === 0) && <div className="p-10 text-center text-[var(--muted)]">No signups yet.</div>}
      </div>
    </div>
  );
}
