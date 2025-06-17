// components/carousel/DraggableSlideCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarouselSlide } from "@/types";
import Image from "next/image";

interface DraggableSlideCardProps {
  slide: CarouselSlide;
  index: number;
  onEdit: (slide: CarouselSlide) => void;
  onDelete: (slideId: string) => void;
}

export const DraggableSlideCard = ({ slide, index, onEdit, onDelete }: DraggableSlideCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition, // Remove transition while dragging for instant movement
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg border-2 
        ${
          isDragging
            ? "border-blue-500 shadow-2xl scale-105 z-50 rotate-2"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
        }
        transition-all duration-100 cursor-grab active:cursor-grabbing
      `}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-2 z-10 p-1 rounded bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Slide Number Badge */}
      <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
        {index + 1}
      </div>

      {/* Image Preview */}
      <div
        {...attributes}
        {...listeners}
        className="relative h-32 w-full overflow-hidden rounded-t-lg"
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
          {slide.title || "Titre non défini"}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
          {slide.description || "Description non définie"}
        </p>

        {slide.showButtons && slide.buttonText && (
          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            {slide.buttonText}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="secondary" size="sm" className="h-7 w-7 p-0" onClick={() => onEdit(slide)}>
          <Edit3 className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onDelete(slide.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Dragging Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 rounded-lg border-2 border-dashed border-blue-500" />
      )}
    </div>
  );
};
