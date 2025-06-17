// components/carousel/SlideReorderModal.tsx
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { X, Save, RotateCcw } from "lucide-react";
import { CarouselSlide } from "@/types";
import { DraggableSlideCard } from "./DraggableSlideCard";

interface SlideReorderModalProps {
  slides: CarouselSlide[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (reorderedSlides: CarouselSlide[]) => void;
  onEditSlide: (slide: CarouselSlide) => void;
  onDeleteSlide: (slideId: string) => void;
}

export const SlideReorderModal = ({
  slides,
  isOpen,
  onClose,
  onSave,
  onEditSlide,
  onDeleteSlide,
}: SlideReorderModalProps) => {
  const [localSlides, setLocalSlides] = useState<CarouselSlide[]>(slides);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced from 8 to 3 for faster activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setLocalSlides((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  };

  const handleSave = () => {
    // Update order property for each slide
    const updatedSlides = localSlides.map((slide, index) => ({
      ...slide,
      order: index + 1,
    }));

    onSave(updatedSlides);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setLocalSlides(slides);
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir fermer ?"
      );
      if (!confirmClose) return;
    }
    setLocalSlides(slides);
    setHasChanges(false);
    onClose();
  };

  // Update local slides when props change
  React.useEffect(() => {
    setLocalSlides(slides);
    setHasChanges(false);
  }, [slides]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-6xl p-6 my-8 text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                Réorganiser les slides
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Glissez et déposez pour réorganiser l&apos;ordre des slides
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mt-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localSlides.map((slide) => slide.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-2">
                  {localSlides.map((slide, index) => (
                    <DraggableSlideCard
                      key={slide.id}
                      slide={slide}
                      index={index}
                      onEdit={onEditSlide}
                      onDelete={onDeleteSlide}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {localSlides.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Aucune slide à réorganiser</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  • Modifications non sauvegardées
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasChanges}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="bg-blue-600 hover:bg-blue-700 gap-2"
              >
                <Save className="w-4 h-4" />
                Sauvegarder l&apos;ordre
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
