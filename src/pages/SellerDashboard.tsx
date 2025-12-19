import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { UserSidebar } from '@/components/UserSidebar';
import { 
  Eye, Heart, MessageCircle, TrendingUp, Sparkles, 
  Award, Target, CheckCircle, AlertCircle, BarChart3,
  Crown, Zap, ArrowUp, Plus, Trash2, Pencil
} from 'lucide-react';

interface Plot {
  id: string;
  title: string;
  price: number;
  location: string;
  views_count: number;
  inquiries_count: number;
  saves_count: number;
  listing_score: number;
  is_verified: boolean;
  is_boosted: boolean;
  images: string[] | null;
  created_at: string;
}

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

interface Stats {
  totalListings: number;
  totalViews: number;
  totalInquiries: number;
  totalSaves: number;
  avgScore: number;
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [savedPlots, setSavedPlots] = useState<SavedPlot[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingDescription, setGeneratingDescription] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [plotToDelete, setPlotToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchDashboardData();
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      // Run both queries in parallel for faster loading
      const [plotsResult, savedResult] = await Promise.all([
        supabase
          .from('plots')
          .select('id, title, price, location, views_count, inquiries_count, saves_count, listing_score, is_verified, is_boosted, images, created_at')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        supabase
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
          .order('saved_at', { ascending: false })
      ]);

      if (plotsResult.error) throw plotsResult.error;
      if (savedResult.error) throw savedResult.error;

      const userPlots = plotsResult.data || [];
      setPlots(userPlots);
      setSavedPlots(savedResult.data || []);

      // Calculate stats
      setStats({
        totalListings: userPlots.length,
        totalViews: userPlots.reduce((sum, p) => sum + (p.views_count || 0), 0),
        totalInquiries: userPlots.reduce((sum, p) => sum + (p.inquiries_count || 0), 0),
        totalSaves: userPlots.reduce((sum, p) => sum + (p.saves_count || 0), 0),
        avgScore: userPlots.length 
          ? Math.round(userPlots.reduce((sum, p) => sum + (p.listing_score || 0), 0) / userPlots.length)
          : 0
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAIDescription = async (plotId: string) => {
    setGeneratingDescription(plotId);
    try {
      const plot = plots.find(p => p.id === plotId);
      if (!plot) return;

      const { data, error } = await supabase.functions.invoke('generate-description', {
        body: { plotData: plot }
      });

      if (error) throw error;

      // Update plot with generated description
      await supabase
        .from('plots')
        .update({ description: data.description })
        .eq('id', plotId);

      toast({
        title: 'Success!',
        description: 'AI description generated successfully',
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate description',
        variant: 'destructive'
      });
    } finally {
      setGeneratingDescription(null);
    }
  };

  const calculateScore = async (plotId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('calculate-listing-score', {
        body: { plotId }
      });

      if (error) throw error;

      toast({
        title: `Score: ${data.score}/100`,
        description: data.message,
      });

      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to calculate score',
        variant: 'destructive'
      });
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

  const handleDeleteClick = (plotId: string) => {
    setPlotToDelete(plotId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!plotToDelete) return;

    try {
      const { error } = await supabase
        .from('plots')
        .delete()
        .eq('id', plotToDelete);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Property deleted successfully'
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting plot:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setPlotToDelete(null);
    }
  };

  const handleEdit = (plotId: string) => {
    navigate(`/add-plot?edit=${plotId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 py-20 text-center">
          <div className="animate-pulse">Loading dashboard...</div>
        </div>
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and track performance</p>
          </div>
          {/* <Button onClick={() => navigate('/add-plot')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Listing
          </Button> */}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="glass hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-3xl font-bold">{stats?.totalListings}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{stats?.totalViews}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inquiries</p>
                  <p className="text-3xl font-bold">{stats?.totalInquiries}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saves</p>
                  <p className="text-3xl font-bold">{stats?.totalSaves}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="glass hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-3xl font-bold">{stats?.avgScore}/100</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Listings */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Listings</TabsTrigger>
            <TabsTrigger value="saved">Saved Plots</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="needs-improvement">Needs Improvement</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {plots.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 text-4xl">📋</div>
                  <h3 className="text-xl font-bold mb-2">No Listings Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first property listing
                  </p>
                  <Button onClick={() => navigate('/add-plot')}>Add Listing</Button>
                </div>
              </Card>
            ) : (
              plots.map((plot) => (
                <Card key={plot.id} className="glass-strong hover-lift">
                  <CardContent className="p-8">
                    <div className="flex gap-8">
                      {/* Image */}
                      <div className="w-72 h-48 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={(plot.images && plot.images[0]) || '/placeholder.svg'}
                          alt={plot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{plot.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{plot.location}</p>
                            <p className="text-2xl font-bold text-primary">
                              ₹{(plot.price / 100000).toFixed(2)}L
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {plot.is_verified && (
                              <Badge className="gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </Badge>
                            )}
                            {plot.is_boosted && (
                              <Badge variant="secondary" className="gap-1">
                                <Zap className="w-3 h-3" />
                                Boosted
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        {/* <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Listing Quality Score</span>
                            <span className="text-sm font-bold">{plot.listing_score}/100</span>
                          </div>
                          <Progress value={plot.listing_score} className="h-2" />
                          {plot.listing_score < 70 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              Improve your score to get more visibility
                            </p>
                          )}
                        </div> */}

                        {/* Stats */}
                        <div className="flex gap-6 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span>{plot.views_count} views</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <span>{plot.saves_count} saves</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MessageCircle className="w-4 h-4 text-muted-foreground" />
                            <span>{plot.inquiries_count} inquiries</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/property/${plot.id}`)}
                          >
                            View Listing
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(plot.id)}
                            className="gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Button>
                          {/* <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateAIDescription(plot.id)}
                            disabled={generatingDescription === plot.id}
                            className="gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            {generatingDescription === plot.id ? 'Generating...' : 'AI Description'}
                          </Button> */}
                          {/* <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => calculateScore(plot.id)}
                            className="gap-2"
                          >
                            <Target className="w-4 h-4" />
                            Update Score
                          </Button> */}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            <TrendingUp className="w-4 h-4" />
                            Boost Listing
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(plot.id)}
                            className="gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedPlots.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 text-4xl">❤️</div>
                  <h3 className="text-xl font-bold mb-2">No Saved Plots Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse properties and save your favorites to see them here
                  </p>
                  <Button onClick={() => navigate('/properties')}>Browse Plots</Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlots.map((saved) => (
                  <Card key={saved.id} className="overflow-hidden hover-lift">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={(saved.plots.images && saved.plots.images[0]) || '/placeholder.svg'}
                        alt={saved.plots.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold mb-2">{saved.plots.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{saved.plots.location}</p>
                      <p className="text-2xl font-bold text-primary mb-3">
                        ₹{(saved.plots.price / 100000).toFixed(2)}L
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{saved.plots.area}</span>
                        <span>{saved.plots.plot_type}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/property/${saved.plot_id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUnsave(saved.id)}
                        >
                          <Heart className="w-4 h-4 fill-destructive text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {/* Same content filtered for active listings */}
          </TabsContent>

          <TabsContent value="needs-improvement">
            {/* Same content filtered for listings with score < 70 */}
          </TabsContent>
        </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your property listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
