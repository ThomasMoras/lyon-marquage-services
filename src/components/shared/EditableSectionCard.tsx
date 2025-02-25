"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageSelector } from "./ImageSelector";
import { EditableSectionCardProps, PageSectionType, Section } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditableSectionCard({
  section,
  onSave,
  onDelete,
  pageSection,
  isAdmin = false,
}: EditableSectionCardProps & { onDelete?: (id: string) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState<Section>(section);

  const handleSave = async () => {
    await onSave(editedSection);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(section.id);
    }
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
        currentImage={editedSection.imageUrl || ""}
        onSelect={(imagePath) => {
          setEditedSection({ ...editedSection, imageUrl: imagePath });
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
    <div className="w-full p-6 relative">
      {isAdmin && !isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this section? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div
        className={cn(
          "flex gap-8 items-start",
          editedSection.imageLeft ? "flex-row" : "flex-row-reverse"
        )}
      >
        <div className="w-1/3 max-h-64 max-w-64 relative aspect-square overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
          <Image
            src={editedSection.imageUrl || "/api/placeholder/400/400"}
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

export function SectionContainer({
  sections,
  onSave,
  onDelete,
  onAdd,
  pageSection,
  isAdmin = false,
}: {
  sections: Section[];
  onSave: (section: Section) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: () => Promise<void>;
  pageSection: PageSectionType;
  isAdmin?: boolean;
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sections</h2>
      </div>

      <div className="space-y-16">
        {sections.length > 0 ? (
          sections.map((section) => (
            <EditableSectionCard
              key={section.id}
              section={section}
              onSave={onSave}
              onDelete={onDelete}
              pageSection={pageSection}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No sections found. Click "Add New Section" to create one.
          </div>
        )}

        <div className="flex flex-row-reverse mt-6">
          {isAdmin && (
            <Button onClick={onAdd} className="bg-green-600 hover:bg-green-700">
              Add New Section
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
