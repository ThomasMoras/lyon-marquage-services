"use client";
import { EditableCard } from "@/components/shared/EditableCardProps";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/shared/PageLayout";

interface Card {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function Broderie() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const response = await fetch("/api/card");
    const data = await response.json();
    setCards(data);
  };

  const handleSave = async (updatedCard: Card) => {
    try {
      const response = await fetch("/api/card", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCard),
      });

      if (!response.ok) throw new Error("Failed to update card");
      await fetchCards();
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section>
        <PageLayout pageType="broderie" />
      </section>

      {/* Cards Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Embroidery Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <EditableCard key={card.id} card={card} onSave={handleSave} />
          ))}
        </div>
      </section>
    </div>
  );
}
