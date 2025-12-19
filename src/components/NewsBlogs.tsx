import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const blogs = [
  {
    title: "Why Thane is good for investment in Plots?",
    excerpt: "Thane is an emerging cosmopolitan city in the Mumbai Metropolitan Area and the most preferred location for real estate investment...",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "The Dos and Don'ts of Buying Land",
    excerpt: "Buying land is a dream for many people. Purchasing land is also one of the most important investments...",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Advantages of owning Plots",
    excerpt: "There is no doubt that real estate is one of the most fruitful and stable investments you can make...",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Mahamumbai - Your Future Investment Opportunity",
    excerpt: "MAHAMUMBAI enjoys high property supply, demand is growing due to construction of upcoming sea-link from Mumbai...",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  },
];

const NewsBlogs = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            News & <span className="text-primary">Blogs</span>
          </h2>
          <Button 
            variant="link" 
            className="text-primary gap-2"
            onClick={() => navigate('/blog')}
          >
            See More blogs <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogs.map((blog, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-border hover:shadow-large transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/blog')}
            >
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsBlogs;
