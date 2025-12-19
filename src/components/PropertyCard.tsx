import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Square } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompare } from "@/contexts/CompareContext";
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
import LOGOZamin from "@/assets/LOGOZamin.png";

/* ---------------- TYPES ---------------- */
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
  isFeatured?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

/* ---------------- HIGHLIGHT CHIP ---------------- */
const Highlight = ({ label }: { label: string }) => (
  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border shadow-sm">
    {label}
  </span>
);

/* ---------------- MAIN COMPONENT ---------------- */
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
  isFeatured = true,
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
        className={`
          group cursor-pointer overflow-hidden
          rounded-2xl bg-white border
          transition-all hover:shadow-2xl
          flex h-[300px] w-full
        `}
      >
        {/* ---------------- IMAGE ---------------- */}
        <div
          className="relative w-[350px] h-full overflow-hidden flex-shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex h-full transition-transform duration-700"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={title}
                className="w-[350px] h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          <Badge className="absolute top-3 left-3 bg-primary text-white">
            {type}
          </Badge>

          {/* {isFeatured && (
            <span className="absolute top-12 left-3 px-3 py-1 text-xs rounded-full bg-orange-500 text-white font-semibold">
              FEATURED
            </span>
          )} */}
        </div>

        {/* ---------------- CONTENT ---------------- */}
        <CardContent className="flex flex-col justify-between p-6 flex-1">
          {/* TOP */}
          <div>
            {/* LOCATION */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <MapPin size={14} />
              {location}
            </div>

            {/* TITLE */}
            <h3 className="text-lg font-bold leading-snug mb-2 line-clamp-2">
              {title}
            </h3>

            {/* PRICE */}
            <div className="flex items-end gap-3 mb-3">
              <div className="text-2xl font-extrabold text-primary">
                {price}
              </div>
              <span className="text-sm text-muted-foreground">
                ({area})
              </span>
            </div>

            {/* META */}
            {/* <div className="flex gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Square size={14} />
                {dimensions}
              </div>
            </div> */}

            {/* HIGHLIGHTS */}
            <div className="bg-muted/40 rounded-xl p-3">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                HIGHLIGHTS
              </div>
              <div className="flex flex-wrap gap-2">
                <Highlight label="North-East Facing" />
                <Highlight label="Corner Property" />
                {/* <Highlight label="Ready To Move" /> */}
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex items-center justify-between mt-5">
            {/* DEALER */}
            {sellerName && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-orange-500 overflow-hidden bg-white">
                  <img
                    src={LOGOZamin}
                    alt="Dealer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <span className="block text-[11px] px-2 text-xs font-semibold rounded-full bg-orange-500 text-white">
                    FEATURED DEALER
                  </span>
                  <span className="text-sm font-semibold">
                    {sellerName}
                  </span>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3">
              {/* <Button variant="outline" className="rounded-full px-5">
                View Number
              </Button> */}
              <Button className="rounded-full px-6">
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DELETE DIALOG */}
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
