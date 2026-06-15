import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, Sparkles } from "lucide-react";
import { currentUser } from "@/lib/mockData";
import ThemeToggle from "@/components/ThemeToggle";

const titles = {
  "/app": "Dashboard",
  "/app/duel": "1v1 Duel Centre",
  "/app/royale": "Trading Royale",
  "/app/tournament": "Multi Trader",
  "/app/tagteam": "Tag Team",
  "/app/community": "Community Battles",
  "/app/stats": "My Stats",
  "/app/wallet": "Wallet",
  "/app/notifications": "Notifications",
  "/app/settings": "Settings",
};

export default function Topbar({ onOpenSidebar }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const title = titles[pathname] || (pathname.startsWith("/app/match") ? "Live Match" : "Dashboard");

  return (
    <header
      data-testid="app-topbar"
      className="sticky top-0 z-30 bg-[var(--bg)] backdrop-blur-xl border-b border-[var(--border)]"
    >
      <div className="h-16 px-5 lg:px-8 flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden -ml-1 p-2 rounded-lg hover:bg-[var(--bg-soft)]"
          data-testid="topbar-mobile-toggle"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-lg font-semibold tracking-tight text-[var(--ink)]">
            {title}
          </h1>
        </div>

        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-2)]" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search duels, traders, lobbies…"
              data-testid="topbar-search"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full pl-10 pr-4 py-2 text-[13px] placeholder:text-[var(--muted-2)] focus:outline-none focus:border-[var(--ink)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {currentUser.plan === "FREE" && (
            <button
              onClick={() => navigate("/app/settings")}
              className="hidden md:inline-flex items-center gap-1.5 bg-[var(--inverse)] text-[var(--inverse-fg)] text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-[var(--ink-soft)]"
              data-testid="topbar-upgrade"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B4E04C]" />
              Upgrade to Pro
            </button>
          )}
          <button
            onClick={() => navigate("/app/notifications")}
            className="relative w-10 h-10 grid place-items-center bg-[var(--surface)] border border-[var(--border)] rounded-full hover:bg-[var(--bg-soft)]"
            data-testid="topbar-notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[var(--ink)]" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-[#A78BFA] rounded-full ring-2 ring-[var(--bg)]" />
          </button>
          <button
            onClick={() => navigate("/app/settings")}
            className="w-10 h-10 rounded-full bg-[var(--inverse)] grid place-items-center text-[var(--inverse-fg)] text-sm font-bold"
            data-testid="topbar-avatar"
          >
            {currentUser.username[0]}
          </button>
        </div>
      </div>
    </header>
  );
}
