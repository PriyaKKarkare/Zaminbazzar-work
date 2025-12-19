import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Phone, User, ArrowUpRight, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary w-full">
      {/* Top Navigation Bar */}
      <div className="border-b border-primary-foreground/10 w-full">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src={logo} alt="Zaminbazzar Logo" className="h-10 w-auto" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => navigate('/')}
                className="text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => {
              

                  navigate("/properties");
                }}
                className="text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Browse Plots
              </button>

              <button
                onClick={() => navigate('/blog')}
                className="text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Blog
              </button>
              {user && (
                <button
                  onClick={() => navigate('/seller-dashboard')}
                  className="text-primary-foreground hover:text-accent transition-colors font-medium"
                >
                  Dashboard
                </button>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="tel:+918779377367" className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">8779377367</span>
              </a>

              {user ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="text-primary-foreground hover:text-accent hover:bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                  <Button
                    onClick={() => navigate('/add-plot')}
                    className="bg-accent text-accent-foreground hover:bg-accent-hover font-medium rounded-full px-6"
                  >
                    Add Property
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/auth')}
                    className="text-primary-foreground hover:text-accent hover:bg-transparent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login / Register
                  </Button>
                  <Button
                    onClick={() => navigate('/add-plot')}
                    className="bg-accent text-accent-foreground hover:bg-accent-hover font-medium rounded-full px-6"
                  >
                    Add Property
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-primary-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden py-4 border-t border-primary-foreground/20 bg-primary w-full">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => { navigate('/'); setIsMenuOpen(false); }}
                className="text-left text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => { localStorage.removeItem("selected"); navigate('/properties'); setIsMenuOpen(false); }}
                className="text-left text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Browse Plots
              </button>
              <button
                onClick={() => { navigate('/blog'); setIsMenuOpen(false); }}
                className="text-left text-primary-foreground hover:text-accent transition-colors font-medium"
              >
                Blog
              </button>
              {user && (
                <button
                  onClick={() => { navigate('/seller-dashboard'); setIsMenuOpen(false); }}
                  className="text-left text-primary-foreground hover:text-accent transition-colors font-medium"
                >
                  Dashboard
                </button>
              )}
              <a href="tel:+918779377367" className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">8779377367</span>
              </a>
              {user ? (
                <>
                  <Button
                    onClick={() => { navigate('/add-plot'); setIsMenuOpen(false); }}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent-hover"
                  >
                    Add Property
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="w-full text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                    className="w-full text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Login / Register
                  </Button>
                  <Button
                    onClick={() => { navigate('/add-plot'); setIsMenuOpen(false); }}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent-hover"
                  >
                    Add Property
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
