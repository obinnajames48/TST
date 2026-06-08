import { Bell, Check, Trophy, Wallet, Sparkles, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import { notifications } from "@/lib/mockData";

const iconFor = {
  pair: Sparkles,
  prize: Wallet,
  tournament: Trophy,
  system: ShieldCheck,
};

const toneFor = {
  pair: "bg-[#EDE7FE] text-[#7C3AED]",
  prize: "bg-[#E6F4C2] text-[#0F0F12]",
  tournament: "bg-[#F3F4F6] text-[#0F0F12]",
  system: "bg-[#FEF3C7] text-[#92400E]",
};

export default function Notifications() {
  return (
    <div data-testid="notifications-page" className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications."
        description="Pairings, prizes, tournaments and system alerts."
        actions={
          <button className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0F0F12] bg-white border border-[#ECECEA] px-4 py-2 rounded-full hover:bg-[#F5F5F2]">
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        }
      />

      <div className="bg-white border border-[#ECECEA] rounded-2xl divide-y divide-[#F1F1EF]">
        {notifications.map((n) => {
          const Icon = iconFor[n.type] || Bell;
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 ${n.unread ? "bg-[#FAFAF7]/60" : ""}`} data-testid={`notif-${n.id}`}>
              <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${toneFor[n.type]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-[14px] font-semibold text-[#0F0F12]">{n.title}</div>
                  {n.unread && <span className="w-1.5 h-1.5 bg-[#A78BFA] rounded-full" />}
                </div>
                <p className="text-[13px] text-[#4B5563] mt-0.5">{n.body}</p>
              </div>
              <span className="text-[11px] text-[#9CA3AF] font-mono shrink-0">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
