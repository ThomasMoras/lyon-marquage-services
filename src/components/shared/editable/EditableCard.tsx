"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Trash2, ChevronLeft, ChevronRight, X as Close } from "lucide-react";
import { ImageSelector } from "../ImageSelector";
import { CardItem, EditableCardProps } from "@/types/cardTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export function EditableCard({
  card,
  onSave,
  onDelete,
  type,
  isAdmin = false,
  isNewCard = false,
  allCards = [],
  onNavigate = () => {},
}: EditableCardProps & {
  allCards?: CardItem[];
  onNavigate?: (cardId: string) => void;
  chevronOffset?: number;
}) {
  const [isEditing, setIsEditing] = useState(isNewCard);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedCard, setEditedCard] = useState<CardItem>(card);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExpanded) return;

      if (e.key === "Escape") {
        setIsExpanded(false);
        document.body.style.overflow = "auto";
      } else if (e.key === "ArrowRight") {
        navigateToCard("next");
      } else if (e.key === "ArrowLeft") {
        navigateToCard("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, currentIndex]);

  // Trouver l'index de la carte actuelle dans la collection
  useEffect(() => {
    if (allCards && allCards.length > 0) {
      const index = allCards.findIndex((c) => c.id === card.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [card.id, allCards]);

  const handleSave = async () => {
    await onSave(editedCard);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(card.id);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Empêcher le scroll de la page quand l'image est agrandie
    if (!isExpanded) {
      document.body.style.overflow = "hidden";
      setIsExpanded(true);

      // Nous initialisons imageRect à null pour qu'il soit recalculé lors de l'ouverture
      setImageRect(null);
    } else {
      document.body.style.overflow = "auto";
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const updateImageRect = () => {
      if (isExpanded && imageRef.current) {
        setTimeout(() => {
          if (imageRef.current) {
            const rect = imageRef.current.getBoundingClientRect();
            setImageRect(rect);
            console.log(
              "Image dimensions updated:",
              rect.width,
              rect.height,
              "Left:",
              rect.left,
              "Right:",
              rect.right
            );
          }
        }, 150);
      }
    };

    if (isExpanded) {
      // Mesurer après un court délai pour s'assurer que l'image est rendue
      updateImageRect();

      // Recalculer lors des redimensionnements de fenêtre
      window.addEventListener("resize", updateImageRect);

      return () => {
        window.removeEventListener("resize", updateImageRect);
      };
    }
  }, [isExpanded]);

  const navigateToCard = (direction: "next" | "prev") => {
    if (!allCards || allCards.length <= 1) return;

    let newIndex = currentIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % allCards.length;
    } else {
      newIndex = (currentIndex - 1 + allCards.length) % allCards.length;
    }

    // Informer le parent du changement si nécessaire
    if (allCards[newIndex]) {
      onNavigate(allCards[newIndex].id);

      // Mettre à jour directement cette carte avec les données de la nouvelle carte
      // pour que la navigation fonctionne visuellement dans le modal
      setEditedCard(allCards[newIndex]);
      setCurrentIndex(newIndex);

      console.log(`Navigated to card index: ${newIndex}, id: ${allCards[newIndex].id}`);
    }
  };

  return (
    <div className="relative">
      <Card
        className={`w-full max-w-sm transition-all duration-300 overflow-hidden ${
          isExpanded ? "z-10" : ""
        }`}
      >
        <div className="relative w-full h-full">
          {isEditing ? (
            <CardContent className="p-4">
              <Input
                value={editedCard.title || ""}
                onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                className="mb-4"
                placeholder="Title (optional)"
              />
              <Textarea
                value={editedCard.description || ""}
                onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                className="mb-4"
                placeholder="Description (optional)"
              />
              <div className="mb-4">
                <ImageSelector
                  folder={`images/${type}`}
                  currentImage={editedCard.imageUrl || ""}
                  onSelect={(imagePath) => {
                    setEditedCard({ ...editedCard, imageUrl: imagePath });
                  }}
                  disabled={false}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            </CardContent>
          ) : (
            <div className="w-full h-full">
              <div className="cursor-pointer overflow-hidden" onClick={toggleExpand}>
                <img
                  src={editedCard.imageUrl || "/api/placeholder/400/400"}
                  alt="Card image"
                  className="w-full h-64 object-cover transition-all duration-300 hover:scale-105"
                />
              </div>

              {isAdmin && (
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        variant="outline"
                        size="sm"
                        className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this card? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

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
          )}
        </div>
      </Card>

      {/* Modal pour l'image agrandie avec navigation */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300"
          onClick={toggleExpand}
        >
          {/* Conteneur principal qui regroupe l'image et les chevrons */}
          <div
            className="relative flex items-center justify-center w-full max-w-7xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Conteneur de l'image */}
            <div className="relative max-w-5xl max-h-screen transition-transform duration-300 transform scale-100 animate-in fade-in">
              <Button
                onClick={toggleExpand}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 translate-x-16 -translate-y-12 transl z-10 bg-white/80 hover:bg-white rounded-full p-2 h-8 w-8"
              >
                <Close className="w-4 h-4" />
              </Button>

              <img
                ref={imageRef}
                src={editedCard.imageUrl || "/api/placeholder/800/800"}
                alt="Card image expanded"
                className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
                onLoad={() => {
                  if (imageRef.current) {
                    setTimeout(() => {
                      if (imageRef.current) {
                        const rect = imageRef.current.getBoundingClientRect();
                        setImageRect(rect);
                        console.log(
                          "Image loaded - dimensions:",
                          rect.width,
                          rect.height,
                          "Left:",
                          rect.left,
                          "Right:",
                          rect.right
                        );
                      }
                    }, 50);
                  }
                }}
              />

              {editedCard.title && (
                <div className="absolute bottom-4 left-0 right-0 text-center bg-black/50 p-2 text-white rounded-b-md">
                  <h3 className="font-semibold">{editedCard.title}</h3>
                  {editedCard.description && (
                    <p className="text-sm mt-1">{editedCard.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Flèches de navigation positionnées relativement à l'image */}
            {allCards && allCards.length > 1 && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToCard("prev");
                  }}
                  variant="outline"
                  size="icon"
                  style={{
                    position: "absolute",
                    left: imageRect ? `${imageRect.left - 400}px` : "50px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  className="bg-white/90 hover:bg-white rounded-full p-2 h-12 w-12 shadow-md z-20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToCard("next");
                  }}
                  variant="outline"
                  size="icon"
                  style={{
                    position: "absolute",
                    left: imageRect ? `${imageRect.right + -230}px` : "auto",
                    right: imageRect ? "auto" : "20px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  className="bg-white/90 hover:bg-white rounded-full p-2 h-12 w-12 shadow-md z-20"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
