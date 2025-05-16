"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CardItem, EditableCardProps } from "@/types/card";
import { CardDisplay } from "./CardDisplay";
import { CardModal } from "./CardModal";
import { CropData } from "@/types";
import { EnhancedImageSelector } from "../EnhancedImageSelector";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AutoResizeTextarea } from "../AutoResizeTextarea";
import { useToast } from "@/hooks/use-toast";

export function EditableCard({
  card,
  onSave,
  onDelete,
  type,
  isAdmin = false,
  isNewCard = false,
  allCards = [],
  onNavigate = () => {},
}: EditableCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(isNewCard);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [editedCard, setEditedCard] = useState<CardItem>(structuredClone(card));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [visualCards, setVisualCards] = useState<CardItem[]>([]);
  const [visualCurrentCard, setVisualCurrentCard] = useState<CardItem | null>(null);
  const { toast } = useToast(); // Add toast hook for notifications

  // Specialized image selection handler
  const handleImageSelection = (imagePath: string, cropData: CropData) => {
    console.log("EditableCard - handleImageSelection:", { imagePath, cropData });

    // Update the card with both image URL and crop data
    const updatedCard = {
      ...editedCard,
      imageUrl: imagePath,
      cropData: cropData,
      // For backward compatibility with existing code that might still use cropOptions
      cropOptions: {
        scale: cropData.scale,
        position: cropData.position,
      },
    };

    console.log("Updated card:", updatedCard);
    setEditedCard(updatedCard);
  };

  // Initialize visual state when modal is opened
  useEffect(() => {
    if (isExpanded) {
      try {
        const cards = JSON.parse(JSON.stringify(allCards)) as CardItem[];
        setVisualCards(cards);

        const index = cards.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          setCurrentIndex(index);
          setVisualCurrentCard(cards[index]);
        }
      } catch (error) {
        console.error("Error initializing visual state:", error);
      }
    }
  }, [isExpanded, card.id, allCards]);

  // Update editedCard when card changes
  useEffect(() => {
    if (!isExpanded) {
      try {
        const cardClone = JSON.parse(JSON.stringify(card)) as CardItem;
        cardClone.cropData = {
          scale: 1,
          position: { x: 0, y: 0 },
          rotation: 0,
        };
        setEditedCard(cardClone);
      } catch (error) {
        console.error("Error copying card:", error);

        // Fallback to simple clone
        setEditedCard({
          ...card,
          cropData: card.cropData || {
            scale: 1,
            position: { x: 0, y: 0 },
            rotation: 0,
          },
        });
      }

      if (allCards && allCards.length > 0) {
        const index = allCards.findIndex((c: { id: string }) => c.id === card.id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }
  }, [card, allCards, isExpanded]);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      const updatedCard: CardItem = {
        ...editedCard,
      };
      await onSave(updatedCard);
      setIsEditing(false);
      toast({
        title: "Succès",
        description: "La carte a été enregistrée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la carte.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (onDelete) {
      try {
        await onDelete(card.id);

        // Show success toast
        toast({
          title: "Succès",
          description: "La carte a été supprimée avec succès.",
        });
      } catch (error) {
        console.error("Error deleting card:", error);

        // Show error toast
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression de la carte.",
          variant: "destructive",
        });
      }
    }
  };

  const toggleExpand = (e: React.MouseEvent): void => {
    e.stopPropagation();

    if (!isExpanded) {
      document.body.style.overflow = "hidden";
      setIsExpanded(true);

      try {
        const cards = JSON.parse(JSON.stringify(allCards)) as CardItem[];
        setVisualCards(cards);

        const index = cards.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          setCurrentIndex(index);
          setVisualCurrentCard(cards[index]);
        }
      } catch (error) {
        console.error("Error initializing visual state:", error);
      }
    } else {
      document.body.style.overflow = "auto";
      setIsExpanded(false);
      setVisualCurrentCard(null);
      setVisualCards([]);
    }
  };

  const navigateToCard = (direction: "next" | "prev"): void => {
    if (!visualCards || visualCards.length <= 1) return;

    let newIndex = currentIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % visualCards.length;
    } else {
      newIndex = (currentIndex - 1 + visualCards.length) % visualCards.length;
    }

    if (visualCards[newIndex]) {
      onNavigate(visualCards[newIndex].id);
      setCurrentIndex(newIndex);
      setVisualCurrentCard(visualCards[newIndex]);
    }
  };

  // Determine which card to show in the modal
  const cardToShow = isExpanded && visualCurrentCard ? visualCurrentCard : editedCard;

  return (
    <div className="relative">
      <Card
        className={`w-full max-w-sm transition-all duration-300 overflow-hidden ${
          isExpanded ? "z-10" : ""
        }`}
      >
        <div className="relative w-full h-full">
          {isEditing ? (
            <div className="p-4 space-y-4">
              {/* Form fields */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Edit Card</h3>

                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={editedCard.title || ""}
                    onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                    placeholder="Card title"
                    className="text-base border-2 focus-visible:ring-blue-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <AutoResizeTextarea
                    id="description"
                    value={editedCard.description || ""}
                    onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                    placeholder="Card description"
                    minHeight={80}
                    className="text-base border-2 focus-visible:ring-blue-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <EnhancedImageSelector
                    folder={`images/${type}`}
                    currentImage={editedCard.imageUrl || ""}
                    currentCropData={editedCard.cropData}
                    onSelect={handleImageSelection}
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="border-2"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <CardDisplay
              editedCard={editedCard}
              toggleExpand={toggleExpand}
              isAdmin={isAdmin}
              setIsEditing={setIsEditing}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </Card>

      {isExpanded && (
        <CardModal
          cardToShow={cardToShow}
          visualCurrentCard={visualCurrentCard}
          visualCards={visualCards}
          toggleExpand={toggleExpand}
          navigateToCard={navigateToCard}
        />
      )}
    </div>
  );
}

export default EditableCard;
