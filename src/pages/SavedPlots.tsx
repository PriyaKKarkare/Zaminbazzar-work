import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Trash2, GitCompare } from 'lucide-react';

interface SavedPlot {
  id: string;
  plot_id: string;
  saved_at: string;
  plots: {
    id: string;
    title: string;
    location: string;
    price: number;
    area: string;
    plot_type: string;
    images: string[] | null;
    plot_length: string | null;
    plot_width: string | null;
  };
}

const SavedPlots = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [savedPlots, setSavedPlots] = useState<SavedPlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchSavedPlots();
  }, [user, authLoading]);

  const fetchSavedPlots = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_plots')
        .select(`
          id,
          plot_id,
          saved_at,
          plots (
            id,
            title,
            location,
            price,
            area,
            plot_type,
            images,
            plot_length,
            plot_width
          )
        `)
        .eq('user_id', user?.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedPlots(data || []);
    } catch (error) {
      console.error('Error fetching saved plots:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved properties',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedPlotId: string) => {
    try {
      const { error } = await supabase
        .from('saved_plots')
        .delete()
        .eq('id', savedPlotId);

      if (error) throw error;

      setSavedPlots(savedPlots.filter(sp => sp.id !== savedPlotId));
      toast({
        title: 'Removed',
        description: 'Property removed from saved list'
      });
    } catch (error) {
      console.error('Error removing saved plot:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove property',
        variant: 'destructive'
      });
    }
  };

  const toggleCompareSelection = (plotId: string) => {
    setSelectedForCompare(prev => 
      prev.includes(plotId) 
        ? prev.filter(id => id !== plotId)
        : prev.length < 4 
          ? [...prev, plotId]
          : prev
    );
  };

  const handleCompare = () => {
    if (selectedForCompare.length < 2) {
      toast({
        title: 'Select Properties',
        description: 'Please select at least 2 properties to compare',
        variant: 'destructive'
      });
      return;
    }
    navigate(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading saved properties...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <SidebarProvider>
        <div className="flex w-full">
          <UserSidebar />
          
          <main className="flex-1">
            <div className="border-b bg-background p-4">
              <SidebarTrigger />
            </div>
            
            <div className="container px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    <Heart className="inline w-8 h-8 mr-2 text-primary" />
                    Saved Properties
                  </h1>
                  <p className="text-muted-foreground">
                    {savedPlots.length} {savedPlots.length === 1 ? 'property' : 'properties'} saved
                  </p>
                </div>

                {selectedForCompare.length > 0 && (
                  <Button onClick={handleCompare} size="lg">
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare ({selectedForCompare.length})
                  </Button>
                )}
              </div>

              {savedPlots.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">No Saved Properties</h2>
                  <p className="text-muted-foreground mb-6">
                    Start saving properties you're interested in
                  </p>
                  <Button onClick={() => navigate('/properties')}>
                    Browse Properties
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPlots.map((saved) => (
                    <div key={saved.id} className="relative">
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <Button
                          size="icon"
                          variant={selectedForCompare.includes(saved.plot_id) ? 'default' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompareSelection(saved.plot_id);
                          }}
                          className="shadow-lg"
                        >
                          <GitCompare className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsave(saved.id);
                          }}
                          className="shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <PropertyCard
                        id={saved.plots.id}
                        image={saved.plots.images?.[0] || '/placeholder.svg'}
                        title={saved.plots.title}
                        location={saved.plots.location}
                        price={formatPrice(saved.plots.price)}
                        area={saved.plots.area}
                        dimensions={saved.plots.plot_length && saved.plots.plot_width 
                          ? `${saved.plots.plot_length} x ${saved.plots.plot_width}`
                          : ''}
                        type={saved.plots.plot_type}
                        onClick={() => navigate(`/property/${saved.plots.id}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
};

export default SavedPlots;
