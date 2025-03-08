"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Minimize2, Trash2 } from "lucide-react";
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

export function EditableCard({
  card,
  onSave,
  onDelete,
  pageSection,
  isAdmin = false,
}: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedCard, setEditedCard] = useState<CardItem>(card);

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
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <Card
        className={`w-full max-w-sm transition-all duration-300 overflow-hidden ${
          isExpanded ? "z-10 shadow-xl transform scale-110" : ""
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
                  folder={`images/${pageSection}`}
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
                  className={`w-full ${
                    isExpanded ? "h-80" : "h-64"
                  } object-cover transition-all duration-300`}
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

              {isExpanded && (
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={toggleExpand}
                    variant="outline"
                    size="sm"
                    className="bg-white/80 hover:bg-white rounded-full p-2 h-8 w-8"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {isExpanded && <div className="fixed inset-0 z-0 bg-black/20" onClick={toggleExpand}></div>}
    </div>
  );
}
