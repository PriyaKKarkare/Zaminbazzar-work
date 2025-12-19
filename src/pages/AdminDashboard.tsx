import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3, Users, Home, Eye, Search, Trash2, 
  Shield, CheckCircle, XCircle, TrendingUp, FileText,
  ArrowUpRight, ArrowDownRight, Calendar, Clock,
  IndianRupee, MapPin, Building2, Activity
} from 'lucide-react';

interface Plot {
  id: string;
  title: string;
  location: string;
  price: number;
  plot_type: string;
  status: string;
  is_verified: boolean;
  views_count: number;
  created_at: string;
  user_id: string;
  seller_name: string | null;
  city: string | null;
  state: string | null;
}

interface UserProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  email?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  created_at: string;
  author_name: string | null;
}

interface Stats {
  totalListings: number;
  totalUsers: number;
  totalViews: number;
  activeListings: number;
  totalBlogs: number;
  verifiedListings: number;
  pendingListings: number;
  soldListings: number;
  publishedBlogs: number;
  totalValue: number;
  newUsersThisWeek: number;
  newListingsThisWeek: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'plot' | 'blog' } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      navigate('/auth');
      return;
    }
    
    checkAdminStatus();
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchAdminData();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchAdminData = async () => {
    try {
      const [plotsResult, profilesResult, blogsResult] = await Promise.all([
        supabase
          .from('plots')
          .select('id, title, location, price, plot_type, status, is_verified, views_count, created_at, user_id, seller_name, city, state')
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('id, full_name, phone, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('blogs')
          .select('id, title, slug, published, views, created_at, author_name')
          .order('created_at', { ascending: false })
      ]);

      if (plotsResult.error) throw plotsResult.error;
      if (profilesResult.error) throw profilesResult.error;
      if (blogsResult.error) throw blogsResult.error;

      const allPlots = plotsResult.data || [];
      const allUsers = profilesResult.data || [];
      const allBlogs = blogsResult.data || [];

      setPlots(allPlots);
      setUsers(allUsers);
      setBlogs(allBlogs);

      // Calculate stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setStats({
        totalListings: allPlots.length,
        totalUsers: allUsers.length,
        totalViews: allPlots.reduce((sum, p) => sum + (p.views_count || 0), 0),
        activeListings: allPlots.filter(p => p.status === 'active').length,
        totalBlogs: allBlogs.length,
        verifiedListings: allPlots.filter(p => p.is_verified).length,
        pendingListings: allPlots.filter(p => p.status === 'inactive').length,
        soldListings: allPlots.filter(p => p.status === 'sold').length,
        publishedBlogs: allBlogs.filter(b => b.published).length,
        totalValue: allPlots.reduce((sum, p) => sum + (p.price || 0), 0),
        newUsersThisWeek: allUsers.filter(u => new Date(u.created_at) > oneWeekAgo).length,
        newListingsThisWeek: allPlots.filter(p => new Date(p.created_at) > oneWeekAgo).length,
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPlot = async (plotId: string, verify: boolean) => {
    try {
      const { error } = await supabase
        .from('plots')
        .update({ is_verified: verify })
        .eq('id', plotId);

      if (error) throw error;

      setPlots(plots.map(p => 
        p.id === plotId ? { ...p, is_verified: verify } : p
      ));

      toast({
        title: verify ? 'Verified' : 'Unverified',
        description: `Property ${verify ? 'verified' : 'unverified'} successfully`
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (plotId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('plots')
        .update({ status })
        .eq('id', plotId);

      if (error) throw error;

      setPlots(plots.map(p => 
        p.id === plotId ? { ...p, status } : p
      ));

      toast({
        title: 'Status Updated',
        description: `Property status changed to ${status}`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteClick = (id: string, type: 'plot' | 'blog') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from(itemToDelete.type === 'plot' ? 'plots' : 'blogs')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      if (itemToDelete.type === 'plot') {
        setPlots(plots.filter(p => p.id !== itemToDelete.id));
      } else {
        setBlogs(blogs.filter(b => b.id !== itemToDelete.id));
      }

      toast({
        title: 'Deleted',
        description: `${itemToDelete.type === 'plot' ? 'Property' : 'Blog'} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handlePublishBlog = async (blogId: string, publish: boolean) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ published: publish })
        .eq('id', blogId);

      if (error) throw error;

      setBlogs(blogs.map(b => 
        b.id === blogId ? { ...b, published: publish } : b
      ));

      toast({
        title: publish ? 'Published' : 'Unpublished',
        description: `Blog ${publish ? 'published' : 'unpublished'} successfully`
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog status',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  const filteredPlots = plots.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.seller_name && p.seller_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = users.filter(u => 
    (u.full_name && u.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.phone && u.phone.includes(searchTerm))
  );

  const recentPlots = plots.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Listings</p>
                <p className="text-3xl font-bold">{stats?.totalListings}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +{stats?.newListingsThisWeek} this week
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Home className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +{stats?.newUsersThisWeek} this week
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-3xl font-bold">{stats?.totalViews?.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all listings
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-3xl font-bold">{formatPrice(stats?.totalValue || 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Total listed value
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listing Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Listing Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Active
                </span>
                <span className="font-medium">{stats?.activeListings}</span>
              </div>
              <Progress value={stats?.totalListings ? (stats.activeListings / stats.totalListings) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Pending
                </span>
                <span className="font-medium">{stats?.pendingListings}</span>
              </div>
              <Progress value={stats?.totalListings ? (stats.pendingListings / stats.totalListings) * 100 : 0} className="h-2 [&>div]:bg-yellow-500" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Sold
                </span>
                <span className="font-medium">{stats?.soldListings}</span>
              </div>
              <Progress value={stats?.totalListings ? (stats.soldListings / stats.totalListings) * 100 : 0} className="h-2 [&>div]:bg-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{stats?.verifiedListings}</p>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent"
                  style={{
                    transform: `rotate(${stats?.totalListings ? (stats.verifiedListings / stats.totalListings) * 360 : 0}deg)`,
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm mt-4">
              <span>Unverified: {(stats?.totalListings || 0) - (stats?.verifiedListings || 0)}</span>
              <span className="text-primary font-medium">
                {stats?.totalListings ? Math.round((stats.verifiedListings / stats.totalListings) * 100) : 0}% verified
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Blog Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{stats?.totalBlogs}</p>
                <p className="text-xs text-muted-foreground">Total Posts</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{stats?.publishedBlogs}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-2xl font-bold text-primary">
                {blogs.reduce((sum, b) => sum + (b.views || 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Blog Views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recent Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPlots.map((plot) => (
                <div key={plot.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{plot.title}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {plot.city || plot.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{formatPrice(plot.price)}</p>
                    <Badge variant={plot.is_verified ? "default" : "secondary"} className="text-xs">
                      {plot.is_verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('listings')}>
              View All Listings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((profile) => (
                <div key={profile.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-500">
                      {profile.full_name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{profile.full_name || 'Not set'}</p>
                    <p className="text-sm text-muted-foreground">{profile.phone || 'No phone'}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('users')}>
              View All Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderListings = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>All Property Listings</CardTitle>
            <CardDescription>Manage and verify property listings</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlots.map((plot) => (
                <TableRow key={plot.id}>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="font-medium truncate">{plot.title}</p>
                      <p className="text-xs text-muted-foreground">{plot.seller_name || 'Unknown seller'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px]">
                      <p className="truncate">{plot.city || plot.location}</p>
                      <p className="text-xs text-muted-foreground">{plot.state}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatPrice(plot.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{plot.plot_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={plot.status || 'active'}
                      onValueChange={(value) => handleStatusChange(plot.id, value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={plot.is_verified ? "default" : "outline"}
                      onClick={() => handleVerifyPlot(plot.id, !plot.is_verified)}
                    >
                      {plot.is_verified ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>{plot.views_count || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/property/${plot.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(plot.id, 'plot')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderUsers = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>User ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {profile.full_name?.charAt(0).toUpperCase() || '?'}
                        </span>
                      </div>
                      <span className="font-medium">{profile.full_name || 'Not set'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{profile.phone || 'Not set'}</TableCell>
                  <TableCell>
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {profile.id.slice(0, 8)}...
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderBlogs = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>Manage and publish blog content</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {blog.title}
                  </TableCell>
                  <TableCell>{blog.author_name || 'Unknown'}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={blog.published ? "default" : "outline"}
                      onClick={() => handlePublishBlog(blog.id, !blog.published)}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </Button>
                  </TableCell>
                  <TableCell>{blog.views || 0}</TableCell>
                  <TableCell>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(blog.id, 'blog')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const renderComingSoon = (title: string) => (
    <Card>
      <CardContent className="py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">This feature is coming soon.</p>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'listings':
        return renderListings();
      case 'users':
        return renderUsers();
      case 'blogs':
        return renderBlogs();
      case 'analytics':
        return renderComingSoon('Analytics Dashboard');
      case 'messages':
        return renderComingSoon('Messages');
      case 'notifications':
        return renderComingSoon('Notifications');
      case 'settings':
        return renderComingSoon('Admin Settings');
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-6">
            <div>
              <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Website
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
