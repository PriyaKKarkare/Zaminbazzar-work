import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingAssistant from '@/components/FloatingAssistant';
import StickyActionBar from '@/components/StickyActionBar';
import InvestmentCalculator from '@/components/InvestmentCalculator';
import SuggestedProperties from '@/components/SuggestedProperties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  MapPin, Square, ArrowLeft, Share2, Heart, Phone, Mail, User,
  Home, Compass, CheckCircle2, Shield, Ruler, Navigation,
  TreeDeciduous, Building, Zap, Droplets, Lock, Camera,
  DollarSign, AlertCircle, Clock, Info, Eye, ChevronRight,
  MapPinned, Landmark, FileText, Briefcase, Star, MessageCircle, GitCompare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Plot {
  id: string;
  title: string;
  description: string | null;
  location: string;
  price: number;
  area: string;
  seller_type: string | null;
  seller_name: string | null;
  phone_primary: string | null;
  phone_secondary: string | null;
  seller_email: string | null;
  plot_type: string;
  plot_area_value: number | null;
  plot_area_unit: string | null;
  plot_length: string | null;
  plot_width: string | null;
  plot_facing: string | null;
  plot_shape: string | null;
  road_access: boolean | null;
  road_width: string | null;
  is_gated: boolean | null;
  gated_project_name: string | null;
  land_classification: string | null;
  ownership_type: string | null;
  encumbrance_status: string | null;
  state: string | null;
  city: string | null;
  zone_type: string | null;
  price_per_unit: number | null;
  is_negotiable: boolean | null;
  booking_amount: number | null;
  loan_available: boolean | null;
  loan_banks: string | null;
  gst_applicable: boolean | null;
  has_compound_wall: boolean | null;
  has_security_gate: boolean | null;
  has_internal_roads: boolean | null;
  has_electricity: boolean | null;
  has_water_supply: boolean | null;
  has_drainage: boolean | null;
  has_street_lights: boolean | null;
  has_garden: boolean | null;
  has_clubhouse: boolean | null;
  has_parking: boolean | null;
  has_cctv: boolean | null;
  has_rainwater_harvesting: boolean | null;
  images: string[] | null;
  possession_timeline: string | null;
  is_premium_listing: boolean | null;
  is_verified_owner: boolean | null;
  is_urgent_sale: boolean | null;
  user_id: string;
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [plot, setPlot] = useState<Plot | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveId, setSaveId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
      if (user) {
        checkIfSaved();
      }
    }
  }, [id, user]);

  const fetchPropertyDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPlot(data);
      console.log("data---aata", data?.seller_email)
    
    } catch (error) {
      console.error('Error fetching property:', error);
      toast({
        title: 'Error',
        description: 'Failed to load property details',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("logindata data", plot?.seller_email)

  console.log("plot email", plot)
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link copied!',
      description: 'Property link copied to clipboard'
    });
  };

  const checkIfSaved = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('saved_plots')
        .select('id')
        .eq('user_id', user.id)
        .eq('plot_id', id)
        .maybeSingle();

      if (data) {
        setIsSaved(true);
        setSaveId(data.id);
      }
    } catch (error) {
      console.error('Error checking save status:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isSaved && saveId) {
        const { error } = await supabase
          .from('saved_plots')
          .delete()
          .eq('id', saveId);

        if (error) throw error;
        setIsSaved(false);
        setSaveId(null);
        toast({ title: 'Removed from saved', description: 'Property unsaved successfully' });
      } else {
        const { data, error } = await supabase
          .from('saved_plots')
          .insert({ user_id: user.id, plot_id: id })
          .select()
          .single();

        if (error) throw error;
        setIsSaved(true);
        setSaveId(data.id);
        toast({ title: 'Saved!', description: 'Property saved to your wishlist' });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({
        title: 'Error',
        description: 'Failed to save property',
        variant: 'destructive'
      });
    }
  };

  const handleStartConversation = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!plot) return;

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('plot_id', id)
        .eq('buyer_id', user.id)
        .eq('seller_id', plot.user_id)
        .maybeSingle();

      if (existing) {
        navigate('/messages');
        return;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          plot_id: id,
          buyer_id: user.id,
          seller_id: plot.user_id
        })
        .select()
        .single();

      if (error) throw error;

      // Send initial message
      await supabase
        .from('messages')
        .insert({
          conversation_id: data.id,
          sender_id: user.id,
          content: `Hi, I'm interested in your property: ${plot.title}`
        });

      navigate('/messages');
      toast({ title: 'Conversation started', description: 'Redirecting to messages...' });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!plot) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button onClick={() => navigate('/properties')}>Browse Properties</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = plot.images && plot.images.length > 0 ? plot.images : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="outline" onClick={() => navigate('/properties')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">{/* Main content wrapper */}

            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {plot.is_premium_listing && <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Premium</Badge>}
                    {plot.is_verified_owner && <Badge className="bg-green-600">✓ Verified</Badge>}
                    {plot.is_urgent_sale && <Badge variant="destructive">Urgent Sale</Badge>}
                    <Badge variant="outline">{plot.plot_type}</Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">{plot.title}</h1>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-lg">{plot.location}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSave}
                    className={isSaved ? 'text-destructive border-destructive' : ''}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="default" size="icon" onClick={handleStartConversation}>
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button variant="default" onClick={() => navigate(`/compare?ids=${id}`)}>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare
                  </Button>
                </div>
              </div>

              {/* Price */}
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                      <p className="text-4xl md:text-5xl font-bold text-primary">₹{plot.price.toLocaleString()}</p>
                      {plot.price_per_unit && (
                        <p className="text-sm text-muted-foreground mt-2">
                          ₹{plot.price_per_unit.toLocaleString()} per {plot.plot_area_unit || 'sq.ft'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gallery */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-lg">
                <img src={images[currentImageIndex]} alt="Property" className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`transition-all ${idx === currentImageIndex ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                          } rounded-full`}
                      />
                    ))}
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  <Camera className="w-4 h-4 inline mr-1" />
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 bg-muted shadow"
                    onClick={() => setCurrentImageIndex(idx + 1)}
                  >
                    <img src={img} alt={`${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <Square className="w-5 h-5 text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Area</p>
                      <p className="text-2xl font-bold">
                        {plot.plot_area_value ? `${plot.plot_area_value} ${plot.plot_area_unit}` : plot.area}
                      </p>
                    </CardContent>
                  </Card>

                  {plot.plot_facing && (
                    <Card>
                      <CardContent className="p-6">
                        <Navigation className="w-5 h-5 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Facing</p>
                        <p className="text-2xl font-bold">{plot.plot_facing}</p>
                      </CardContent>
                    </Card>
                  )}

                  {plot.plot_shape && (
                    <Card>
                      <CardContent className="p-6">
                        <Compass className="w-5 h-5 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Shape</p>
                        <p className="text-2xl font-bold">{plot.plot_shape}</p>
                      </CardContent>
                    </Card>
                  )}

                  {plot.possession_timeline && (
                    <Card>
                      <CardContent className="p-6">
                        <Clock className="w-5 h-5 text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Possession</p>
                        <p className="text-2xl font-bold">{plot.possession_timeline}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {plot.description || 'Prime property offering excellent investment potential with easy access to major amenities.'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plot Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {plot.plot_area_value && (
                        <div className="p-4 rounded-lg bg-muted/30">
                          <Square className="w-5 h-5 text-primary mb-2" />
                          <p className="text-sm text-muted-foreground">Total Area</p>
                          <p className="text-2xl font-bold">{plot.plot_area_value} {plot.plot_area_unit}</p>
                        </div>
                      )}
                      {(plot.plot_length && plot.plot_width) && (
                        <div className="p-4 rounded-lg bg-muted/30">
                          <Ruler className="w-5 h-5 text-primary mb-2" />
                          <p className="text-sm text-muted-foreground">Dimensions</p>
                          <p className="text-xl font-semibold">{plot.plot_length} × {plot.plot_width}</p>
                        </div>
                      )}
                      {plot.road_access !== null && (
                        <div className="p-4 rounded-lg bg-muted/30">
                          <MapPinned className="w-5 h-5 text-primary mb-2" />
                          <p className="text-sm text-muted-foreground">Road Access</p>
                          <p className="font-semibold">{plot.road_access ? 'Available' : 'Not Available'}</p>
                          {plot.road_width && <p className="text-sm mt-1">Width: {plot.road_width}</p>}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(plot.land_classification || plot.ownership_type) ? (
                      <div className="space-y-4">
                        {plot.land_classification && (
                          <div className="p-4 rounded-lg bg-muted/30">
                            <Landmark className="w-5 h-5 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Land Classification</p>
                            <p className="text-lg font-semibold">{plot.land_classification}</p>
                          </div>
                        )}
                        {plot.ownership_type && (
                          <div className="p-4 rounded-lg bg-muted/30">
                            <Briefcase className="w-5 h-5 text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Ownership</p>
                            <p className="text-lg font-semibold">{plot.ownership_type}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Legal information not available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {plot.has_electricity && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Zap className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Electricity</span>
                        </div>
                      )}
                      {plot.has_water_supply && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Droplets className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Water Supply</span>
                        </div>
                      )}
                      {plot.has_security_gate && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Lock className="w-5 h-5 text-red-600" />
                          <span className="font-medium">Security Gate</span>
                        </div>
                      )}
                      {plot.has_cctv && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Camera className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">CCTV</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pricing Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                          <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                          <p className="text-4xl font-bold text-primary">₹{plot.price.toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground">Negotiable</p>
                            <p className="text-xl font-semibold">{plot.is_negotiable ? 'Yes' : 'No'}</p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground">Loan Available</p>
                            <p className="text-xl font-semibold">{plot.loan_available ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <InvestmentCalculator propertyPrice={plot.price} />
                </div>
              </TabsContent>

              <TabsContent value="seller" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Seller Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!showContactDetails ? (
                      <div className="text-center py-8">
                        <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Contact Details Available</h3>
                        <p className="text-muted-foreground mb-6">Click to reveal seller contact information</p>
                        <Button onClick={() => setShowContactDetails(true)}>
                          Show Contact Details
                          <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {plot.phone_primary && (
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                            <Phone className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="text-sm text-muted-foreground">Primary Phone</p>
                              <a href={`tel:${plot.phone_primary}`} className="text-xl font-semibold">{plot.phone_primary}</a>
                            </div>
                          </div>
                        )}
                        {plot.seller_email && (
                          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                            <Mail className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <a href={`mailto:${plot.seller_email}`} className="text-lg font-semibold">{plot.seller_email}</a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>{/* End main content wrapper */}

          {/* Sidebar with suggested properties */}
          <div className="lg:block hidden">
            <SuggestedProperties
              currentPropertyId={id || ''}
              location={plot.location}
              plotType={plot.plot_type}
              city={plot.city}
            />
          </div>
        </div>{/* End grid */}
      </div>{/* End container */}

      <FloatingAssistant />
      <StickyActionBar
        phone={plot?.phone_primary || undefined}
        plotTitle={plot?.title || 'Property'}
      />

      <Footer />
    </div>
  );
};

export default PropertyDetail;