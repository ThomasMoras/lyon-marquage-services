"use client";

import { useState } from "react";
import Image from "next/image";
import { CardDisplayProps } from "@/types/card";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Trash2 } from "lucide-react";

export function CardDisplay({
  editedCard,
  toggleExpand,
  isAdmin,
  setIsEditing,
  handleDelete,
}: CardDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Determine if we have title or description to show
  const hasTitle = !!editedCard.title?.trim();
  const hasDescription = !!editedCard.description?.trim();
  const hasContent = hasTitle || hasDescription;

  // Set aspect ratio based on content presence
  const aspectRatio = hasContent ? "aspect-[4/3]" : "aspect-square";

  return (
    <div
      className="relative group rounded-lg overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={toggleExpand}
    >
      {/* Card container with dynamic sizing */}
      <div
        className={`w-full relative ${hasContent ? "flex-1" : "h-full"} rounded-lg overflow-hidden`}
      >
        {/* Title overlay at the top */}
        {hasTitle && (
          <div className="absolute top-0 inset-x-0 z-10 bg-gradient-to-b from-black/60 to-transparent pt-2 pb-4 px-3">
            <h3 className="font-semibold text-sm text-white text-center drop-shadow-md line-clamp-2">
              {editedCard.title}
            </h3>
          </div>
        )}

        {/* Image with crop transformations */}
        <div className={`relative w-full ${aspectRatio} overflow-hidden`}>
          <Image
            src={editedCard.imageUrl || "/api/placeholder/400/300"}
            alt={editedCard.title || "Card image"}
            fill
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
            style={{
              transform: `scale(${editedCard.cropData?.scale || 1}) translate(${editedCard.cropData?.position?.x || 0}px, ${editedCard.cropData?.position?.y || 0}px) rotate(${editedCard.cropData?.rotation || 0}deg)`,
              transformOrigin: "center",
            }}
            onLoadingComplete={() => setIsLoading(false)}
          />

          {/* Loading placeholder */}
          {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
        </div>
      </div>

      {/* Description below the image */}
      {hasDescription && (
        <div className="px-3 py-2 bg-white dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 text-center">
            {editedCard.description}
          </p>
        </div>
      )}

      {/* Admin controls - only shown in admin mode */}
      {isAdmin && setIsEditing && handleDelete && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 hover:bg-white rounded-full h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>

          {/* Delete button/confirmation */}
          {isConfirmingDelete ? (
            <>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 hover:bg-white rounded-full h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 rounded-full h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirmingDelete(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CardDisplay;
