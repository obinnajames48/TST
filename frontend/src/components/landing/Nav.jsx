import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LOGO_WORDMARK =
  "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png";

const links = [
  { label: "Products", id: "products" },
  { label: "How it works", id: "how" },
  { label: "Pricing", id: "pricing" },
  { label: "Affiliate", id: "affiliate" },
  { label: "FAQ", id: "faq" },
];

export default function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      data-testid="main-nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAFAF7]/85 backdrop-blur-xl border-b border-[#ECECEA]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[68px] flex items-center justify-between">
        <button
          onClick={() => goto("hero")}
          className="flex items-center"
          data-testid="nav-logo"
          aria-label="The Select Traders home"
        >
          <img src={LOGO_WORDMARK} alt="The Select Traders" className="h-9 w-auto" />
        </button>

        <nav className="hidden lg:flex items-center gap-1 bg-white/60 border border-[#ECECEA] rounded-full px-2 py-1.5 backdrop-blur-sm">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goto(l.id)}
              data-testid={`nav-link-${l.id}`}
              className="text-[14px] font-medium text-[#1F2024] px-4 py-2 rounded-full hover:bg-[#F5F5F2] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <button
            data-testid="nav-signin-btn"
            onClick={() => navigate("/app")}
            className="text-[14px] font-medium text-[#1F2024] px-4 py-2 rounded-full hover:bg-[#F5F5F2] transition-colors"
          >
            Sign in
          </button>
          <button
            data-testid="nav-getstarted-btn"
            onClick={() => navigate("/app")}
            className="inline-flex items-center gap-2 bg-[#0F0F12] text-white text-[14px] font-medium px-5 py-2.5 rounded-full hover:bg-[#1F2024] transition-all hover:-translate-y-px"
          >
            Get started
            <span className="inline-block w-1.5 h-1.5 bg-[#B4E04C] rounded-full" />
          </button>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-[#0F0F12]"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden bg-[#FAFAF7] border-t border-[#ECECEA] px-5 py-6 space-y-1"
          data-testid="nav-mobile-menu"
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goto(l.id)}
              className="block w-full text-left text-[15px] font-medium text-[#1F2024] py-3 hover:text-[#0F0F12]"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-2 border-t border-[#ECECEA]">
            <button onClick={() => navigate("/app")} className="text-[14px] font-medium text-[#1F2024] px-4 py-3 rounded-full bg-white border border-[#ECECEA]">
              Sign in
            </button>
            <button onClick={() => navigate("/app")} className="bg-[#0F0F12] text-white text-[14px] font-medium px-4 py-3 rounded-full">
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
