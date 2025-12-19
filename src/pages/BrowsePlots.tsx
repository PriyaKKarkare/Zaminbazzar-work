import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import FloatingAssistant from '@/components/FloatingAssistant';
import AdBanner from '@/components/AdBanner';
import { CompareBar } from '@/components/CompareBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, Crown, Compass, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Plot {
  id: string;
  title: string;
  description: string;
  location: string;
  state?: string | null;
  price: number;
  area: string;
  dimensions: string;
  plot_type: string;
  image_url: string;
  images?: string[] | null;
  plot_facing?: string;
  road_width?: string;
  user_id?: string;
  created_at: string;
  seller_name?: string | null;
  seller_profile_photo?: string | null;
}

const BrowsePlots = ({ selected }) => {

  // const location = useLocation();
  // const selectedCity = location.state?.city;
  // console.log(selectedCity, "selectedcity");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [facingFilter, setFacingFilter] = useState('all');
  const [roadWidthFilter, setRoadWidthFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const { toast } = useToast();
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [citySearch, setCitySearch] = useState('');
  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [hasInitializedCity, setHasInitializedCity] = useState(false);

  const amenitiesList = [
    'Clear Title',
    'NA Approved',
    'TP Approved',
    'RERA Approved',
    'Gated Community',
    'Water Supply',
    'Electricity',
    'Corner Plot',
    'Park',
    '24/7 Security'
  ];

  const facingDirections = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
  const roadWidths = ['10 ft', '20 ft', '30 ft', '40 ft', '40+ ft'];

  const LOCATIONS = [
    "Thane",
    "Alibaug",
    "Khopoli Pali Road",
    "Panvel",
    "Uran",
    "Chirle",
    "Ranjanpada",
    "Vindhane",
    "Karjat",
    "Palghar"
  ];

  // const smartSuggestions = [
  //   { label: 'Plots under ₹10L', icon: TrendingUp, filters: { maxPrice: 1000000 } },
  //   { label: 'Vastu-friendly (East/North)', icon: Compass, filters: { facing: ['East', 'North'] } },
  //   { label: 'Clear Title Only', icon: Crown, filters: { amenities: ['Clear Title'] } },
  // ];

  useEffect(() => {
    document.title = "Browse Plots - Zaminbazzar | India's Leading Plot Marketplace";
    fetchPlots();
    // Check for filters in URL
    const stateParam = searchParams.get('state');
    const cityParam = searchParams.get("city");

    // 🔥 Apply ONLY ONCE (from Hero)
    if (cityParam && !hasInitializedCity) {
      setSelectedCities([cityParam]);
      // setSearchTerm(cityParam);
      setHasInitializedCity(true);
    }
    // const cityParam = searchParams.get('city');
    console.log("cityparam", cityParam)
    console.log("city param,,,, ", cityParam)
    const typeParam = searchParams.get('type');

    if (stateParam) {
      setStateFilter(stateParam);
    }
    if (cityParam) {
      setCityFilter(cityParam);
    }
    if (typeParam) {
      setTypeFilter(typeParam);
    }
  }, [searchParams, hasInitializedCity]);

  const allCities = LOCATIONS;

  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );

    // 👉 dropdown minimize after selection
    setOpenCityDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value) {
      setCityFilter(null);
      navigate('/properties');
    }
  };
  const fetchPlots = async () => {
    try {
      const { data, error } = await supabase
        .from('plots')
        .select('id, title, description, location, state, price, area, dimensions, plot_type, image_url, images, plot_facing, road_width, user_id, created_at, seller_name, seller_profile_photo')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlots(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load plots',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const applySuggestion = (filters: any) => {
    if (filters.maxPrice) setPriceRange([0, filters.maxPrice]);
    if (filters.facing) setFacingFilter(filters.facing[0]);
    if (filters.amenities) setSelectedAmenities(filters.amenities);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPriceRange([0, 10000000]);
    setSelectedAmenities([]);
    setFacingFilter("all");
    setRoadWidthFilter("all");
    setStateFilter(null);
    setCityFilter(null);
    setSelectedCities([]);
    setSortBy("recent");
    setOpenCityDropdown(false);
  
    setHasInitializedCity(false);
    navigate("/properties", { replace: true });
  };

  const filteredPlots = plots.filter(plot => {
    const matchesSearch = plot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || plot.plot_type === typeFilter;
    const matchesPrice = plot.price >= priceRange[0] && plot.price <= priceRange[1];
    const matchesFacing = facingFilter === 'all' || plot.plot_facing === facingFilter;
    const matchesRoadWidth = roadWidthFilter === 'all' || plot.road_width === roadWidthFilter;
    const matchesState = !stateFilter ||
      (plot.state && plot.state.toLowerCase().includes(stateFilter.toLowerCase()));
    const matchesCity =
      selectedCities.length === 0 ||
      selectedCities.some(city =>
        plot.location?.toLowerCase().includes(city.toLowerCase())
      );
    // const matchesCity = !cityFilter ||
    //   (plot.location && plot.location.toLowerCase().includes(cityFilter.toLowerCase()));
    console.log("matchesCity", matchesCity, "dsdsds", matchesSearch, "plot", plot);

    return matchesSearch && matchesType && matchesPrice && matchesFacing && matchesRoadWidth && matchesState && matchesCity;
  });

  const sortedPlots = [...filteredPlots].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'area':
        const areaA = parseFloat(a.area) || 0;
        const areaB = parseFloat(b.area) || 0;
        return areaB - areaA;
      case 'recent':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  console.log("filteredPlots", filteredPlots, sortedPlots, selected)
  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingAssistant />
      <CompareBar />

      <main className="bg-background min-h-screen">
        <section className="py-6">
          <div className="max-w-[1440px] mx-auto px-1 sm:px-2 lg:px-2">
            {/* Header with Top Banner */}
            <div className="mb-8 animate-fade-in flex items-start justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Browse <span className="text-primary">Properties</span>
                  {(stateFilter || cityFilter || typeFilter !== 'all') && (
                    <span className="text-2xl text-muted-foreground ml-2">
                      {cityFilter ? `in ${cityFilter}` : stateFilter ? `in ${stateFilter}` : typeFilter !== 'all' ? `- ${typeFilter}` : ''}
                    </span>
                  )}
                </h1>

                <p className="text-muted-foreground text-lg">
                  {cityFilter
                    ? `Showing ${filteredPlots.length} ${filteredPlots.length === 1 ? 'plot' : 'plots'} in ${cityFilter}`
                    : stateFilter
                      ? `Showing ${filteredPlots.length} ${filteredPlots.length === 1 ? 'plot' : 'plots'} in ${stateFilter}`
                      : typeFilter !== 'all'
                        ? `Showing ${filteredPlots.length} ${typeFilter} ${filteredPlots.length === 1 ? 'listing' : 'listings'}`
                        : `Discover ${filteredPlots.length} available plots across India`
                  }
                </p>

                {(stateFilter || cityFilter || typeFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-2"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
              <div>
                <AdBanner orientation="horizontal" className="w-[708px]" />
              </div>
            </div>

            {/* Smart Suggestions */}
            {/* <div className="mb-6 flex gap-3 flex-wrap animate-fade-in">
              {smartSuggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => applySuggestion(suggestion.filters)}
                    className="glass px-4 py-2 rounded-full flex items-center gap-2 hover-lift text-sm font-medium"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    {suggestion.label}
                  </button>
                );
              })}
            </div> */}

            <div className="flex gap-6">
              {/* Filters Sidebar */}
              <aside className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
                <Card className="glass-strong p-6 sticky top-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-primary" />
                      Smart Filters
                    </h2>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>

                  {/* Search */}
                  {/* <div className="space-y-2">
                    <Label className="text-sm font-semibold">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Location, title..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div> */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Locations</Label>

                    <div
                      className="border rounded-md p-2 cursor-pointer min-h-[42px]"
                      onClick={() => setOpenCityDropdown(!openCityDropdown)}
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedCities.length === 0 && (
                          <span className="text-sm text-muted-foreground">
                            Select locations...
                          </span>
                        )}

                        {selectedCities.map(city => (
                          <Badge
                            key={city}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {city}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCity(city);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {openCityDropdown && (
                      <div className="border rounded-md mt-1 bg-background shadow-lg p-2 space-y-2">
                        {/* Search inside dropdown */}
                        {/* <Input
                          placeholder="Search city..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                        /> */}

                        <div className="max-h-56 overflow-y-auto space-y-1">
                          {allCities
                            .filter(city =>
                              city.toLowerCase().includes(citySearch.toLowerCase())
                            )
                            .map(city => (
                              <div
                                key={city}
                                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted cursor-pointer"
                                onClick={() => toggleCity(city)}
                              >
                                <Checkbox checked={selectedCities.includes(city)} />
                                <span className="text-sm">{city}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Plot Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Plot Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Residential Plot">Residential</SelectItem>
                        <SelectItem value="Commercial Plot">Commercial</SelectItem>
                        <SelectItem value="Agricultural Plot">Agricultural</SelectItem>
                        <SelectItem value="Industrial Plot">Industrial</SelectItem>
                        <SelectItem value="Farm Land">Farm Land</SelectItem>
                        <SelectItem value="NA Plot">NA Plot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Budget Range</Label>
                    <div className="pt-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={10000000}
                        step={100000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{(priceRange[0] / 100000).toFixed(1)}L</span>
                      <span>₹{(priceRange[1] / 100000).toFixed(1)}L</span>
                    </div>
                  </div>

                  {/* Facing Direction */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Compass className="w-4 h-4 text-primary" />
                      Facing Direction
                    </Label>
                    <Select value={facingFilter} onValueChange={setFacingFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Direction</SelectItem>
                        {facingDirections.map((dir) => (
                          <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Road Width */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Minimum Road Width</Label>
                    <Select value={roadWidthFilter} onValueChange={setRoadWidthFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any Width" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Width</SelectItem>
                        {roadWidths.map((width) => (
                          <SelectItem key={width} value={width}>{width}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">Amenities & Legal</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {amenitiesList.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={selectedAmenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityToggle(amenity)}
                          />
                          <label
                            htmlFor={amenity}
                            className="text-sm cursor-pointer hover:text-primary transition-colors"
                          >
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Toggle Filters Button (Mobile) */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="mb-4 lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>

                {/* Results Header */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{sortedPlots.length}</span> properties
                  </p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="area">Area: Largest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-muted h-64 rounded-lg shimmer" />
                      </div>
                    ))}
                  </div>
                ) : sortedPlots.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="max-w-md mx-auto">
                      <div className="mb-4 text-6xl">📍</div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">
                        {cityFilter
                          ? `No Plots Available in ${cityFilter}`
                          : stateFilter
                            ? `No Plots Available in ${stateFilter}`
                            : typeFilter !== 'all'
                              ? `No ${typeFilter} Available`
                              : 'No Properties Found'}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {cityFilter || stateFilter
                          ? `We don't have any properties listed in ${cityFilter || stateFilter} yet. Check back soon or browse other locations.`
                          : typeFilter !== 'all'
                            ? `We don't have any ${typeFilter} listings yet. Check back soon or browse other types.`
                            : 'Try adjusting your filters or search terms to see more results.'
                        }
                      </p>
                      <Button onClick={clearFilters} size="lg">
                        {(stateFilter || cityFilter || typeFilter !== 'all') ? 'Browse All Properties' : 'Clear All Filters'}
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                    {sortedPlots.map((plot, idx) => (
                      <div key={plot.id} className="animate-fade-in hover-lift relative ">
                        {idx < 3 && (
                          <div
                          //   className="absolute top-56 left-3 z-20 flex items-center gap-1 rounded-full px-3 py-1 bg-gradient-to-r
                          // from-yellow-500 to-orange-500 text-white text-xs font-semibold shadow-md"
                          >
                            {/* <Crown className="w-4 h-" /> */}

                          </div>
                        )}
                        {/* {idx < 3 && (
                          <Badge className="absolute top-56 right-10 z-10 flex bg-gradient-to-r
                          from-yellow-500 to-orange-500 text-white shadow-lg">
                            <Crown className="w-4 h-4" />

                          </Badge>
                        )} */}
                        {/* <PropertyCard
                          id={plot.id}
                          userId={plot.user_id}
                          image={(plot.images && plot.images.length > 0 ? plot.images[0] : plot.image_url) || '/placeholder.svg'}
                          title={plot.title}
                          location={plot.location}
                          price={`₹${(plot.price / 100000).toFixed(2)}L`}
                          area={plot.area}
                          dimensions={plot.dimensions}
                          type={plot.plot_type}
                          sellerName={plot.seller_name}
                          sellerPhoto={plot.seller_profile_photo}
                          onClick={() => navigate(`/property/${plot.id}`)}
                          onDelete={fetchPlots}
                        /> */}
                        <PropertyCard
                          id={plot.id}
                          userId={plot.user_id}
                          image={plot.image_url || '/placeholder.svg'}
                          images={plot.images || []}
                          title={plot.title}
                          location={plot.location}
                          price={`₹${(plot.price / 100000).toFixed(2)}L`}
                          area={plot.area}
                          dimensions={plot.dimensions}
                          type={plot.plot_type}
                          sellerName={plot.seller_name}
                          sellerPhoto={plot.seller_profile_photo}
                          onClick={() => navigate(`/property/${plot.id}`)}
                          onDelete={fetchPlots}
                        />

                      </div>

                    ))}
                  </div>

                )}
              </div>

              {/* Right Sidebar Ad Banner */}
              <aside className="hidden xl:block w-80 flex-shrink-0">
                <div className="sticky top-6">
                  <AdBanner orientation="vertical" />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrowsePlots;
