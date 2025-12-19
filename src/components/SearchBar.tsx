import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/properties');
  };

  return (
    <section className="relative bg-gradient-to-b from-primary/95 to-primary pt-12 pb-40 w-full">
      <div className="container px-4 mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            India's Leading Plot Marketplace
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b-2 border-white/20 rounded-none h-auto p-0">
              <TabsTrigger 
                value="buy" 
                className="text-white/70 font-semibold pb-3 px-8 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger 
                value="rent" 
                className="text-white/70 font-semibold pb-3 px-8 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white data-[state=active]:shadow-none"
              >
                Rent
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto absolute left-0 right-0 bottom-0 transform translate-y-1/2 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row items-center gap-3">
            {/* Home Icon */}
            <div className="pl-4 hidden md:block">
              <Home className="w-6 h-6 text-muted-foreground" />
            </div>

            {/* Search Input */}
            <div className="flex-1 w-full md:w-auto">
              <Input 
                placeholder={`Enter Keyword for ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="h-14 border-0 focus-visible:ring-0 text-base bg-transparent shadow-none"
              />
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-border hidden md:block" />

            {/* Location Dropdown */}
            <div className="w-full md:min-w-[200px] md:pr-4">
              <select 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 px-4 text-base border-0 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="">Select Location1</option>
                <option value="Thane">Thane</option>
                <option value="Alibaug">Alibaug</option>
                <option value="Khopoli Pali Road">Khopoli Pali Road</option>
                <option value="Panvel">Panvel</option>
                <option value="Uran">Uran</option>
                <option value="Chirle">Chirle</option>
                <option value="Ranjanpada">Ranjanpada</option>
                <option value="Vindhane">Vindhane</option>
                <option value="Karjat">Karjat</option>
                <option value="Palghar">Palghar</option>
              </select>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-border hidden md:block" />

            {/* Advanced Button */}
            <Button 
              variant="ghost"
              onClick={() => navigate('/properties')}
              className="h-12 px-6 hover:bg-muted/50 w-full md:w-auto"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Advanced
            </Button>

            {/* Search Button */}
            <Button 
              onClick={handleSearch}
              size="lg"
              className="h-16 w-full md:w-16 rounded-full bg-destructive hover:bg-destructive/90 shadow-lg"
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
