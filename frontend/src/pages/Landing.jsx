import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Mission from "@/components/landing/Mission";
import Problem from "@/components/landing/Problem";
import ProductSuite from "@/components/landing/ProductSuite";
import ProductDeepDive from "@/components/landing/ProductDeepDive";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import Terms from "@/components/landing/Terms";
import Ticker from "@/components/landing/Ticker";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#0A0E1A] text-white overflow-x-hidden" data-testid="landing-page">
      <Nav />
      <Hero />
      <Mission />
      <Problem />
      <ProductSuite />
      <ProductDeepDive />
      <HowItWorks />
      <Pricing />
      <Faq />
      <Terms />
      <Ticker />
      <Footer />
    </main>
  );
}
