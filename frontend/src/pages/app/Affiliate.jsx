import { useState } from "react";
import { Copy, Trophy, Users as UsersIcon, TrendingUp, Wallet, Sparkles } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import { useFetch } from "@/lib/useFetch";

const BASE = process.env.REACT_APP_BACKEND_URL;
const get = (p) => fetch(`${BASE}/api${p}`).then(r => r.json());

export default function Affiliate() {
  const { data: aff } = useFetch(() => get("/me/affiliate"));
  const { data: refs } = useFetch(() => get("/me/affiliate/referrals"));
  const { data: payouts } = useFetch(() => get("/me/affiliate/payouts"));

  if (!aff) return <div className="h-96 bg-white rounded-2xl border border-[#ECECEA] animate-pulse" />;

  const copyLink = () => { navigator.clipboard.writeText(aff.ref_link); toast.success("Referral link copied"); };

  return (
    <div className="space-y-8" data-testid="affiliate-page">
      <PageHeader eyebrow="Earn" title="Affiliate program." description="Refer traders. Earn on every duel they enter. Climb tiers through engagement." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tier" value={aff.tier.name} icon={Trophy} tone={aff.tier.color === "dark" ? "dark" : aff.tier.color} />
        <StatCard label="Active referrals" value={aff.active_refs} icon={UsersIcon} tone="lime" />
        <StatCard label="Referred volume" value={`$${aff.referred_volume.toLocaleString()}`} icon={TrendingUp} tone="purple" />
        <StatCard label="Lifetime earnings" value={`$${aff.lifetime_earnings.toLocaleString()}`} icon={Wallet} tone="neutral" />
      </div>

      <div className="bg-[#0F0F12] text-white rounded-3xl p-7 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#A78BFA] rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#B4E04C] rounded-full blur-[100px] opacity-15 pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">Your link</div>
          <div className="mt-2 flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-2">
            <code className="flex-1 px-3 font-mono text-[14px] truncate">{aff.ref_link}</code>
            <button onClick={copyLink} className="inline-flex items-center gap-1.5 bg-[#B4E04C] text-[#0F0F12] font-semibold text-[13px] px-4 py-2.5 rounded-xl">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <p className="mt-3 text-[12px] text-white/50">Share your link. Every duel entered by your referrals earns you <strong className="text-[#B4E04C]">{aff.tier.rev_share_pct}%</strong> rev share plus <strong className="text-[#B4E04C]">${aff.tier.signup_bonus}</strong> per qualified signup.</p>
        </div>
      </div>

      {aff.next_tier && (
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Progress</div>
              <div className="text-base font-semibold text-[#0F0F12]">To {aff.next_tier.name}</div>
            </div>
            <Sparkles className="w-5 h-5 text-[#A78BFA]" />
          </div>
          <div className="space-y-3">
            <Progress label="Active referrals" current={aff.active_refs} target={aff.next_tier.min_refs} />
            <Progress label="Referred volume" current={aff.referred_volume} target={aff.next_tier.min_volume} prefix="$" />
          </div>
        </div>
      )}

      <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
        <div className="text-base font-semibold text-[#0F0F12] mb-4">Tier ladder</div>
        <div className="grid md:grid-cols-4 gap-3">
          {aff.tiers.map((t) => {
            const active = t.name === aff.tier.name;
            return (
              <div key={t.name} className={`rounded-xl p-4 border ${active ? "bg-[#E6F4C2] border-[#B4E04C]" : "bg-[#FAFAF7] border-[#F1F1EF]"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-[15px] font-semibold text-[#0F0F12]">{t.name}</div>
                  {active && <span className="text-[9px] font-bold uppercase bg-[#0F0F12] text-[#B4E04C] px-1.5 py-0.5 rounded">You</span>}
                </div>
                <div className="mt-2 text-[12px] font-mono text-[#1F2024]">{t.rev_share_pct}% rev share</div>
                <div className="text-[12px] font-mono text-[#1F2024]">${t.signup_bonus} / signup</div>
                <div className="mt-2 text-[11px] text-[#6B7280]">≥{t.min_refs} refs · ${t.min_volume.toLocaleString()} vol</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 overflow-x-auto">
          <div className="text-base font-semibold text-[#0F0F12] mb-4">Your referrals</div>
          <table className="w-full text-[13px] min-w-[420px]">
            <thead className="text-[#9CA3AF] text-[11px]"><tr><th className="text-left font-medium py-2 pr-3">User</th><th className="text-left font-medium py-2 pr-3">Joined</th><th className="text-right font-medium py-2 pr-3">Volume</th><th className="text-right font-medium py-2">Earned</th></tr></thead>
            <tbody className="font-mono">
              {(refs || []).map((r, i) => (
                <tr key={i} className="border-t border-[#F1F1EF]">
                  <td className="py-2.5 pr-3"><span className="text-[#0F0F12]">@{r.username}</span>{r.active && <span className="ml-2 text-[9px] font-bold uppercase bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded">Active</span>}</td>
                  <td className="py-2.5 pr-3 text-[#6B7280]">{r.joined}</td>
                  <td className="py-2.5 pr-3 text-right text-[#1F2024]">${r.volume}</td>
                  <td className="py-2.5 text-right text-[#10B981] font-semibold">+${r.earned_for_you}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-base font-semibold text-[#0F0F12]">Payout history</div>
            <span className="text-[11px] text-[#6B7280] font-mono">Pending: <strong className="text-[#A78BFA]">${aff.pending_payout}</strong></span>
          </div>
          <table className="w-full text-[13px] min-w-[420px]">
            <thead className="text-[#9CA3AF] text-[11px]"><tr><th className="text-left font-medium py-2 pr-3">ID</th><th className="text-left font-medium py-2 pr-3">Date</th><th className="text-left font-medium py-2 pr-3">Method</th><th className="text-right font-medium py-2 pr-3">Amount</th><th className="text-right font-medium py-2">Status</th></tr></thead>
            <tbody className="font-mono">
              {(payouts || []).map((p) => (
                <tr key={p.id} className="border-t border-[#F1F1EF]">
                  <td className="py-2.5 pr-3 text-[#0F0F12]">{p.id}</td>
                  <td className="py-2.5 pr-3 text-[#6B7280]">{p.date}</td>
                  <td className="py-2.5 pr-3 text-[#1F2024]">{p.method}</td>
                  <td className="py-2.5 pr-3 text-right text-[#10B981] font-semibold">+${p.amount}</td>
                  <td className="py-2.5 text-right"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#FEF3C7] text-[#92400E]"}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Progress({ label, current, target, prefix = "" }) {
  const pct = Math.min(100, (current / Math.max(1, target)) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-1.5">
        <span className="text-[#6B7280]">{label}</span>
        <span className="font-mono font-semibold text-[#0F0F12]">{prefix}{Math.round(current).toLocaleString()} / {prefix}{target.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#B4E04C] to-[#A78BFA] rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
