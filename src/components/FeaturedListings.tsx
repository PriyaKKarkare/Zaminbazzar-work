import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bed, Bath, Maximize, Share2, Heart, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Plot {
  id: string;
  title: string;
  location: string;
  price: number;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  image_url?: string;
  images?: string[] | null;
  property_status?: string;
  seller_name?: string | null;
  seller_profile_photo?: string | null;
}

const FeaturedListings = () => {
  const [featuredPlots, setFeaturedPlots] = useState<Plot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, featuredPlots.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, featuredPlots.length - 2)) % Math.max(1, featuredPlots.length - 2));
  };

  return (
    <section className="py-20 bg-background relative z-10">
      <div className="container px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
              Discover Our Featured Listings
            </h2>
            <p className="text-muted-foreground text-lg">
              Aliquam lacinia diam quis lacus euismod
            </p>
          </div>
          <Button 
            onClick={() => navigate('/properties')}
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-foreground hover:text-primary"
          >
            See All Properties
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Property Cards Carousel */}
        {featuredPlots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No featured listings available at the moment</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            {featuredPlots.length > 3 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-foreground" />
                </button>
              </>
            )}

            {/* Cards Container */}
            <div className="overflow-hidden">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
              {featuredPlots.map((plot) => (
                <div 
                  key={plot.id} 
                  className="min-w-[calc(33.333%-16px)] bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/property/${plot.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={(plot.images && plot.images.length > 0 ? plot.images[0] : plot.image_url) || '/placeholder.svg'} 
                      alt={plot.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-destructive text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      FEATURED
                    </div>
                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <span className="text-2xl font-bold text-foreground">
                        ₹{(plot.price / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {plot.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {plot.location}
                    </p>

                    {/* Property Details */}
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
                      {plot.bedrooms && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Bed className="w-5 h-5" />
                          <span>{plot.bedrooms} bed</span>
                        </div>
                      )}
                      {plot.bathrooms && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Bath className="w-5 h-5" />
                          <span>{plot.bathrooms} bath</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Maximize className="w-5 h-5" />
                        <span>{plot.area}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-semibold">
                        {plot.property_status === 'available' ? 'For Buy' : 'For Sale'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const shareUrl = `${window.location.origin}/property/${plot.id}`;
                            const shareText = `Check out this property: ${plot.title}`;
                            
                            if (navigator.share) {
                              navigator.share({
                                title: plot.title,
                                text: shareText,
                                url: shareUrl
                              }).catch(() => {});
                            } else {
                              navigator.clipboard.writeText(shareUrl);
                              alert('Link copied to clipboard!');
                            }
                          }}
                        >
                          <Share2 className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button 
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/property/${plot.id}`, '_blank');
                          }}
                        >
                          <ExternalLink className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Heart className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Seller Info */}
                    {plot.seller_name && plot.seller_name.trim() && (
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
                          {plot.seller_profile_photo ? (
                            <img 
                              src={plot.seller_profile_photo} 
                              alt={plot.seller_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-sm">
                              {plot.seller_name.trim().charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Listed by</p>
                          <p className="text-sm font-medium text-foreground truncate">{plot.seller_name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Mobile See All Button */}
        <div className="mt-8 text-center md:hidden">
          <Button 
            onClick={() => navigate('/properties')}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            See All Properties
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
