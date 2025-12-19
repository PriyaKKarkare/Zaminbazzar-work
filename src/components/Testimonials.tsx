import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  propertyType: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Mumbai, Maharashtra",
    image: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=7c3aed&color=fff&size=200",
    rating: 5,
    text: "Found my dream plot within a week! The platform is very user-friendly and the verification process gave me confidence. Highly recommended for anyone looking for genuine property listings.",
    propertyType: "Residential Plot"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Pune, Maharashtra",
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=7c3aed&color=fff&size=200",
    rating: 5,
    text: "Excellent service! The team was very professional and helped me throughout the buying process. I got a great deal on a commercial plot. Thank you ZaminBazzar!",
    propertyType: "Commercial Plot"
  },
  {
    id: 3,
    name: "Amit Patel",
    location: "Bangalore, Karnataka",
    image: "https://ui-avatars.com/api/?name=Amit+Patel&background=7c3aed&color=fff&size=200",
    rating: 5,
    text: "Best platform for plot listings in India! The detailed information and virtual tours helped me make an informed decision without visiting multiple sites. Very satisfied with my purchase.",
    propertyType: "Agricultural Land"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real stories from satisfied customers who found their perfect plot
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Testimonials Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card border-2 shadow-xl">
                    <CardContent className="p-8 md:p-12">
                      <div className="flex flex-col items-center text-center">
                        {/* Quote Icon */}
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                          <Quote className="w-8 h-8 text-primary" />
                        </div>

                        {/* Rating Stars */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-6 h-6 fill-accent"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-lg md:text-xl text-foreground mb-8 leading-relaxed italic">
                          "{testimonial.text}"
                        </p>

                        {/* Customer Info */}
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full border-4 border-primary/20"
                          />
                          <div>
                            <h4 className="text-xl font-bold text-foreground">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.location}
                            </p>
                            <p className="text-xs text-primary font-medium mt-1">
                              Purchased: {testimonial.propertyType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
