import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import maharashtraImg from "@/assets/cities/mumbai.jpg";
import delhiImg from "@/assets/cities/delhi.jpg";
import karnatakaImg from "@/assets/cities/bangalore.jpg";
import gujaratImg from "@/assets/cities/pune.jpg";
import telanganaImg from "@/assets/cities/hyderabad.jpg";

interface StateData {
  name: string;
  image: string;
  count: number;
}

const CitiesByProperties = () => {
  const [states, setStates] = useState<StateData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const stateImages: Record<string, string> = {
    Maharashtra: maharashtraImg,
    Delhi: delhiImg,
    Karnataka: karnatakaImg,
    Gujarat: gujaratImg,
    Telangana: telanganaImg,
  };

  useEffect(() => {
    fetchStateCounts();
  }, []);

  const fetchStateCounts = async () => {
    const { data } = await supabase
      .from('plots')
      .select('state')
      .eq('status', 'active');

    if (data) {
      // Group by state and count
      const stateCounts: Record<string, number> = {};
      data.forEach((plot) => {
        const stateName = plot.state || Object.keys(stateImages).find(state => 
          plot.state?.toLowerCase().includes(state.toLowerCase())
        );
        
        if (stateName && stateImages[stateName]) {
          stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
        }
      });

      // Convert to array
      const stateData: StateData[] = Object.keys(stateImages).map(state => ({
        name: state,
        image: stateImages[state],
        count: stateCounts[state] || 0,
      }));

      setStates(stateData);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, states.length - 4) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= states.length - 4 ? 0 : prev + 1));
  };

  const visibleStates = states.slice(currentIndex, currentIndex + 4);

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Properties by <span className="text-primary">States</span>
            </h2>
            <p className="text-muted-foreground">
              Explore properties across India's top-tier states
            </p>
          </div>
          <Button 
            variant="link" 
            className="text-foreground hover:text-primary gap-2 font-semibold"
            onClick={() => navigate('/properties')}
          >
            See All States <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          {states.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4 text-6xl">🏘️</div>
                <h3 className="text-2xl font-bold mb-2">No Properties in These States Yet</h3>
                <p className="text-muted-foreground mb-4">
                  We're constantly adding new properties. Check back soon or browse all available properties.
                </p>
                <Button onClick={() => navigate('/properties')} size="lg">
                  Browse All Properties
                </Button>
              </div>
            </Card>
          ) : (
            <>
              {/* State Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleStates.map((state) => (
                  <div
                    key={state.name}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/properties?state=${encodeURIComponent(state.name)}`)}
                  >
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                      <img
                        src={state.image}
                        alt={state.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {state.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {state.count} Properties
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              {states.length > 4 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronLeft className="w-6 h-6 text-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                  >
                    <ChevronRight className="w-6 h-6 text-foreground" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {states.length > 4 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(states.length / 4) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * 4)}
                className={`h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / 4) === idx 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CitiesByProperties;
