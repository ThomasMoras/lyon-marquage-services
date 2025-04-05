"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CardItem, EditableCardProps, ImageCropOptions } from "@/types/cardTypes";
import { CardDisplay } from "./CardDisplay";
import { CardForm } from "./CardForm";
import { CardModal } from "./CardModal";
import { ImageCropper } from "./ImageCropper";

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
  const [showCropMode, setShowCropMode] = useState<boolean>(false);
  const [cropOptions, setCropOptions] = useState<ImageCropOptions>({
    scale: card.cropOptions?.scale || 1,
    position: card.cropOptions?.position || { x: 0, y: 0 },
  });
  const [visualCards, setVisualCards] = useState<CardItem[]>([]);
  const [visualCurrentCard, setVisualCurrentCard] = useState<CardItem | null>(null);

  // Initialiser l'état visuel quand on ouvre le modal
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
        console.error("Erreur lors de l'initialisation de l'état visuel:", error);
      }
    }
  }, [isExpanded, card.id, allCards]);

  // Mettre à jour editedCard quand card change
  useEffect(() => {
    if (!isExpanded) {
      try {
        const cardClone = JSON.parse(JSON.stringify(card)) as CardItem;
        setEditedCard(cardClone);

        if (card.cropOptions) {
          setCropOptions(card.cropOptions);
        } else {
          setCropOptions({
            scale: 1,
            position: { x: 0, y: 0 },
          });
        }
      } catch (error) {
        console.error("Erreur lors de la copie de la carte:", error);
        setEditedCard({ ...card });
      }

      if (allCards && allCards.length > 0) {
        const index = allCards.findIndex((c) => c.id === card.id);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }
  }, [card, allCards, isExpanded]);

  const handleSave = async (): Promise<void> => {
    const updatedCard: CardItem = {
      ...editedCard,
      cropOptions: cropOptions,
    };
    await onSave(updatedCard);
    setIsEditing(false);
  };

  const handleDelete = async (): Promise<void> => {
    if (onDelete) {
      await onDelete(card.id);
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
        console.error("Erreur lors de l'initialisation de l'état visuel:", error);
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

  const resetCrop = (): void => {
    setCropOptions({
      scale: 1,
      position: { x: 0, y: 0 },
    });
  };

  // Déterminer quelle carte afficher dans le modal
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
            showCropMode ? (
              <ImageCropper
                editedCard={editedCard}
                cropOptions={cropOptions}
                setCropOptions={setCropOptions}
                resetCrop={resetCrop}
                setShowCropMode={setShowCropMode}
              />
            ) : (
              <CardForm
                editedCard={editedCard}
                setEditedCard={setEditedCard}
                type={type}
                resetCrop={resetCrop}
                setShowCropMode={setShowCropMode}
                handleSave={handleSave}
                setIsEditing={setIsEditing}
              />
            )
          ) : (
            <CardDisplay
              editedCard={editedCard}
              cropOptions={cropOptions}
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
