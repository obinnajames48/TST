import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import ClientLayout from "@/components/app/ClientLayout";
import Dashboard from "@/pages/app/Dashboard";
import Duel from "@/pages/app/Duel";
import Royale from "@/pages/app/Royale";
import Tournament from "@/pages/app/Tournament";
import TagTeam from "@/pages/app/TagTeam";
import Community from "@/pages/app/Community";
import Stats from "@/pages/app/Stats";
import Wallet from "@/pages/app/Wallet";
import Settings from "@/pages/app/Settings";
import Notifications from "@/pages/app/Notifications";
import Match from "@/pages/app/Match";
import Affiliate from "@/pages/app/Affiliate";
import TradingStation from "@/pages/app/TradingStation";
import TermsPage from "@/pages/Terms";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/Login";
import AdminOverview from "@/pages/admin/Overview";
import AdminUsers from "@/pages/admin/Users";
import AdminMatches from "@/pages/admin/Matches";
import AdminFinance from "@/pages/admin/Finance";
import AdminKyc from "@/pages/admin/Kyc";
import AdminAudit from "@/pages/admin/Audit";
import AdminCommunity from "@/pages/admin/Community";
import { AdminTransactions, AdminAffiliates, AdminSettlements } from "@/pages/admin/Extras";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/app/match/:matchId" element={<Match />} />
          <Route path="/app" element={<ClientLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="duel" element={<Duel />} />
            <Route path="station" element={<TradingStation />} />
            <Route path="royale" element={<Royale />} />
            <Route path="tournament" element={<Tournament />} />
            <Route path="tagteam" element={<TagTeam />} />
            <Route path="community" element={<Community />} />
            <Route path="stats" element={<Stats />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="affiliate" element={<Affiliate />} />
          </Route>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="settlements" element={<AdminSettlements />} />
            <Route path="affiliates" element={<AdminAffiliates />} />
            <Route path="kyc" element={<AdminKyc />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="community" element={<AdminCommunity />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            border: "1px solid #ECECEA",
            color: "#0F0F12",
            borderRadius: "999px",
            padding: "12px 18px",
            boxShadow: "0 12px 24px -8px rgba(15, 15, 18, 0.12)",
          },
        }}
      />
    </div>
  );
}

export default App;
