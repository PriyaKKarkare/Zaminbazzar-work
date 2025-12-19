import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import PlotTypes from "@/components/PlotTypes";
import PropertiesByRates from "@/components/PropertiesByRates";
import CitiesByProperties from "@/components/CitiesByProperties";
import FeaturedListings from "@/components/FeaturedListings";
import NewsBlogs from "@/components/NewsBlogs";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import WhyListWithUs from "@/components/WhyListWithUs";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import FloatingAssistant from "@/components/FloatingAssistant";
import { CompareBar } from "@/components/CompareBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BrowsePlots from "./BrowsePlots";

interface Plot {
  id: string;
  title: string;
  location: string;
  price: number;
  area: string;
  dimensions: string;
  plot_type: string;
  image_url: string;
}

const Index = ({onSelect}) => {
  
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Update page title and meta tags
    document.title = "Zaminbazzar - India's Premier Plot Listing Portal";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Find your perfect plot or list your plot on India\'s most trusted real estate platform. Browse residential, commercial, agricultural and industrial plots across Mumbai.');
    }

    fetchFeaturedPlots();
  }, []);

  const fetchFeaturedPlots = async () => {
    const { data } = await supabase
      .from('plots')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(6);

    if (data) {
      setFeaturedPlots(data);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingAssistant />
      <CompareBar />

      <main>
        <Hero onSelect={onSelect} />
        
        <PlotTypes />

        <PropertiesByRates />

        <CitiesByProperties />

        <FeaturedListings />

        <NewsBlogs />

        <WhyChooseUs />

        <Testimonials />
      </main>

      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
