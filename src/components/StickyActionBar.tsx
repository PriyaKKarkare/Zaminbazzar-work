import { Phone, MessageCircle, Calendar, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface StickyActionBarProps {
  phone?: string;
  plotTitle: string;
}

const StickyActionBar = ({ phone, plotTitle }: StickyActionBarProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleCall = () => {
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    if (phone) {
      const message = encodeURIComponent(`Hi, I'm interested in: ${plotTitle}`);
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: plotTitle,
          text: `Check out this property: ${plotTitle}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border/50 backdrop-blur-xl animate-fade-in">
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Action Buttons */}
          <div className="flex gap-2 flex-1">
            <Button
              onClick={handleCall}
              className="flex-1 bg-gradient-hero hover:opacity-90 gap-2"
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Visit
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? 'text-destructive border-destructive' : ''}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyActionBar;
