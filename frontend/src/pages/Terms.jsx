import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Eligibility",
    paragraphs: [
      "You must be at least 18 years of age (or the legal age of majority in your jurisdiction, whichever is higher) to register for or use The Select Traders.",
      "By creating an account you confirm that participation in skill-based competitive trading is legal in your country of residence. Where local laws restrict such activity, you may not use the platform.",
    ],
  },
  {
    title: "2. Account & Identity",
    paragraphs: [
      "Usernames are permanent. Once chosen they cannot be changed or transferred — they form your competitive identity and historical performance record.",
      "Each user may operate one account. Multi-accounting, account sharing, or operating an account on behalf of another person is strictly prohibited and will result in forfeiture of funds.",
      "Identity verification (KYC) is required before your first withdrawal. We may at our discretion require additional verification for high-value or unusual activity.",
    ],
  },
  {
    title: "3. Entry fees & payouts",
    paragraphs: [
      "Entry fees become non-refundable the moment a match (Duel, Royale lobby, Tournament or Tag Team event) starts. If a match is voided by an admin for cause, both sides receive a full refund.",
      "Prizes are credited to your wallet immediately upon match settlement. Withdrawals are processed to the original deposit method or to a verified alternative.",
      "Affiliate rev-share is calculated monthly and paid on the 1st of the following month into your wallet balance.",
    ],
  },
  {
    title: "4. Fair play",
    paragraphs: [
      "Automated trading systems, expert advisors (EAs), copy-trading bots and any form of unattended algorithmic execution are prohibited on competition accounts.",
      "Latency arbitrage, news-spike exploitation and any pattern of trading that targets infrastructure rather than market opinion will result in match disqualification.",
      "Collusion between traders in any format (sharing trade direction, splitting prize pools off-platform, intentional losing) results in permanent ban and forfeiture of all funds.",
    ],
  },
  {
    title: "5. Risk disclosure",
    paragraphs: [
      "The Select Traders is not a broker, a financial institution, or a registered investment adviser. Nothing on the platform constitutes investment advice.",
      "Trading on demo and live accounts both involve risk. Past performance — yours or anyone else's — is not indicative of future results.",
      "Entry fees may be lost. Do not enter competitions with capital you cannot afford to lose.",
    ],
  },
  {
    title: "6. Disputes & settlements",
    paragraphs: [
      "Match results are final once settled and published in the Trading Station. Trade logs from the underlying MT5 account are the single source of truth.",
      "Disputes must be raised within 24 hours of settlement via the in-app support channel. Late disputes will not be considered.",
      "The Select Traders admin team reserves the right to void any match where evidence of manipulation, technical failure, or rule breach is found.",
    ],
  },
  {
    title: "7. Changes to these Terms",
    paragraphs: [
      "We may update these Terms from time to time. Material changes will be announced in-app and via email at least 14 days before they take effect.",
      "Continued use of the platform after the effective date constitutes acceptance of the updated Terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#0F0F12]" data-testid="terms-page">
      <Nav />
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-20 border-b border-[#ECECEA]">
        <div className="max-w-3xl mx-auto px-5 lg:px-8">
          <Link to="/" data-testid="terms-back-link" className="inline-flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-[#0F0F12] transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
          <div className="inline-flex items-center gap-2 bg-white border border-[#ECECEA] rounded-full px-3 py-1.5 mb-5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#1F2024]">Legal · v1.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F0F12] leading-[1.05]">
            Terms &amp; Conditions
          </h1>
          <p className="mt-5 text-[15px] text-[#4B5563] leading-relaxed">
            The rules of play for The Select Traders. Last updated 9 February 2026. Read carefully — by using the platform you agree to be bound by these terms.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 space-y-12">
          {sections.map((s) => (
            <div key={s.title} data-testid={`terms-section-${s.title.split(".")[0]}`}>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#0F0F12] mb-4">{s.title}</h2>
              <div className="space-y-3">
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-[14.5px] text-[#1F2024] leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white border border-[#ECECEA] rounded-2xl p-6 mt-12">
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#9CA3AF]">Contact</div>
            <div className="mt-2 text-[14.5px] text-[#1F2024]">
              For legal queries: <a href="mailto:legal@selecttraders.com" className="font-semibold text-[#0F0F12] underline underline-offset-2 hover:text-[#7C3AED]">legal@selecttraders.com</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
