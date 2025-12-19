import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Square, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  area: string;
  plot_type: string;
  images: string[] | null;
  is_premium_listing: boolean | null;
  city: string | null;
}

interface SuggestedPropertiesProps {
  currentPropertyId: string;
  location?: string;
  plotType?: string;
  city?: string | null;
}

const SuggestedProperties = ({ currentPropertyId, location, plotType, city }: SuggestedPropertiesProps) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedProperties();
  }, [currentPropertyId, location, plotType, city]);

  const fetchSuggestedProperties = async () => {
    try {
      let query = supabase
        .from('plots')
        .select('id, title, location, price, area, plot_type, images, is_premium_listing, city')
        .eq('status', 'active')
        .neq('id', currentPropertyId)
        .limit(6);

      // Try to find similar properties by city or location
      if (city) {
        const { data: cityMatches } = await query.eq('city', city);
        if (cityMatches && cityMatches.length >= 3) {
          setProperties(cityMatches.slice(0, 6));
          setLoading(false);
          return;
        }
      }

      // If not enough city matches, try plot type
      if (plotType) {
        const { data: typeMatches } = await query.eq('plot_type', plotType);
        if (typeMatches && typeMatches.length >= 3) {
          setProperties(typeMatches.slice(0, 6));
          setLoading(false);
          return;
        }
      }

      // Otherwise just get recent properties
      const { data, error } = await supabase
        .from('plots')
        .select('id, title, location, price, area, plot_type, images, is_premium_listing, city')
        .eq('status', 'active')
        .neq('id', currentPropertyId)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching suggested properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Similar Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) return null;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Similar Properties
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Properties you might be interested in
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            onClick={() => navigate(`/property/${property.id}`)}
            className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={property.images?.[0] || '/placeholder.svg'}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {property.is_premium_listing && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500">
                  Premium
                </Badge>
              )}
              <Badge className="absolute bottom-2 left-2 bg-primary text-white font-semibold shadow-lg">
                {property.plot_type}
              </Badge>
            </div>
            
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Square className="w-3 h-3" />
                  <span>{property.area}</span>
                </div>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(property.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SuggestedProperties;
