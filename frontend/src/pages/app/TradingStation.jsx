import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, Hourglass, CheckCircle2, ArrowUpRight, Swords, Crown, Trophy } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFetch } from "@/lib/useFetch";
import { getTradingStation } from "@/lib/api";

const KIND_META = {
  "duel-pro": { label: "Pro Duel", icon: Swords, color: "bg-[#EDE7FE] text-[#7C3AED]" },
  "duel-standard": { label: "Duel", icon: Swords, color: "bg-[#E6F4C2] text-[#0F0F12]" },
  royale: { label: "Royale", icon: Crown, color: "bg-[#FEE2E2] text-[#DC2626]" },
  tournament: { label: "Tournament", icon: Trophy, color: "bg-[#FEF3C7] text-[#92400E]" },
};

const TABS = [
  { value: "active", label: "Active", icon: Radio, hint: "Currently trading" },
  { value: "pending", label: "Pending", icon: Hourglass, hint: "Waiting to start" },
  { value: "completed", label: "Completed", icon: CheckCircle2, hint: "Settled & archived" },
];

export default function TradingStation() {
  const { data, refetch } = useFetch(getTradingStation, { pollMs: 4000 });
  const [tab, setTab] = useState("active");
  const groups = data || { active: [], pending: [], completed: [] };

  return (
    <div data-testid="trading-station-page" className="space-y-6">
      <PageHeader
        eyebrow="Your events"
        title="Trading Station"
        description="Every duel, royale and tournament you've ever entered — in one place. Live now, waiting to start, or done and dusted."
      />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-white border border-[#ECECEA] rounded-full p-1 inline-flex h-auto" data-testid="station-tabs">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              data-testid={`station-tab-${t.value}`}
              className="rounded-full px-5 py-2 text-[13px] font-medium data-[state=active]:bg-[#0F0F12] data-[state=active]:text-white inline-flex items-center gap-2"
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              <span className="inline-flex items-center justify-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#F5F5F2] text-[#0F0F12] data-[state=active]:bg-white/15 data-[state=active]:text-white">
                {groups[t.value]?.length || 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-6">
            <EventList items={groups[t.value] || []} variant={t.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function EventList({ items, variant }) {
  const navigate = useNavigate();
  if (!items.length) {
    return (
      <div className="bg-white border border-dashed border-[#ECECEA] rounded-2xl p-12 text-center" data-testid={`station-empty-${variant}`}>
        <div className="text-[13px] text-[#6B7280]">
          {variant === "active" && "You're not in any live event right now. Spawn a duel or join a royale to get started."}
          {variant === "pending" && "Nothing waiting. Join a queue or register for an upcoming tournament."}
          {variant === "completed" && "Your settled events will live here. Play a match to fill this up."}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white border border-[#ECECEA] rounded-2xl divide-y divide-[#F1F1EF]" data-testid={`station-list-${variant}`}>
      {items.map((it) => {
        const meta = KIND_META[it.kind] || KIND_META["duel-standard"];
        const Icon = meta.icon;
        return (
          <button
            key={it.id}
            onClick={() => navigate(it.link)}
            data-testid={`station-row-${it.id}`}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAF7] text-left transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${meta.color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#9CA3AF]">{meta.label}</span>
                <span className="font-mono text-[11px] text-[#6B7280]">{String(it.id).slice(0, 10)}</span>
                <StatusPill status={it.status} variant={variant} />
              </div>
              <div className="mt-1 text-[14px] font-semibold text-[#0F0F12] truncate">{it.label}</div>
              <div className="mt-0.5 text-[12px] text-[#6B7280] truncate">
                {it.opponent && <span>vs {it.opponent}</span>}
                {it.account_size && <span> · ${it.account_size.toLocaleString()} account</span>}
                {it.entry_fee !== undefined && it.entry_fee !== null && <span> · Entry ${it.entry_fee}</span>}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              {it.pnl !== null && it.pnl !== undefined && (
                <div className={`font-mono text-[15px] font-bold ${it.pnl >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {it.pnl >= 0 ? "+" : "−"}${Math.abs(it.pnl).toFixed(0)}
                </div>
              )}
              {it.prize && variant === "completed" && (
                <div className="font-mono text-[11px] text-[#6B7280]">Prize ${it.prize.toLocaleString()}</div>
              )}
              {it.time_left_seconds && variant !== "completed" && (
                <div className="font-mono text-[11px] text-[#6B7280]">{formatLeft(it.time_left_seconds)}</div>
              )}
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          </button>
        );
      })}
    </div>
  );
}

function StatusPill({ status, variant }) {
  const map = {
    live: { txt: "Live", cls: "bg-[#EF4444]/10 text-[#EF4444]" },
    active: { txt: "Active", cls: "bg-[#EF4444]/10 text-[#EF4444]" },
    pending: { txt: "Pending", cls: "bg-[#E6F4C2] text-[#0F0F12]" },
    pairing: { txt: "Pairing", cls: "bg-[#E6F4C2] text-[#0F0F12]" },
    completed: { txt: "Settled", cls: "bg-[#10B981]/10 text-[#10B981]" },
    voided: { txt: "Voided", cls: "bg-[#F3F4F6] text-[#6B7280]" },
  };
  const m = map[status] || { txt: status, cls: "bg-[#F3F4F6] text-[#6B7280]" };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${m.cls}`}>{m.txt}</span>;
}

function formatLeft(seconds) {
  if (seconds < 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}
