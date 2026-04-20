import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PredictionPreview from "@/components/landing/PredictionPreview";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="landing-shell font-landing-body min-h-screen selection:bg-[#4d7cff] selection:text-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PredictionPreview />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
