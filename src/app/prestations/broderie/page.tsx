"use client";
import { EditableCard } from "@/components/shared/EditableCard";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/shared/PageLayout";
import { CardItem } from "@/types/cardTypes";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Broderie() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const pageSection = "broderie";

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
      console.log(data);

      // Sort cards by order property, fallback to createdAt if no order exists
      const sortedCards = [...data].sort((a, b) => {
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

  // Function to handle reordering cards (optional drag-and-drop implementation)
  const handleReorder = async (reorderedCards: CardItem[]) => {
    // Update the order property on each card
    const updatedCards = reorderedCards.map((card, index) => ({
      ...card,
      order: index,
    }));

    // Update the cards in the database
    try {
      // This would require a new API endpoint that can handle bulk updates
      const response = await fetch("/api/reorder-cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCards),
      });

      if (!response.ok) throw new Error("Failed to update card order");

      // Update local state with the new order
      setCards(updatedCards);

      toast({
        title: "Success",
        description: "Card order updated successfully",
      });
    } catch (error) {
      console.error("Error updating card order:", error);
      toast({
        title: "Error",
        description: "Failed to update card order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <PageLayout pageSection={pageSection} />
      </section>

      <section className="container mx-auto py-16 px-4">
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
              pageSection={pageSection}
              isAdmin={isAdmin}
            />
          ))}
        </div>
        <div className="flex flex-row-reverse mt-6">
          {isAdmin && (
            <Button onClick={handleAddCard} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Add New Card
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
