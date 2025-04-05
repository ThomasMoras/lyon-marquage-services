import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CardDisplayProps } from "@/types/cardTypes";
import { CardDeleteDialog } from "./CardDeleteDialog";
import { useState } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function CardDisplay({
  editedCard,
  toggleExpand,
  isAdmin,
  setIsEditing,
  handleDelete,
}: CardDisplayProps) {
  const [imageError, setImageError] = useState(false);

  const getImageStyles = () => {
    return {
      objectFit: "cover" as const,
      width: "100%",
      height: "100%",
      objectPosition: "center",
    };
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-full h-full">
      <div className="cursor-pointer overflow-hidden" onClick={toggleExpand}>
        <div className="w-full h-64 relative">
          {editedCard.imageUrl && !imageError ? (
            <img
              src={editedCard.imageUrl}
              alt="Card image"
              className="absolute inset-0 w-full h-full transition-all duration-300"
              style={getImageStyles()}
              onError={handleImageError}
            />
          ) : (
            <ImagePlaceholder height="h-64" />
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="absolute bottom-2 right-2 flex gap-2">
          <CardDeleteDialog onDelete={handleDelete} />

          <Button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            variant="outline"
            size="sm"
            className="bg-white/80 hover:bg-white"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
