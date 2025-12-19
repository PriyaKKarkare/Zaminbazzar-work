import { Shield, TrendingUp, Users, Award, Clock, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Reason {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const reasons: Reason[] = [
  {
    icon: <Shield className="w-10 h-10" />,
    title: "100% Verified Properties",
    description: "Every plot undergoes strict verification ensuring legal documentation and clear titles for your peace of mind.",
    color: "from-blue-500/10 to-blue-600/5"
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Best Market Prices",
    description: "Get competitive pricing with transparent costs. No hidden charges, just honest deals that save you money.",
    color: "from-green-500/10 to-green-600/5"
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Expert Guidance",
    description: "Our team of real estate experts guide you through every step, from selection to legal documentation.",
    color: "from-purple-500/10 to-purple-600/5"
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "Trusted by Thousands",
    description: "Join over 50,000+ satisfied customers who found their dream plots through our platform.",
    color: "from-orange-500/10 to-orange-600/5"
  },
  {
    icon: <Clock className="w-10 h-10" />,
    title: "Quick & Easy Process",
    description: "From search to purchase in days, not months. Our streamlined process saves your valuable time.",
    color: "from-pink-500/10 to-pink-600/5"
  },
  {
    icon: <BadgeCheck className="w-10 h-10" />,
    title: "Post-Sale Support",
    description: "Our relationship doesn't end at sale. Get lifetime support for documentation and legal matters.",
    color: "from-indigo-500/10 to-indigo-600/5"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary font-semibold text-sm">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why ZaminBazaar is Your
            <br />
            <span className="text-primary">Perfect Plot Partner</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're not just a marketplace - we're your trusted partner in finding the perfect plot. 
            Here's what makes us stand out from the rest.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reason.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardContent className="p-8 relative z-10">
                {/* Icon Container */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-primary">
                  {reason.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>

                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex-1 text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Ready to Find Your Perfect Plot?
              </h3>
              <p className="text-muted-foreground">
                Join thousands of satisfied customers today
              </p>
            </div>
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-hover transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Exploring Plots →
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in" style={{ animationDelay: '700ms' }}>
          {[
            { number: "50,000+", label: "Happy Customers" },
            { number: "10,000+", label: "Verified Plots" },
            { number: "500+", label: "Cities Covered" },
            { number: "98%", label: "Satisfaction Rate" }
          ].map((stat, index) => (
            <div key={index} className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
