import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/app/Sidebar";
import Topbar from "@/components/app/Topbar";
import { X } from "lucide-react";

export default function ClientLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0F0F12]" data-testid="client-layout">
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl">
              <button
                className="absolute top-3 right-3 z-10 w-8 h-8 grid place-items-center rounded-full bg-white border border-[#ECECEA]"
                onClick={() => setMobileOpen(false)}
                data-testid="mobile-sidebar-close"
              >
                <X className="w-4 h-4" />
              </button>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          <Topbar onOpenSidebar={() => setMobileOpen(true)} />
          <div className="px-5 lg:px-8 py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
