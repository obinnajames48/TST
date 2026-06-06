import { useEffect, useState } from "react";
import { Menu, X, Swords } from "lucide-react";

const links = [
  { label: "Products", id: "products" },
  { label: "How It Works", id: "how" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "footer" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header
      data-testid="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0E1A]/85 backdrop-blur-2xl border-b border-[#D4AF37]/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <button
          onClick={() => goto("hero")}
          className="flex items-center gap-3 group"
          data-testid="nav-logo"
        >
          <span className="grid place-items-center w-9 h-9 border border-[#D4AF37]/60 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#0A0E1A] transition-colors">
            <Swords className="w-4 h-4" strokeWidth={2.5} />
          </span>
          <div className="font-display font-extrabold tracking-[0.18em] text-[#D4AF37] text-[15px] leading-none">
            THE SELECT
            <div className="text-white text-[10px] tracking-[0.35em] mt-1 font-medium">
              TRADERS
            </div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goto(l.id)}
              data-testid={`nav-link-${l.id}`}
              className="text-[11px] tracking-[0.32em] uppercase text-[#94A3B8] hover:text-[#D4AF37] transition-colors font-medium"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            data-testid="nav-signin-btn"
            className="text-[11px] tracking-[0.32em] uppercase border border-white/15 text-white px-5 py-3 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
          >
            Sign In
          </button>
          <button
            data-testid="nav-getstarted-btn"
            onClick={() => goto("pricing")}
            className="text-[11px] tracking-[0.32em] uppercase bg-[#D4AF37] text-[#0A0E1A] font-bold px-5 py-3 hover:bg-white hover:shadow-[0_0_24px_rgba(212,175,55,0.45)] transition-all"
          >
            Get Started
          </button>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div
          className="lg:hidden bg-[#0A0E1A] border-t border-[#D4AF37]/20 px-6 py-6 space-y-4"
          data-testid="nav-mobile-menu"
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => goto(l.id)}
              className="block w-full text-left text-sm tracking-[0.28em] uppercase text-[#94A3B8] hover:text-[#D4AF37]"
            >
              {l.label}
            </button>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-white/10">
            <button className="text-xs tracking-[0.28em] uppercase border border-white/15 text-white px-5 py-3">
              Sign In
            </button>
            <button className="text-xs tracking-[0.28em] uppercase bg-[#D4AF37] text-[#0A0E1A] font-bold px-5 py-3">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
