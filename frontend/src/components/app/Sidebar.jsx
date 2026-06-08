import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Swords,
  Crown,
  Trophy,
  Users,
  Globe,
  BarChart3,
  Wallet,
  Bell,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { currentUser } from "@/lib/mockData";

const LOGO = "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/duel", label: "1v1 Duel Centre", icon: Swords },
  { to: "/app/royale", label: "Trading Royale", icon: Crown },
  { to: "/app/tournament", label: "Multi Trader", icon: Trophy },
  { to: "/app/tagteam", label: "Tag Team", icon: Users },
  { to: "/app/community", label: "Community Battles", icon: Globe, soon: true },
];

const navSecondary = [
  { to: "/app/stats", label: "My Stats", icon: BarChart3 },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/affiliate", label: "Affiliate", icon: Sparkles },
  { to: "/app/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const itemBase =
    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all";

  const linkClass = ({ isActive }) =>
    `${itemBase} ${
      isActive
        ? "bg-[#0F0F12] text-white"
        : "text-[#4B5563] hover:bg-[#F5F5F2] hover:text-[#0F0F12]"
    }`;

  return (
    <aside
      data-testid="app-sidebar"
      className="w-64 shrink-0 bg-[#FAFAF7] border-r border-[#ECECEA] h-screen sticky top-0 flex flex-col"
    >
      <div className="px-5 pt-6 pb-5 border-b border-[#ECECEA]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center"
          data-testid="sidebar-logo"
        >
          <img src={LOGO} alt="The Select Traders" className="h-8 w-auto" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">
          Compete
        </div>
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={onNavigate}
            className={linkClass}
            data-testid={`sidebar-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {({ isActive }) => (
              <>
                <n.icon className="w-[18px] h-[18px]" strokeWidth={2} />
                <span className="flex-1">{n.label}</span>
                {n.soon && (
                  <span className="text-[9px] font-medium uppercase tracking-wider bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                )}
                {isActive && !n.soon && (
                  <span className="w-1.5 h-1.5 bg-[#B4E04C] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="px-3 mt-6 mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">
          Account
        </div>
        {navSecondary.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={linkClass}
            data-testid={`sidebar-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <n.icon className="w-[18px] h-[18px]" strokeWidth={2} />
            <span className="flex-1">{n.label}</span>
            {n.badge && (
              <span className="text-[10px] font-semibold bg-[#A78BFA] text-white rounded-full min-w-[18px] h-[18px] grid place-items-center px-1">
                {n.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-[#ECECEA] pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0F0F12] grid place-items-center text-white text-sm font-bold">
            {currentUser.username[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[#0F0F12] truncate">
              @{currentUser.username}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  currentUser.plan === "PRO"
                    ? "bg-[#0F0F12] text-[#B4E04C]"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                }`}
              >
                {currentUser.plan}
              </span>
              <span className="text-[11px] text-[#6B7280] truncate">
                {currentUser.tier} · #{currentUser.globalRank}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          data-testid="sidebar-logout"
          className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2]/30 rounded-xl transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
