import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, TrendingUp, Home } from "lucide-react";

interface RateRange {
  label: string;
  maxPrice: number;
  icon: React.ReactNode;
  count: number;
  description: string;
}

const PropertiesByRates = () => {
  const [rateRanges, setRateRanges] = useState<RateRange[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRateCounts();
  }, []);

  const fetchRateCounts = async () => {
    const { data } = await supabase
      .from('plots')
      .select('price')
      .eq('status', 'active');

    if (data) {
      // Count properties in each price range
      const below5L = data.filter(p => p.price < 500000).length;
      const below20L = data.filter(p => p.price < 2000000).length;
      const around1Cr = data.filter(p => p.price < 10000000 && p.price >= 2000000).length;

      setRateRanges([
        {
          label: "Below ₹5 Lakhs",
          maxPrice: 500000,
          icon: <Home className="w-8 h-8" />,
          count: below5L,
          description: "Affordable plots for first-time buyers"
        },
        {
          label: "Below ₹20 Lakhs",
          maxPrice: 2000000,
          icon: <IndianRupee className="w-8 h-8" />,
          count: below20L,
          description: "Mid-range plots with great value"
        },
        {
          label: "Around ₹1 Crore",
          maxPrice: 10000000,
          icon: <TrendingUp className="w-8 h-8" />,
          count: around1Cr,
          description: "Premium plots for investment"
        }
      ]);
    }
  };

  const handleRangeClick = (maxPrice: number) => {
    navigate(`/properties?maxPrice=${maxPrice}`);
  };

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Properties by Rates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find plots that match your budget. Explore properties across different price ranges.
          </p>
        </div>

        {rateRanges.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-6xl">💰</div>
              <h3 className="text-2xl font-bold mb-2">No Properties Listed Yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to list your property! Our platform is ready to help you find buyers.
              </p>
              <Button onClick={() => navigate('/add-plot')} size="lg">
                List Your Property
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {rateRanges.map((range, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary"
              onClick={() => handleRangeClick(range.maxPrice)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {range.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {range.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {range.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border w-full">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {range.count}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {range.count === 1 ? 'Property' : 'Properties'}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-primary group-hover:text-primary-hover transition-colors">
                    Browse Plots →
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesByRates;
