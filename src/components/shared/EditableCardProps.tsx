"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

interface CardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface EditableCardProps {
  card: CardData;
  onSave: (card: CardData) => void;
}

export function EditableCard({ card, onSave }: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);

  const handleSave = () => {
    onSave(editedCard);
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="relative">
          <img
            src={editedCard.imageUrl || "/api/placeholder/400/200"}
            alt={editedCard.title}
            className="w-full h-48 object-cover rounded-md mb-4 z"
          />
          {isEditing ? (
            <Input
              type="url"
              value={editedCard.imageUrl}
              onChange={(e) => setEditedCard({ ...editedCard, imageUrl: e.target.value })}
              className="mb-4"
              placeholder="Image URL"
            />
          ) : null}
        </div>

        {isEditing ? (
          <>
            <Input
              value={editedCard.title}
              onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
              className="mb-4"
              placeholder="Title"
            />
            <Textarea
              value={editedCard.description}
              onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
              className="mb-4"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Check className="w-4 h-4 mr-1" /> Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-lg mb-2">{editedCard.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{editedCard.description}</p>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
