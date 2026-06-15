import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const LOGO_WORDMARK =
  "https://customer-assets.emergentagent.com/job_trade-duel-arena/artifacts/aemoxt7k_Asset%2025%404x-8.png";

const links = [
  { label: "Products", id: "products", hasMenu: true },
  { label: "How it works", id: "how" },
  { label: "Pricing", id: "pricing" },
  { label: "Affiliate", id: "affiliate" },
  { label: "FAQ", id: "faq" },
];

const productMenu = [
  { name: "1v1 Duel", href: "/products/duel", desc: "Two traders. Equal accounts." },
  { name: "Trading Royale", href: "/products/royale", desc: "Last balance standing wins." },
  { name: "Multi Trader", href: "/products/tournament", desc: "32 traders. Group → Final." },
  { name: "Tag Team", href: "/products/tagteam", desc: "Squad-vs-squad trading." },
  { name: "Community Battles", href: "/products/community", desc: "Communities go head-to-head." },
  { name: "Affiliate", href: "/products/affiliate", desc: "10–25% rev-share for life." },
];

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id) => {
    // If on landing, smooth-scroll. Else navigate to landing with hash.
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
    setOpen(false);
    setProductsOpen(false);
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
          {links.map((l) => l.hasMenu ? (
            <div
              key={l.id}
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                onClick={() => goto(l.id)}
                data-testid={`nav-link-${l.id}`}
                className="inline-flex items-center gap-1 text-[14px] font-medium text-[#1F2024] px-4 py-2 rounded-full hover:bg-[#F5F5F2] transition-colors"
              >
                {l.label}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {productsOpen && (
                <div className="absolute top-[100%] left-0 pt-3" data-testid="nav-products-menu">
                  <div className="bg-white border border-[#ECECEA] rounded-2xl p-2 w-[320px] shadow-[0_18px_36px_-12px_rgba(15,15,18,0.12)]">
                    {productMenu.map((p) => (
                      <Link
                        key={p.href}
                        to={p.href}
                        data-testid={`nav-product-${p.name.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setProductsOpen(false)}
                        className="block px-3 py-2.5 rounded-xl hover:bg-[#FAFAF7] transition-colors"
                      >
                        <div className="text-[14px] font-semibold text-[#0F0F12]">{p.name}</div>
                        <div className="text-[12px] text-[#6B7280] mt-0.5">{p.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
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
