export default function Mission() {
  return (
    <section
      data-testid="mission-section"
      className="relative py-24 lg:py-32 border-t border-[#ECECEA]"
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="text-xs font-mono uppercase tracking-[0.18em] text-[#6B7280]">
              01 — Manifesto
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0F0F12] leading-tight">
              A hub for <br /> innovative trading.
            </h2>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-[#ECECEA] p-7" data-testid="mission-card">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-[#0F0F12] bg-[#E6F4C2] rounded-full px-3 py-1">
                Mission
              </div>
              <p className="mt-4 text-[15px] text-[#1F2024] leading-relaxed">
                To unlock a new way to make money trading — one that doesn't depend on beating the market every day. We give traders{" "}
                <span className="font-semibold text-[#0F0F12]">more avenues to earn from their skill</span>{" "}
                so the only thing they ever have to beat is another trader.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#ECECEA] p-7" data-testid="vision-card">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-white bg-[#A78BFA] rounded-full px-3 py-1">
                Vision
              </div>
              <p className="mt-4 text-[15px] text-[#1F2024] leading-relaxed">
                To become the home of competitive trading — where skill is{" "}
                <span className="font-semibold text-[#0F0F12]">visible, verifiable, and directly rewarded</span>, and where every trader has a fair shot at earning without the house tilting the table.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 max-w-4xl mx-auto text-center">
          <blockquote className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F0F12] leading-[1.1]">
            What if traders didn't have to beat the market —{" "}
            <span className="text-[#A78BFA]">just each other?</span>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
