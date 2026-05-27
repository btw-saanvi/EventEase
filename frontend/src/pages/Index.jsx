import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import VendorShowcase from "../components/home/VendorShowcase";
import HowItWorks from "../components/home/HowItWorks";
import TestimonialSection from "../components/home/TestimonialSection";
import CTASection from "../components/home/CTASection";

export default function Index() {
  return (
    <main>
      <HeroSection />
      <FeatureSection />
      <VendorShowcase />
      <HowItWorks />
      <TestimonialSection />
      <CTASection />
    </main>
  );
}
