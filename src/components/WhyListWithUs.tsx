import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import listPlotImg from "@/assets/illustrations/list-plot.png";
import findPlotImg from "@/assets/illustrations/find-plot.png";
import trustedPlatformImg from "@/assets/illustrations/trusted-platform.png";

const services = [
  {
    image: listPlotImg,
    title: "List Your Plot",
    description: "Easily list your plot with detailed information and reach thousands of potential buyers actively searching for properties in your area.",
    buttonText: "List a Plot",
    buttonAction: "/add-plot",
  },
  {
    image: findPlotImg,
    title: "Find Your Plot",
    description: "Browse through verified plots with detailed information, high-quality images, and transparent pricing to find your perfect property.",
    buttonText: "Find a Plot",
    buttonAction: "/properties",
  },
  {
    image: trustedPlatformImg,
    title: "Trusted Platform",
    description: "Connect with verified buyers and sellers in a secure environment. Our platform ensures transparency and safety in every transaction.",
    buttonText: "Learn More",
    buttonAction: "/properties",
  },
];

const WhyListWithUs = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            See How Zaminbazzar Can Help
          </h2>
          <p className="text-base text-muted-foreground">
            Discover the perfect solution for buying, selling, or investing in plots
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Illustration */}
              <div className="mb-6 w-48 h-48 flex items-center justify-center">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold mb-3 text-foreground text-center">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed max-w-xs">
                {service.description}
              </p>
              
              {/* CTA Button */}
              <Button 
                variant="ghost"
                onClick={() => navigate(service.buttonAction)}
                className="text-primary hover:text-primary hover:bg-transparent font-medium group/btn"
              >
                {service.buttonText}
                <ArrowRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyListWithUs;
