"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Pencil, Check, X, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageSelector } from "../ImageSelector";
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
import { AutoResizeTextarea } from "../AutoResizeTextarea";

export function EditableSectionCard({
  section,
  onSave,
  onDelete,
  pageSection,
  isAdmin = false,
}: EditableSectionCardProps & { onDelete?: (id: string) => Promise<void> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSection, setEditedSection] = useState<Section>(section);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(editedSection);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(section.id);
      } catch (error) {
        console.error("Error deleting section:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Redesigned content section with improved typography and visual elements
  const contentSection = (
    <div className="flex flex-col gap-8 w-full overflow-hidden px-2 py-4 md:p-6">
      {/* Title with decorative accent */}
      <div className="relative">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-50 overflow-hidden text-ellipsis break-words">
          {editedSection.title}
        </h2>
        <div className="absolute -bottom-3 left-0 w-16 h-1 bg-blue-500 rounded-full"></div>
      </div>

      {/* Description with improved typography */}
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed overflow-hidden text-ellipsis break-words max-w-prose">
        {editedSection.description}
      </p>
    </div>
  );

  const editingSection = (
    <div className="flex flex-col gap-6 w-full p-4">
      <Input
        value={editedSection.title || ""}
        onChange={(e) => setEditedSection({ ...editedSection, title: e.target.value })}
        placeholder="Title"
        className="text-xl font-bold border-2 focus-visible:ring-blue-500"
        disabled={isSaving}
      />
      <AutoResizeTextarea
        id="description"
        value={editedSection.description || ""}
        onChange={(e) => setEditedSection({ ...editedSection, description: e.target.value })}
        placeholder="Description"
        minHeight={120}
        className="text-base border-2 focus-visible:ring-blue-500"
        disabled={isSaving}
      />
      <ImageSelector
        folder={`images/${pageSection}`}
        currentImage={editedSection.imageUrl || ""}
        onSelect={(imagePath) => {
          setEditedSection({ ...editedSection, imageUrl: imagePath });
        }}
        disabled={isSaving}
      />
      <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <Switch
          checked={!!editedSection.imageLeft}
          onCheckedChange={(checked) => setEditedSection({ ...editedSection, imageLeft: checked })}
          disabled={isSaving}
        />
        <span className="text-sm font-medium">Image on left</span>
      </div>
    </div>
  );

  return (
    <div className="w-full relative bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {isAdmin && !isEditing && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 rounded-full shadow-sm"
                disabled={isDeleting}
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
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div
        className={cn(
          "flex flex-wrap md:flex-nowrap gap-6 md:gap-12 items-center p-4 md:p-8",
          editedSection.imageLeft ? "flex-row" : "flex-row-reverse"
        )}
      >
        {/* Image container with improved styling */}
        <div className="w-full md:w-2/5 relative overflow-hidden rounded-xl shadow-lg aspect-square transition-transform duration-300 hover:scale-102 group">
          <Image
            src={editedSection.imageUrl || "/api/placeholder/400/400"}
            alt={editedSection.title || "Section image"}
            fill
            className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content container */}
        <div className="flex-1 w-full md:w-3/5 overflow-hidden">
          {isEditing ? editingSection : contentSection}

          {/* Action buttons with improved styling */}
          <div className="mt-6 px-2 md:px-6">
            {isEditing ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="border-2"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
              </div>
            ) : (
              isAdmin && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 transition-all duration-200"
                >
                  <Pencil className="w-4 h-4 mr-2" /> Edit
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
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    try {
      setIsAdding(true);
      await onAdd();
    } catch (error) {
      console.error("Error adding section:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 overflow-hidden">
      <div className="space-y-12">
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
          <div className="text-center py-16 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-lg">No sections found.</p>
            {isAdmin && <p className="text-sm mt-2">Click "Add New Section" to create one.</p>}
          </div>
        )}

        <div className="flex justify-center md:justify-end mt-8">
          {isAdmin && (
            <Button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-6 h-auto rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Adding...
                </>
              ) : (
                "Add New Section"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
