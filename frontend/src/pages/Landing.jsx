import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Mission from "@/components/landing/Mission";
import Problem from "@/components/landing/Problem";
import ProductSuite from "@/components/landing/ProductSuite";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Affiliate from "@/components/landing/Affiliate";
import Faq from "@/components/landing/Faq";
import Terms from "@/components/landing/Terms";
import Ticker from "@/components/landing/Ticker";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Wait for sections to mount before scrolling
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [hash]);

  return (
    <main className="min-h-screen bg-[#FAFAF7] text-[#0F0F12] overflow-x-hidden" data-testid="landing-page">
      <Nav />
      <Hero />
      <Mission />
      <Problem />
      <ProductSuite />
      <HowItWorks />
      <Pricing />
      <Affiliate />
      <Faq />
      <Terms />
      <Ticker />
      <Footer />
    </main>
  );
}
