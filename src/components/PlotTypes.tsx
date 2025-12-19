import { ArrowRight, Building2, Factory, Warehouse, Fuel, TrendingUp, Store, Home, Mountain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const plotTypeConfig = [
  {
    icon: Home,
    title: "Residential Plots",
    dbType: "Residential Plot",
    description: "Perfect for building your dream home",
    badge: "Most Popular",
    badgeColor: "bg-primary",
  },
  {
    icon: Store,
    title: "Commercial Plots",
    dbType: "Commercial Plot",
    description: "Prime locations for business ventures",
    badge: "High ROI",
    badgeColor: "bg-accent-foreground",
  },
  {
    icon: TrendingUp,
    title: "NA Plots",
    dbType: "NA Plot",
    description: "Non-agricultural plots ready for development",
    badge: "Premium",
    badgeColor: "bg-primary",
  },
  {
    icon: Factory,
    title: "Industrial Plots",
    dbType: "Industrial Plot",
    description: "Industrial zones perfect for manufacturing",
    badge: "Strategic",
    badgeColor: "bg-accent-foreground",
  },
  {
    icon: Mountain,
    title: "Farm Lands",
    dbType: "Farm Land",
    description: "Agricultural lands for farming",
    badge: "Best Value",
    badgeColor: "bg-primary",
  },
];

const PlotTypes = ({ offsetTop = false }: { offsetTop?: boolean }) => {
  const navigate = useNavigate();
  const [plotCounts, setPlotCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPlotCounts = async () => {
      const counts: Record<string, number> = {};
      
      for (const config of plotTypeConfig) {
        const { count, error } = await supabase
          .from('plots')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active')
          .eq('plot_type', config.dbType);
        
        if (!error && count !== null) {
          counts[config.dbType] = count;
        }
      }
      
      setPlotCounts(counts);
    };

    fetchPlotCounts();
  }, []);

  return (
    <section className={`py-12 md:py-20 bg-background relative ${offsetTop ? 'pt-[220px]' : ''}`}>
      <div className="container px-4 md:px-6 relative z-10 -mt-20 md:-mt-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-7xl mx-auto">
          {plotTypeConfig.map((type, index) => {
            const Icon = type.icon;
            const count = plotCounts[type.dbType] || 0;
            return (
              <div
                key={index}
                onClick={() => navigate('/properties')}
                className="bg-card rounded-xl md:rounded-2xl p-4 md:p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group text-center"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  {/* Icon */}
                  <div className="mb-3 md:mb-4 p-2 md:p-4 bg-primary/10 rounded-xl md:rounded-2xl group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 md:w-10 md:h-10 text-primary" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm md:text-lg font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>
                  
                  {/* Property Count */}
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {count} {count === 1 ? 'Property' : 'Properties'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlotTypes;
