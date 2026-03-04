import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PredictionPreview from "@/components/landing/PredictionPreview";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PredictionPreview />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
