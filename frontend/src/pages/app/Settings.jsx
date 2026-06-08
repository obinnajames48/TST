import { useState } from "react";
import { toast } from "sonner";
import { Lock, ShieldCheck, Upload, Sparkles, Bell, Link as LinkIcon, Mail, Phone, KeyRound } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { currentUser } from "@/lib/mockData";

export default function Settings() {
  return (
    <div data-testid="settings-page" className="space-y-8">
      <PageHeader eyebrow="Configure" title="Settings." description="Profile, security, billing, KYC and notifications." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white border border-[#ECECEA] rounded-full p-1 inline-flex h-auto overflow-x-auto max-w-full">
          {[
            { v: "profile", l: "Profile" },
            { v: "account", l: "Account" },
            { v: "notifications", l: "Notifications" },
            { v: "subscription", l: "Subscription" },
            { v: "kyc", l: "KYC" },
            { v: "linked", l: "Linked accounts" },
          ].map((t) => (
            <TabsTrigger
              key={t.v}
              value={t.v}
              data-testid={`settings-tab-${t.v}`}
              className="rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap data-[state=active]:bg-[#0F0F12] data-[state=active]:text-white"
            >
              {t.l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Profile />
        </TabsContent>
        <TabsContent value="account" className="mt-6">
          <Account />
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <Notifs />
        </TabsContent>
        <TabsContent value="subscription" className="mt-6">
          <Subscription />
        </TabsContent>
        <TabsContent value="kyc" className="mt-6">
          <Kyc />
        </TabsContent>
        <TabsContent value="linked" className="mt-6">
          <Linked />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ title, desc, children }) {
  return (
    <div className="bg-white border border-[#ECECEA] rounded-2xl p-6">
      {title && <div className="text-base font-semibold text-[#0F0F12]">{title}</div>}
      {desc && <p className="text-[13px] text-[#6B7280] mt-1 mb-4">{desc}</p>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#0F0F12] mb-1.5">{label}</label>
      {children}
      {hint && <div className="text-[11px] text-[#6B7280] mt-1.5">{hint}</div>}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#0F0F12] ${props.className || ""}`}
    />
  );
}

function Profile() {
  const [name, setName] = useState(currentUser.fullName);
  const [bio, setBio] = useState("Competitive scalper. FX focus. Building a 7-day streak.");

  const save = () => toast.success("Profile saved");
  return (
    <Card title="Profile">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#0F0F12] text-white text-xl grid place-items-center font-bold">
          {currentUser.username[0]}
        </div>
        <button className="text-[13px] font-medium border border-[#ECECEA] bg-white px-4 py-2 rounded-full hover:bg-[#F5F5F2]">
          Upload avatar
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Field label="Display name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Username" hint="Permanent. Cannot be changed under any circumstance.">
          <div className="relative">
            <Input value={`@${currentUser.username}`} readOnly className="bg-[#F3F4F6] text-[#6B7280] cursor-not-allowed" />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
          </div>
        </Field>
      </div>
      <Field label="Bio">
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full bg-[#FAFAF7] border border-[#ECECEA] rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:border-[#0F0F12]" />
      </Field>
      <button onClick={save} className="mt-5 bg-[#0F0F12] text-white font-medium text-[14px] px-5 py-2.5 rounded-full">
        Save changes
      </button>
    </Card>
  );
}

function Account() {
  const [twoFa, setTwoFa] = useState(false);
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card title="Contact">
        <Field label="Email">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <Input defaultValue="riley@example.com" className="pl-9" />
          </div>
        </Field>
        <div className="h-3" />
        <Field label="Phone">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <Input placeholder="+1 555 0123" className="pl-9" />
          </div>
        </Field>
      </Card>
      <Card title="Security">
        <Field label="Password" hint="Last changed 14 days ago.">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <Input type="password" value="••••••••••" readOnly className="pl-9" />
          </div>
        </Field>
        <div className="mt-3">
          <button className="text-[13px] font-medium text-[#0F0F12] underline underline-offset-4 decoration-[#B4E04C] decoration-2">
            Change password
          </button>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-[#F1F1EF] pt-4">
          <div>
            <div className="text-[14px] font-semibold text-[#0F0F12]">Two-factor authentication</div>
            <div className="text-[12px] text-[#6B7280]">Protect your account with a TOTP code.</div>
          </div>
          <Switch checked={twoFa} onCheckedChange={setTwoFa} />
        </div>
      </Card>
    </div>
  );
}

function Notifs() {
  const [state, setState] = useState({
    match_start: true,
    pairing: true,
    opponent_accepted: true,
    prize_credited: true,
    tournament_update: false,
  });
  return (
    <Card title="Notifications" desc="Choose what we ping you about.">
      {[
        { k: "match_start", l: "Match started", d: "Sent when your duel goes live." },
        { k: "pairing", l: "Pairing found", d: "When the spawn centre matches you." },
        { k: "opponent_accepted", l: "Opponent accepted", d: "When your opponent accepts the duel." },
        { k: "prize_credited", l: "Prize credited", d: "When winnings hit your wallet." },
        { k: "tournament_update", l: "Tournament update", d: "Round advancements and brackets." },
      ].map((row) => (
        <div key={row.k} className="flex items-center justify-between py-3 border-b border-[#F1F1EF] last:border-0">
          <div className="flex items-start gap-3">
            <Bell className="w-4 h-4 text-[#6B7280] mt-0.5" />
            <div>
              <div className="text-[14px] font-medium text-[#0F0F12]">{row.l}</div>
              <div className="text-[12px] text-[#6B7280]">{row.d}</div>
            </div>
          </div>
          <Switch checked={state[row.k]} onCheckedChange={(v) => setState({ ...state, [row.k]: v })} />
        </div>
      ))}
    </Card>
  );
}

function Subscription() {
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Current plan</div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#0F0F12]">Pro</span>
          <span className="text-sm text-[#6B7280] font-mono">$49 / month</span>
        </div>
        <div className="mt-2 text-[13px] text-[#4B5563]">Next billing: Mar 6, 2026 · Card •••4242</div>
        <div className="mt-5 flex gap-2">
          <button className="bg-[#0F0F12] text-white font-medium text-[13px] px-4 py-2 rounded-full">Manage billing</button>
          <button className="border border-[#ECECEA] text-[#0F0F12] font-medium text-[13px] px-4 py-2 rounded-full bg-white hover:bg-[#F5F5F2]">Cancel</button>
        </div>
      </Card>

      <div className="bg-[#0F0F12] text-white rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-[#A78BFA] rounded-full blur-[100px] opacity-30 pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 bg-[#A78BFA] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> Why Pro
          </div>
          <div className="mt-4 text-lg font-semibold">Create custom duels, set your own rules.</div>
          <ul className="mt-3 space-y-1.5 text-[13px] text-white/80">
            <li>• Custom leverage / drawdown</li>
            <li>• Highlighted Pro listings in broadcast</li>
            <li>• Priority in spawn matching queue</li>
            <li>• Advanced analytics & trade replay</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Kyc() {
  return (
    <Card title="KYC verification" desc="Required before your first withdrawal.">
      <div className="rounded-xl border-2 border-dashed border-[#ECECEA] p-8 text-center bg-[#FAFAF7]">
        <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
        <div className="text-[14px] font-medium text-[#0F0F12]">Upload your documents</div>
        <div className="text-[12px] text-[#6B7280] mt-1">Passport or driver's license + proof of address (PDF or JPG, max 8MB).</div>
        <button onClick={() => toast.success("Mock upload — KYC pending review")} className="mt-4 bg-[#0F0F12] text-white text-[13px] font-medium px-4 py-2 rounded-full">
          Choose files
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[13px] text-[#6B7280]">Status</span>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Not started
        </span>
      </div>
    </Card>
  );
}

function Linked() {
  return (
    <Card title="Linked accounts" desc="Bank accounts and crypto wallets for withdrawals.">
      <div className="space-y-2">
        {[
          { label: "Bank •••1184", type: "Bank", country: "🇺🇸" },
          { label: "USDT (TRC20) •••f7c2", type: "Crypto", country: "—" },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-[#ECECEA] p-3">
            <LinkIcon className="w-4 h-4 text-[#6B7280]" />
            <div className="flex-1">
              <div className="text-[14px] font-medium text-[#0F0F12]">{l.label}</div>
              <div className="text-[11px] text-[#6B7280]">{l.type} · {l.country}</div>
            </div>
            <button className="text-[12px] text-[#EF4444] font-medium">Remove</button>
          </div>
        ))}
      </div>
      <button className="mt-4 bg-[#0F0F12] text-white text-[13px] font-medium px-4 py-2 rounded-full">+ Add new</button>
    </Card>
  );
}
