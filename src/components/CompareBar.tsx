import { useCompare } from '@/contexts/CompareContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  const handleCompare = () => {
    navigate(`/compare?ids=${compareList.join(',')}`);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <Card className="glass-strong shadow-2xl border-2 border-primary/20">
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {compareList.length}
            </Badge>
            <span className="font-semibold text-foreground">
              {compareList.length === 1 ? 'Property' : 'Properties'} Selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Clear All
            </Button>
            <Button
              onClick={handleCompare}
              disabled={compareList.length < 2}
              className="gap-2"
              size="sm"
            >
              Compare Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {compareList.length < 2 && (
          <div className="px-6 pb-3 pt-0">
            <p className="text-xs text-muted-foreground">
              Add at least 2 properties to compare (max 4)
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
