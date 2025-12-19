import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Home, SlidersHorizontal, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-landscape-new.jpg";

const Hero = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const q = searchQuery?.trim();
    onSelect(searchQuery);
    if (!q) {
      return;
    }
    navigate(`/properties?city=${encodeURIComponent(q)}`,
      {
        state: {
          city: searchQuery.trim()
        }
      }
    );
  };

  return (
    <section
      className="relative min-h-[500px] md:h-[600px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />

      <div className="container px-4 md:px-6 relative z-10 h-full flex flex-col justify-center items-center py-12">
        {/* Buy Tab */}
        <div className="flex justify-center mb-6 md:mb-8">
          <button
            onClick={() => navigate('/properties')}
            className="text-white font-semibold pb-2 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white"
          >
            {/* Buy */}
          </button>
        </div>

        {/* Heading */}
        <div className="text-center mb-6 md:mb-8 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="inline-block overflow-hidden border-r-4 border-white pr-2 animate-typing">
              India's Leading Plot Marketplace
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 animate-fade-in" style={{ animationDelay: '2s' }}>
            Let's find a plot that's perfect for you
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl sm:rounded-full shadow-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Home Icon */}
              <div className="hidden sm:block pl-3">
                <Home className="w-5 h-5 text-gray-400" />
              </div>

              {/* Search Input */}
              <Input
                placeholder="Select Location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled
                // onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 h-12 border-0 focus-visible:ring-0 bg-transparent shadow-none px-4 sm:px-0"
              />

              {/* Divider */}
              <div className="hidden sm:block h-8 w-px bg-gray-200" />

              {/* Location Dropdown */}
              <select
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 px-4 border-0 bg-transparent focus:outline-none cursor-pointer text-gray-700 font-medium w-full sm:w-auto"
              >
                <option value="">Select Location</option>
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

              {/* Divider */}
              <div className="hidden sm:block h-8 w-px bg-gray-200" />

              {/* Advanced Button */}
              <button
                onClick={() => navigate('/properties')}
                className="hidden md:flex items-center gap-2 px-4 h-12 hover:bg-gray-50 rounded-full transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-gray-700" />
                <span className="text-gray-700 font-medium">Advanced</span>
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="h-12 sm:h-14 w-full sm:w-14 rounded-xl sm:rounded-full bg-[#ff5a5f] hover:bg-[#ff4449] flex items-center justify-center shadow-lg transition-colors"
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
