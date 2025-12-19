import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import plotLand3D from "@/assets/3d-plot-land.png";

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-10 mb-[-150px]">
      <div className="container px-4">
        <div className="relative bg-gradient-to-r from-[hsl(270,55%,45%)] to-[hsl(270,60%,55%)] rounded-3xl overflow-visible shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="py-16 px-8 md:px-16 z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Start Listing or Buying a<br />Property With Zaminbazzar
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Talk to our experts or Browse through more properties
              </p>
              <Button 
                onClick={() => navigate('/properties')}
                className="bg-black hover:bg-black/90 text-white h-12 px-8 rounded-lg font-semibold"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* 3D Plot Illustration - Positioned to pop out */}
            <div className="relative h-64 lg:h-full min-h-[400px] flex items-center justify-center lg:justify-end perspective-1000">
              <div className="relative animate-float">
                <img 
                  src={plotLand3D} 
                  alt="3D Plot Land" 
                  className="w-full max-w-[500px] h-auto object-contain transform transition-all duration-500 hover:scale-110 hover:rotate-y-12"
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4))',
                    transform: 'perspective(1000px) rotateY(-15deg) translateZ(50px) scale(1.1)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
