import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-16 relative z-0 mt-20 w-full">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Logo and Contact */}
          <div>
            <img src={logo} alt="Zaminbazzar" className="h-14 mb-6" />
            <div className="space-y-3 text-sm">
              <p className="text-white/70">Total Free Customer Care</p>
              <a href="tel:+918779377367" className="text-white font-bold text-lg block hover:text-primary transition-colors">
                8779377367
              </a>
              <p className="text-white/70 mt-4">Need Live Support?</p>
              <a href="mailto:info@zaminbazzar.com" className="text-white font-semibold block hover:text-primary transition-colors">
                info@zaminbazzar.com
              </a>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-bold mb-4">Follow us on social media</h4>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Popular Search */}
          <div>
            <h4 className="font-bold text-lg mb-6">Popular Search</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/properties?type=Residential+Plot" className="text-white/70 hover:text-white transition-colors">Residential Plots</Link></li>
              <li><Link to="/properties?type=Commercial+Plot" className="text-white/70 hover:text-white transition-colors">Commercial Plots</Link></li>
              <li><Link to="/properties?type=Agricultural+Plot" className="text-white/70 hover:text-white transition-colors">Agricultural Land</Link></li>
              <li><Link to="/properties?type=Industrial+Plot" className="text-white/70 hover:text-white transition-colors">Industrial Plots</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/add-plot" className="text-white/70 hover:text-white transition-colors">List Property</Link></li>
              <li><Link to="/properties" className="text-white/70 hover:text-white transition-colors">Browse Properties</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/auth" className="text-white/70 hover:text-white transition-colors">Login / Register</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-bold text-lg mb-6">Discover</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/properties?city=Thane" className="text-white/70 hover:text-white transition-colors">Thane</Link></li>
              <li><Link to="/properties?city=Alibaug" className="text-white/70 hover:text-white transition-colors">Alibaug</Link></li>
              <li><Link to="/properties?city=Khopoli+Pali+Road" className="text-white/70 hover:text-white transition-colors">Khopoli Pali Road</Link></li>
              <li><Link to="/properties?city=Panvel" className="text-white/70 hover:text-white transition-colors">Panvel</Link></li>
              <li><Link to="/properties?city=Uran" className="text-white/70 hover:text-white transition-colors">Uran</Link></li>
              <li><Link to="/properties?city=Chirle" className="text-white/70 hover:text-white transition-colors">Chirle</Link></li>
              <li><Link to="/properties?city=Ranjanpada" className="text-white/70 hover:text-white transition-colors">Ranjanpada</Link></li>
              <li><Link to="/properties?city=Vindhane" className="text-white/70 hover:text-white transition-colors">Vindhane</Link></li>
              <li><Link to="/properties?city=Karjat" className="text-white/70 hover:text-white transition-colors">Karjat</Link></li>
              <li><Link to="/properties?city=Palghar" className="text-white/70 hover:text-white transition-colors">Palghar</Link></li>
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-bold text-lg mb-4">Keep Yourself Up to Date</h4>
              <div className="flex gap-2">
                <Input 
                  type="email"
                  placeholder="Your Email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                />
                <Button className="bg-primary hover:bg-primary-hover h-12 px-6 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70 text-center md:text-left">
            <p>© 2025 Zaminbazzar. All rights reserved.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
              <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/properties" className="hover:text-white transition-colors">Browse Properties</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
