import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}: EmptyStateProps) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <Card className="p-12 text-center">
      <div className="max-w-md mx-auto">
        {emoji ? (
          <div className="mb-4 text-6xl">{emoji}</div>
        ) : Icon ? (
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        ) : null}
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        {actionLabel && (
          <Button onClick={handleAction} size="lg">
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};
