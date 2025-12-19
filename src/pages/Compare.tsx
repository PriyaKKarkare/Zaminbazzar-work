import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Square, Check, X, DollarSign, Ruler, 
  Navigation, Building, Zap, Droplets, Shield, ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompareProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  area: string;
  plot_type: string;
  plot_facing: string | null;
  plot_shape: string | null;
  road_width: string | null;
  images: string[] | null;
  has_electricity: boolean | null;
  has_water_supply: boolean | null;
  has_drainage: boolean | null;
  has_compound_wall: boolean | null;
  has_security_gate: boolean | null;
  road_access: boolean | null;
  is_gated: boolean | null;
  price_per_unit: number | null;
  is_negotiable: boolean | null;
  loan_available: boolean | null;
}

const Compare = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<CompareProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length > 0) {
      fetchProperties(ids);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProperties = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .in('id', ids);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties for comparison',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (id: string) => {
    const remaining = properties.filter(p => p.id !== id).map(p => p.id);
    if (remaining.length > 0) {
      navigate(`/compare?ids=${remaining.join(',')}`);
    } else {
      navigate('/properties');
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  const CheckIcon = ({ value }: { value: boolean | null }) => 
    value ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-muted-foreground" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading comparison...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 py-20">
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <div className="mb-4 text-6xl">🔍</div>
          <h1 className="text-3xl font-bold mb-4">No Properties Selected</h1>
          <p className="text-muted-foreground mb-6">
            You haven't selected any properties to compare yet. Browse our listings and add properties to comparison.
          </p>
          <Button onClick={() => navigate('/properties')} size="lg">
            Browse Properties
          </Button>
        </Card>
      </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Compare Properties</h1>
          <p className="text-muted-foreground">Side-by-side comparison of {properties.length} properties</p>
        </div>

        <div className="overflow-x-auto">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${properties.length}, minmax(300px, 1fr))` }}>
            {properties.map((property) => (
              <Card key={property.id} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProperty(property.id)}
                  className="absolute top-2 right-2 z-10"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={property.images?.[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-xl mb-2">{property.title}</h3>
                    <div className="flex items-center text-muted-foreground gap-1 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="text-xl font-bold text-primary">{formatPrice(property.price)}</span>
                    </div>
                    {property.price_per_unit && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Per Unit</span>
                        <span className="text-sm font-medium">{formatPrice(property.price_per_unit)}</span>
                      </div>
                    )}
                    {property.is_negotiable && (
                      <Badge variant="secondary" className="w-full justify-center">Negotiable</Badge>
                    )}
                  </div>

                  {/* Plot Details */}
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-sm">Plot Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Area</span>
                        <span className="text-sm font-medium">{property.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <Badge variant="outline">{property.plot_type}</Badge>
                      </div>
                      {property.plot_facing && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Facing</span>
                          <span className="text-sm font-medium">{property.plot_facing}</span>
                        </div>
                      )}
                      {property.plot_shape && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Shape</span>
                          <span className="text-sm font-medium">{property.plot_shape}</span>
                        </div>
                      )}
                      {property.road_width && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Road Width</span>
                          <span className="text-sm font-medium">{property.road_width}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-sm">Infrastructure</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Road Access</span>
                        <CheckIcon value={property.road_access} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Electricity</span>
                        <CheckIcon value={property.has_electricity} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Water Supply</span>
                        <CheckIcon value={property.has_water_supply} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Drainage</span>
                        <CheckIcon value={property.has_drainage} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Compound Wall</span>
                        <CheckIcon value={property.has_compound_wall} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Security Gate</span>
                        <CheckIcon value={property.has_security_gate} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Gated Community</span>
                        <CheckIcon value={property.is_gated} />
                      </div>
                    </div>
                  </div>

                  {/* Financial */}
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-sm">Financial</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Loan Available</span>
                        <CheckIcon value={property.loan_available} />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
