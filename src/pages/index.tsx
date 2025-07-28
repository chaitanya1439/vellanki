import { Header } from "@/components/Header";
import { ServicesGrid } from "@/components/ServicesGrid";
import { FeatureSection } from "@/components/FeatureSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with location and search */}
      <Header />
      
      {/* Services Grid */}
      <ServicesGrid />
      
      {/* Feature Sections */}
      <FeatureSection />
    </div>
  );
};

export default Index;