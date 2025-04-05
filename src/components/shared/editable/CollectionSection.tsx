"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CardItem } from "@/types/cardTypes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SectionType } from "@prisma/client";
import { EditableCard } from "../Card/EditableCard";

interface CollectionSectionProps {
  pageSection: SectionType;
}

export const CollectionSection = ({ pageSection }: CollectionSectionProps) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const { status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCardId, setNewCardId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      console.log("is connected as admin");
      setIsAdmin(true);
    }
  }, [status]);

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/card");
      if (!response.ok) throw new Error("Failed to fetch cards");

      const data = await response.json();

      // Filter cards for this specific page section
      const filteredCards = data.filter((card: CardItem) => card.type === pageSection);

      // Sort cards by order property, fallback to createdAt if no order exists
      const sortedCards = [...filteredCards].sort((a, b) => {
        // If cards have order property, use it
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // Otherwise sort by createdAt date
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      setCards(sortedCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      toast({
        title: "Error",
        description: "Failed to load cards. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (updatedCard: CardItem) => {
    try {
      // Make sure we're not sending any extra fields not in the database model
      const cardToUpdate = {
        id: updatedCard.id,
        title: updatedCard.title || "",
        description: updatedCard.description || "",
        imageUrl: updatedCard.imageUrl,
        type: pageSection,
        order: updatedCard.order, // Include order if it exists
      };

      const response = await fetch("/api/card", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardToUpdate),
      });

      if (!response.ok) throw new Error("Failed to update card");

      // Update the card in the local state instead of re-fetching all cards
      setCards((currentCards) =>
        currentCards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );

      toast({
        title: "Success",
        description: "Card updated successfully",
      });
    } catch (error) {
      console.error("Error updating card:", error);
      toast({
        title: "Error",
        description: "Failed to save card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/card`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete card");

      // Remove the card from the local state instead of re-fetching
      setCards((currentCards) => currentCards.filter((card) => card.id !== id));

      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "Error",
        description: "Failed to delete card. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddCard = async () => {
    try {
      // Find max order to put new card at the end
      const maxOrder = cards.length > 0 ? Math.max(...cards.map((card) => card.order || 0)) : -1;

      // Create a new card with default values
      const newCard = {
        title: "",
        description: "",
        imageUrl: "/api/placeholder/400/400",
        pageSection: pageSection,
        order: maxOrder + 1, // Set order to be at the end
      };

      const response = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) throw new Error("Failed to create card");

      // Get the newly created card from the response and add it to the local state
      const createdCard = await response.json();
      setCards((currentCards) => [...currentCards, createdCard]);
      setNewCardId(createdCard.id);

      toast({
        title: "Success",
        description: "New card created successfully",
      });
    } catch (error) {
      console.error("Error adding card:", error);
      toast({
        title: "Error",
        description: "Failed to add new card. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cette fonction est utilisée pour la visualisation uniquement, sans affecter l'état des cartes
  const handleCardNavigation = (cardId: string) => {
    // On se contente de logger sans modifier l'état des cartes ou l'ordre
    console.log(`Navigation to card: ${cardId} - view only mode, not affecting collection order`);

    // Ne pas modifier l'état cards ici
    // Ne pas réordonner les cartes ici
    // Ne pas changer les propriétés des cartes
  };

  return (
    <section id="collection" className="container mx-auto py-16 px-4">
      <div className="flex justify-center items-center mb-12">
        <h2 className="text-3xl font-bold">Notre collection</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <EditableCard
            key={card.id}
            card={card}
            onSave={handleSave}
            onDelete={handleDelete}
            type={pageSection}
            isAdmin={isAdmin}
            isNewCard={card.id === newCardId}
            allCards={cards}
            onNavigate={handleCardNavigation} // Utiliser notre fonction qui ne modifie pas l'ordre
          />
        ))}
      </div>
      <div className="flex flex-row-reverse mt-6">
        {isAdmin && (
          <Button onClick={handleAddCard} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Ajouter un element
          </Button>
        )}
      </div>
    </section>
  );
};
