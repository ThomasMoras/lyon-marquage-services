import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CarouselSlide, CropData } from "@/types";
import { AutoResizeTextarea } from "../AutoResizeTextarea";
import { EnhancedImageSelector } from "../EnhancedImageSelector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { SectionType } from "@prisma/client";

interface SlideEditFormProps {
  slide: CarouselSlide;
  index: number;
  onFieldChange: (index: number, field: keyof CarouselSlide, value: string) => void;
  onImageSelection: (index: number, imagePath: string, cropData: CropData) => void;
  onDelete: (slideId: string) => void;
  pageSection: SectionType;
}

export const SlideEditForm = ({
  slide,
  index,
  onFieldChange,
  onImageSelection,
  onDelete,
  pageSection,
}: SlideEditFormProps) => {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-50">Slide {index + 1}</h4>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="hover:bg-red-600">
              <Trash2 className="w-4 h-4 mr-2" /> Supprimer
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cette slide ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}} className="border-2">
                Annuler
              </Button>
              <Button variant="destructive" onClick={() => onDelete(slide.id)}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Titre
          </label>
          <AutoResizeTextarea
            id="title"
            value={slide.title}
            onChange={(e) => onFieldChange(index, "title", e.target.value)}
            placeholder="Titre de la slide (Pressez Entrée pour les sauts de ligne)"
            minHeight={60}
            className="border-2 focus-visible:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Utilisez la touche Entrée pour créer des sauts de ligne
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Description
          </label>
          <AutoResizeTextarea
            id="description"
            value={slide.description}
            onChange={(e) => onFieldChange(index, "description", e.target.value)}
            placeholder="Description de la slide (Pressez Entrée pour les sauts de ligne)"
            minHeight={120}
            className="border-2 focus-visible:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Utilisez la touche Entrée pour créer des sauts de ligne
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Bouton
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="button-text"
                value={slide.buttonText}
                onChange={(e) => onFieldChange(index, "buttonText", e.target.value)}
                placeholder="Texte du bouton"
                className="border-2 focus-visible:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Texte affiché</p>
            </div>
            <div>
              <Input
                id="button-link"
                value={slide.buttonLink}
                onChange={(e) => onFieldChange(index, "buttonLink", e.target.value)}
                placeholder="Lien du bouton"
                className="border-2 focus-visible:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">URL de destination</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Image d&ldquo;arrière-plan
          </label>

          <EnhancedImageSelector
            folder={`images/${pageSection}`}
            currentImage={slide.image}
            currentCropData={slide.cropData}
            onSelect={(imagePath, cropData) => {
              onImageSelection(index, imagePath, cropData);
            }}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
