import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Plus, AlertCircle, CreditCard, Bitcoin, Building2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import { Wallet as WalletIcon, ShieldCheck } from "lucide-react";
import { currentUser, transactions } from "@/lib/mockData";

export default function Wallet() {
  const [depositAmt, setDepositAmt] = useState(100);
  const [method, setMethod] = useState("card");
  const [wdAmt, setWdAmt] = useState(50);
  const kycVerified = false;

  const deposit = () => {
    if (depositAmt < 10) return toast.error("Minimum deposit is $10");
    toast.success(`Mock deposit of $${depositAmt} initiated`);
  };

  const withdraw = () => {
    if (!kycVerified) return toast.error("Complete KYC before first withdrawal");
    if (wdAmt < 10) return toast.error("Minimum withdrawal is $10");
    toast.success(`Withdrawal of $${wdAmt} queued`);
  };

  return (
    <div data-testid="wallet-page" className="space-y-8">
      <PageHeader eyebrow="Money" title="Wallet." description="Deposit, withdraw, and track every transaction." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Available balance" value={`$${currentUser.balance.toLocaleString()}`} icon={WalletIcon} tone="lime" />
        <StatCard label="Pending (in matches)" value={`$${currentUser.pending.toLocaleString()}`} icon={AlertCircle} tone="purple" />
        <StatCard label="Lifetime earned" value={`$${currentUser.lifetimeEarned.toLocaleString()}`} icon={ShieldCheck} tone="dark" />
      </div>

      {!kycVerified && (
        <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-2xl p-5 flex items-start gap-4" data-testid="kyc-banner">
          <div className="w-10 h-10 rounded-xl bg-white grid place-items-center">
            <ShieldCheck className="w-5 h-5 text-[#92400E]" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-[#0F0F12]">KYC verification required</div>
            <p className="text-[13px] text-[#92400E] mt-0.5">
              Your first withdrawal requires identity verification. Upload your documents in Settings → KYC.
            </p>
          </div>
          <button className="bg-[#0F0F12] text-white text-[13px] font-medium px-4 py-2 rounded-full">
            Start KYC
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Deposit */}
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6" data-testid="deposit-card">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownToLine className="w-4 h-4 text-[#10B981]" />
            <div className="text-base font-semibold text-[#0F0F12]">Deposit</div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <MethodBtn active={method === "card"} onClick={() => setMethod("card")} icon={CreditCard} label="Card" />
            <MethodBtn active={method === "bank"} onClick={() => setMethod("bank")} icon={Building2} label="Bank" />
            <MethodBtn active={method === "crypto"} onClick={() => setMethod("crypto")} icon={Bitcoin} label="Crypto" />
          </div>

          <label className="block text-[12px] font-medium text-[#0F0F12] mb-2">Amount (USD)</label>
          <input
            type="number"
            value={depositAmt}
            onChange={(e) => setDepositAmt(Number(e.target.value))}
            className="w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-3 font-mono text-[15px] focus:outline-none focus:border-[#0F0F12]"
          />
          <div className="mt-2 flex gap-2">
            {[50, 100, 500, 1000].map((p) => (
              <button key={p} onClick={() => setDepositAmt(p)} className="text-[12px] px-3 py-1.5 rounded-full bg-[#F5F5F2] text-[#1F2024] hover:bg-[#ECECEA]">
                ${p}
              </button>
            ))}
          </div>
          <button onClick={deposit} className="mt-5 w-full bg-[#0F0F12] text-white font-medium text-[14px] py-3 rounded-full hover:bg-[#1F2024]">
            Add funds
          </button>
        </div>

        {/* Withdraw */}
        <div className="bg-white border border-[#ECECEA] rounded-2xl p-6" data-testid="withdraw-card">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpFromLine className="w-4 h-4 text-[#A78BFA]" />
            <div className="text-base font-semibold text-[#0F0F12]">Withdraw</div>
          </div>

          <div className="rounded-xl bg-[#FAFAF7] border border-[#F1F1EF] p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#9CA3AF]">Linked accounts</div>
              <button className="text-[11px] font-medium text-[#0F0F12] inline-flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <Building2 className="w-4 h-4 text-[#6B7280]" />
              <span className="font-mono">Bank •••1184</span>
              <span className="text-[10px] text-[#10B981] font-medium ml-auto">Default</span>
            </div>
          </div>

          <label className="block text-[12px] font-medium text-[#0F0F12] mb-2">Amount (USD)</label>
          <input
            type="number"
            value={wdAmt}
            onChange={(e) => setWdAmt(Number(e.target.value))}
            className="w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-3 font-mono text-[15px] focus:outline-none focus:border-[#0F0F12]"
          />
          <div className="mt-2 text-[11px] text-[#6B7280]">Minimum $10. Available: ${currentUser.balance.toLocaleString()}.</div>
          <button onClick={withdraw} className="mt-5 w-full bg-[#0F0F12] text-white font-medium text-[14px] py-3 rounded-full hover:bg-[#1F2024]">
            Withdraw
          </button>
        </div>
      </div>

      {/* Tx history */}
      <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 overflow-x-auto" data-testid="transactions-table">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">History</div>
        <div className="text-base font-semibold text-[#0F0F12] mb-4">Transactions</div>
        <table className="w-full text-[13px] min-w-[640px]">
          <thead className="text-[#9CA3AF] text-[11px]">
            <tr>
              <th className="text-left font-medium py-2 pr-4">Date</th>
              <th className="text-left font-medium py-2 pr-4">Type</th>
              <th className="text-left font-medium py-2 pr-4">Reference</th>
              <th className="text-right font-medium py-2 pr-4">Amount</th>
              <th className="text-right font-medium py-2">Status</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-[#F1F1EF]">
                <td className="py-3 pr-4 text-[#6B7280]">{t.date}</td>
                <td className="py-3 pr-4 text-[#0F0F12]">{t.type}</td>
                <td className="py-3 pr-4 text-[#1F2024]">{t.ref}</td>
                <td className={`py-3 pr-4 text-right font-semibold ${t.amount >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {t.amount >= 0 ? "+" : "−"}${Math.abs(t.amount).toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    t.status === "completed" ? "bg-[#10B981]/10 text-[#10B981]" :
                    t.status === "processing" ? "bg-[#FEF3C7] text-[#92400E]" :
                    "bg-[#F3F4F6] text-[#6B7280]"
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MethodBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${active ? "bg-[#0F0F12] text-white border-[#0F0F12]" : "bg-white border-[#ECECEA] text-[#1F2024] hover:bg-[#F5F5F2]"}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[12px] font-medium">{label}</span>
    </button>
  );
}
