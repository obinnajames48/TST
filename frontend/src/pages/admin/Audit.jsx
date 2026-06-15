import { ScrollText } from "lucide-react";
import { useFetch } from "@/lib/useFetch";
import { adminAuditLog } from "@/lib/adminApi";

export default function AdminAudit() {
  const { data: log } = useFetch(adminAuditLog, { pollMs: 5000 });

  return (
    <div className="space-y-6" data-testid="admin-audit">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--muted-2)]">Trace</div>
        <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-[var(--ink)] leading-tight mt-1">Audit log</h1>
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-x-auto">
        <table className="w-full text-[13px] min-w-[700px]">
          <thead className="text-[var(--muted-2)] text-[11px] border-b border-[var(--border)]">
            <tr><th className="text-left font-medium py-3 px-5">When</th><th className="text-left font-medium py-3 px-3">Action</th><th className="text-left font-medium py-3 px-3">Target</th><th className="text-left font-medium py-3 px-5">Meta</th></tr>
          </thead>
          <tbody>
            {(log || []).map((a, i) => (
              <tr key={i} className="border-b border-[var(--border-soft)]">
                <td className="py-3 px-5 font-mono text-[12px] text-[var(--muted)]">{new Date(a.created_at).toLocaleString()}</td>
                <td className="py-3 px-3"><span className="font-mono text-[11px] bg-[var(--tag)] text-[var(--ink)] px-2 py-0.5 rounded">{a.action}</span></td>
                <td className="py-3 px-3 font-mono text-[12px] text-[var(--ink-soft)] truncate max-w-xs">{a.target}</td>
                <td className="py-3 px-5 font-mono text-[11px] text-[var(--muted)]">{Object.keys(a.meta || {}).length > 0 ? JSON.stringify(a.meta) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!log || log.length === 0) && <div className="p-10 text-center text-[var(--muted)]"><ScrollText className="w-6 h-6 mx-auto mb-2" />Audit log empty.</div>}
      </div>
    </div>
  );
}
