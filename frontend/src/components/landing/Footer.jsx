import { Twitter, Instagram, MessageCircle, Youtube, Music, Swords } from "lucide-react";

const cols = [
  {
    title: "Platform",
    links: ["Products", "Leaderboard", "Live Duels", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press"],
  },
  {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy", "Responsible Trading"],
  },
  {
    title: "Support",
    links: ["FAQ", "Contact", "Discord Community"],
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      data-testid="footer-section"
      className="relative bg-[#0A0E1A] border-t border-white/10 pt-20 pb-8"
    >
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="grid place-items-center w-9 h-9 border border-[#D4AF37]/60 text-[#D4AF37]">
                <Swords className="w-4 h-4" strokeWidth={2.5} />
              </span>
              <div className="font-display font-extrabold tracking-[0.18em] text-[#D4AF37] text-[15px] leading-none">
                THE SELECT
                <div className="text-white text-[10px] tracking-[0.35em] mt-1 font-medium">
                  TRADERS
                </div>
              </div>
            </div>
            <p className="text-[#94A3B8] max-w-md leading-relaxed mb-8">
              Trade smart. Compete harder. The sport of trading — built for the world's most competitive market participants.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, label: "twitter" },
                { Icon: Instagram, label: "instagram" },
                { Icon: MessageCircle, label: "discord" },
                { Icon: Youtube, label: "youtube" },
                { Icon: Music, label: "tiktok" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href={`#${label}`}
                  data-testid={`social-${label}`}
                  aria-label={label}
                  className="w-10 h-10 grid place-items-center border border-white/15 text-[#94A3B8] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[#D4AF37] mb-4">
                  {c.title}
                </div>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                        className="text-[#94A3B8] hover:text-white text-sm transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#94A3B8]">
            © 2026 The Select Traders. All rights reserved.
          </div>
          <div className="font-display italic text-[#D4AF37] tracking-wide">
            "Trade smart. Compete harder."
          </div>
        </div>
      </div>
    </footer>
  );
}
