"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  section: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    imageLeft: boolean;
  };
  onSave: (section: any) => void;
}

export function EditableSectionCard({ section, onSave }: SectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState(section);

  const handleSave = () => {
    onSave(editedSection);
    setIsEditing(false);
  };

  const contentSection = (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{editedSection.title}</h2>
      <p className="text-muted-foreground">{editedSection.description}</p>
    </div>
  );

  const editingSection = (
    <div className="flex flex-col gap-4">
      <Input
        value={editedSection.title}
        onChange={(e) => setEditedSection({ ...editedSection, title: e.target.value })}
        placeholder="Title"
      />
      <Textarea
        value={editedSection.description}
        onChange={(e) => setEditedSection({ ...editedSection, description: e.target.value })}
        placeholder="Description"
      />
      <Input
        type="url"
        value={editedSection.imageUrl}
        onChange={(e) => setEditedSection({ ...editedSection, imageUrl: e.target.value })}
        placeholder="Image URL"
      />
      <div className="flex items-center gap-2">
        <Switch
          checked={editedSection.imageLeft}
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
        <div className="w-1/3 relative aspect-square">
          <Image
            src={editedSection.imageUrl || "/api/placeholder/400/400"}
            alt={editedSection.title}
            fill
            className="object-cover rounded-lg"
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
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
