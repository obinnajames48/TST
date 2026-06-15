import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3, Users, Swords, Banknote, ShieldCheck, ScrollText, LogOut, Globe,
} from "lucide-react";
import { clearAdminToken, isAdminAuthed } from "@/lib/adminApi";
import ThemeToggle from "@/components/ThemeToggle";

const LOGO = "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png";

const nav = [
  { to: "/admin", label: "Overview", icon: BarChart3, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/matches", label: "Matches", icon: Swords },
  { to: "/admin/transactions", label: "Transactions", icon: Banknote },
  { to: "/admin/finance", label: "Withdrawals", icon: Banknote },
  { to: "/admin/settlements", label: "Settlements", icon: ScrollText },
  { to: "/admin/affiliates", label: "Affiliates", icon: Globe },
  { to: "/admin/kyc", label: "KYC queue", icon: ShieldCheck },
  { to: "/admin/audit", label: "Audit log", icon: ScrollText },
  { to: "/admin/community", label: "Waitlist", icon: Globe },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;

  const link = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all ${isActive ? "bg-[var(--inverse)] text-[var(--inverse-fg)]" : "text-[var(--body)] hover:bg-[var(--bg-soft)] hover:text-[var(--ink)]"}`;

  const logout = () => { clearAdminToken(); navigate("/admin/login"); };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex" data-testid="admin-layout">
      <aside className="w-64 shrink-0 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0 flex flex-col" data-testid="admin-sidebar">
        <div className="px-5 pt-6 pb-5 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <img src={LOGO} alt="The Select Traders" className="h-7 w-auto" />
            <span className="text-[9px] font-bold tracking-[0.18em] uppercase bg-[#A78BFA] text-white px-2 py-0.5 rounded">Admin</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={link} data-testid={`admin-link-${n.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
              <n.icon className="w-[18px] h-[18px]" />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-4 pt-4 border-t border-[var(--border)]">
          <button onClick={logout} data-testid="admin-logout" className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[var(--muted)] hover:text-[#EF4444] hover:bg-[#FEE2E2]/30 rounded-xl">
            <LogOut className="w-[18px] h-[18px]" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[var(--bg)] backdrop-blur-xl border-b border-[var(--border)] h-16 px-8 flex items-center justify-between">
          <div className="text-[15px] font-semibold tracking-tight text-[var(--ink)]">Admin Portal</div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-[var(--muted)]">admin@selecttraders.com</span>
            <ThemeToggle />
          </div>
        </header>
        <div className="px-8 py-8"><Outlet /></div>
      </main>
    </div>
  );
}
