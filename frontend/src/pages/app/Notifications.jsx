import { Bell, Check, Trophy, Wallet, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { useFetch } from "@/lib/useFetch";
import { listNotifications, markAllRead } from "@/lib/api";

const iconFor = { pair: Sparkles, prize: Wallet, tournament: Trophy, system: ShieldCheck, match_start: Sparkles, match_end: Trophy };
const toneFor = { pair: "bg-[var(--purple-soft)] text-[#7C3AED]", prize: "bg-[var(--lime-soft)] text-[var(--ink)]", tournament: "bg-[var(--tag)] text-[var(--ink)]", system: "bg-[#FEF3C7] text-[#92400E]", match_start: "bg-[var(--purple-soft)] text-[#7C3AED]", match_end: "bg-[var(--lime-soft)] text-[var(--ink)]" };

function relativeTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Notifications() {
  const { data: notifsRaw, refetch } = useFetch(listNotifications, { pollMs: 8000 });
  const notifs = notifsRaw || [];

  const markAll = async () => {
    try { await markAllRead(); toast.success("All marked read"); refetch(); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div data-testid="notifications-page" className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications."
        description="Pairings, prizes, tournaments and system alerts."
        actions={
          <button onClick={markAll} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink)] bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-full hover:bg-[var(--bg-soft)]">
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        }
      />
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl divide-y divide-[var(--border-soft)]">
        {notifs.length === 0 && <div className="p-10 text-center text-[var(--muted)]">No notifications yet.</div>}
        {notifs.map((n) => {
          const Icon = iconFor[n.type] || Bell;
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 ${n.unread ? "bg-[var(--bg)]" : ""}`} data-testid={`notif-${n.id}`}>
              <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${toneFor[n.type] || "bg-[var(--tag)] text-[var(--ink)]"}`}><Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><div className="text-[14px] font-semibold text-[var(--ink)]">{n.title}</div>{n.unread && <span className="w-1.5 h-1.5 bg-[#A78BFA] rounded-full" />}</div>
                <p className="text-[13px] text-[var(--body)] mt-0.5">{n.body}</p>
              </div>
              <span className="text-[11px] text-[var(--muted-2)] font-mono shrink-0">{relativeTime(n.created_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
