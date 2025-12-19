import { Card } from '@/components/ui/card';
import Banner1 from "@/assets/banners/Banner1.jpeg";
import Banner2 from "@/assets/banners/Banner2.jpeg";

interface AdBannerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  image?: string;
  link?: string;
}

const AdBanner = ({ orientation = 'vertical', className = '' }: AdBannerProps) => {
  return (
    <Card 
    className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] overflow-hidden bg-transparent shadow-none border-none ${className}`}
    >
      <div 
      // className={` ${orientation === 'horizontal' ? 'h-30' : 'h-[600px]'
      //   } flex flex-col items-center justify-center  rounded-2xl overflow-hidden`}
        >
        {/* Ad Space Label */}

        {/* Placeholder Content */}
        <div className="text-center space-y-2">

          {/* <ExternalLink className="w-12 h-12 mx-auto text-primary/40" /> */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              <a
                href="https://www.zaminwale.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full"
              >
                <img
                  src={orientation === 'horizontal' ? Banner2 : Banner1}
                  alt="Advertisement"
                  className="w-full h-full object-cover  rounded-2xl"
                />
              </a>
            </p>
          </div>
        </div>
      </div>
    </Card >
  );
};

export default AdBanner;
