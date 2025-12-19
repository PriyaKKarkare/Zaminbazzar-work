import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Square, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompare } from "@/contexts/CompareContext";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

interface PropertyCardProps {
  id?: string;
  userId?: string;
  image: string;
  images?: string[];
  title: string;
  location: string;
  price: string;
  area: string;
  dimensions: string;
  type: string;
  sellerName?: string;
  sellerPhoto?: string;
  isFeatured?: boolean; // ⭐ NEW
  onClick?: () => void;
  onDelete?: () => void;
}

const PropertyCard = ({
  id,
  userId,
  image,
  images = [],
  title,
  location,
  price,
  area,
  dimensions,
  type,
  sellerName,
  sellerPhoto,
  isFeatured = true, // demo default
  onClick,
  onDelete,
}: PropertyCardProps) => {
  const { user } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare, compareList } =
    useCompare();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isOwner = user && userId && user.id === userId;
  const isCompareChecked = id ? isInCompare(id) : false;
  const isCompareDisabled = !isCompareChecked && compareList.length >= 4;

  const allImages =
    images.length > 0 ? images : [image || "/placeholder.svg"];

  /* -------- IMAGE SLIDER -------- */
  useEffect(() => {
    if (allImages.length <= 1) return;

    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [allImages.length, isHovered]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/edit-plot/${id}`;
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;

    if (isCompareChecked) {
      removeFromCompare(id);
      toast.success("Removed from comparison");
    } else {
      if (compareList.length >= 4) {
        toast.error("You can compare up to 4 properties");
        return;
      }
      addToCompare(id);
      toast.success("Added to comparison");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase.from("plots").delete().eq("id", id);
      if (error) throw error;

      toast.success("Property deleted");
      setShowDeleteDialog(false);
      onDelete?.();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        onClick={onClick}
        className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all flex flex-row h-[300px] w-full"
      >
        {/* ---------------- IMAGE SECTION ---------------- */}
        <div
          className="relative w-[380px] h-full flex-shrink-0 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            }}
          >
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={title}
                className="w-[380px] h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          {/* Plot Type Badge */}
          <Badge className="absolute top-3 left-3 bg-primary text-white shadow">
            {type}
          </Badge>

          {/* ⭐ Featured Chip */}
          {isFeatured && (
            <div className="absolute top-[52px] left-3">
              <span
                className="px-3 py-1 text-xs font-semibold rounded-full
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-white shadow-md"
              >
                ⭐ Featured
              </span>
            </div>
          )}

          {/* Compare */}
          {id && (
            <div
              className="absolute bottom-3 left-3 bg-white/95 rounded-lg p-2 shadow"
              onClick={handleCompareToggle}
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isCompareChecked}
                  disabled={isCompareDisabled}
                />
                <span className="text-xs font-medium">Compare</span>
              </div>
            </div>
          )}

          {/* Owner actions */}
          {isOwner && (
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* ---------------- CONTENT ---------------- */}
        <CardContent className="flex flex-col justify-between p-6 flex-1">
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary">
              {title}
            </h3>

            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
              <MapPin className="w-4 h-4" />
              {location}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                {area}
              </div>
              {dimensions && <span>{dimensions}</span>}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-2xl font-bold text-primary">{price}</span>

            {sellerName && (
              <div className="flex items-center gap-3">
                {/* Dealer Logo Image */}
                <div className="w-10 h-10 rounded-full border-2 border-orange-400 bg-white overflow-hidden flex items-center justify-center">
                  <img
                    src="/LOGOZamin.png"
                    alt="Dealer Logo"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col leading-tight">
                  {/* Featured Dealer Badge */}
                  {isFeatured && (
                    <span
                      className="w-fit px-2 py-[2px] mb-1 rounded-full
          text-[10px] font-semibold
          bg-orange-500 text-white"
                    >
                      FEATURED DEALER
                    </span>
                  )}

                  {/* Dealer Name */}
                  <span className="text-sm font-semibold text-primary">
                    {sellerName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ---------------- DELETE DIALOG ---------------- */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PropertyCard;
