import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { label: "Browse Properties", path: "/properties", icon: Search },
    { label: "Add Property", path: "/add-plot", icon: Home },
    { label: "Dashboard", path: "/seller-dashboard", icon: Home },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-background px-4 py-12">
        <div className="text-center max-w-2xl">
          <h1 className="mb-4 text-8xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Card className="p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    variant="outline"
                    className="gap-2 h-auto py-3"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Button>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              size="lg"
              className="gap-2"
            >
              <Home className="w-5 h-5" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
