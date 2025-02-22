"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageSelector } from "./ImageSelector";
import { EditableSectionCardProps, Section } from "@/types";

export function EditableSectionCard({
  section,
  onSave,
  pageSection,
  isAdmin = false,
}: EditableSectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState<Section>(section);

  const handleSave = () => {
    onSave(editedSection);
    setIsEditing(false);
  };

  const contentSection = (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold pt-16 pl-9">{editedSection.title}</h2>
      <p className="text-muted-foreground">{editedSection.description}</p>
    </div>
  );

  const editingSection = (
    <div className="flex flex-col gap-4">
      <Input
        value={editedSection.title || ""}
        onChange={(e) => setEditedSection({ ...editedSection, title: e.target.value })}
        placeholder="Title"
      />
      <Textarea
        value={editedSection.description || ""}
        onChange={(e) => setEditedSection({ ...editedSection, description: e.target.value })}
        placeholder="Description"
      />
      <ImageSelector
        folder={`images/${pageSection}`}
        currentImage={editedSection.image || ""}
        onSelect={(imagePath) => {
          setEditedSection({ ...editedSection, image: imagePath });
        }}
      />
      <div className="flex items-center gap-2">
        <Switch
          checked={!!editedSection.imageLeft}
          onCheckedChange={(checked) => setEditedSection({ ...editedSection, imageLeft: checked })}
        />
        <span>Image on left</span>
      </div>
    </div>
  );

  return (
    <div className="w-full p-6">
      <div
        className={cn(
          "flex gap-8 items-start",
          editedSection.imageLeft ? "flex-row" : "flex-row-reverse"
        )}
      >
        <div className="w-1/3 max-h-64 max-w-64 relative aspect-square overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <Image
            src={editedSection.image || "/api/placeholder/400/400"}
            alt={editedSection.title || "Section image"}
            fill
            className="object-cover rounded-xl shadow-xl"
          />
        </div>
        <div className="flex-1">
          {isEditing ? editingSection : contentSection}
          <div className="mt-4">
            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
              </div>
            ) : (
              isAdmin && (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Pencil className="w-4 h-4 mr-1" /> Edit
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
