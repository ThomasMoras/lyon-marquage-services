import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { CarouselSlide, CropData } from "@/types";
import { SectionType } from "@prisma/client";
import { SlideEditForm } from "./SlideEditForm";
import { CarouselPagination } from "./CarouselPagination";

interface SlideEditorProps {
  pageSection: SectionType;
  currentPage: number;
  totalPages: number;
  paginatedSlides: CarouselSlide[];
  slidesPerPage: number;
  onPageChange: (page: number) => void;
  onFieldChange: (index: number, field: keyof CarouselSlide, value: string) => void;
  onImageSelection: (index: number, imagePath: string, cropData: CropData) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string) => void;
  onClose: () => void;
}

export const SlideEditor = ({
  pageSection,
  currentPage,
  totalPages,
  paginatedSlides,
  slidesPerPage,
  onPageChange,
  onFieldChange,
  onImageSelection,
  onAddSlide,
  onDeleteSlide,
  onClose,
}: SlideEditorProps) => {
  const editMenuRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Bouton de fermeture positionné en dehors du modal */}
      <Button
        onClick={onClose}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-[60] rounded-full w-10 h-10 bg-white dark:bg-gray-800 shadow-lg border-2"
      >
        <X className="w-5 h-5" />
      </Button>

      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-4 pb-4 bg-black/40 backdrop-blur-sm">
        <div
          ref={editMenuRef}
          className="max-w-4xl w-full p-6 space-y-5 bg-white dark:bg-gray-900 my-4 rounded-xl shadow-2xl animate-in fade-in-100 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                Modification Carousel
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Personnalisez les slides du carrousel
              </p>
            </div>
            <div className="flex flex-row justify-center text-center">
              <Button
                onClick={onAddSlide}
                className="bg-green-600 hover:bg-green-700 text-white hover:text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une slide
              </Button>
            </div>
          </div>

          {/* Content */}
          {paginatedSlides.map((slide, localIndex) => {
            const globalIndex = (currentPage - 1) * slidesPerPage + localIndex;

            return (
              <SlideEditForm
                key={slide.id}
                slide={slide}
                index={globalIndex}
                onFieldChange={onFieldChange}
                onImageSelection={onImageSelection}
                onDelete={onDeleteSlide}
                pageSection={pageSection}
              />
            );
          })}

          {/* Pagination */}
          <CarouselPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};
