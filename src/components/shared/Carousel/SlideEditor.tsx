import React, { useRef, useState } from "react"; // ADD useState import
import { Button } from "@/components/ui/button";
import { X, Plus, ArrowUpDown } from "lucide-react"; // ADD ArrowUpDown import
import { CarouselSlide, CropData } from "@/types";
import { SectionType } from "@prisma/client";
import { SlideEditForm } from "./SlideEditForm";
import { CarouselPagination } from "./CarouselPagination";
import { SlideReorderModal } from "./SlideReorderModal";

interface SlideEditorProps {
  pageSection: SectionType;
  currentPage: number;
  totalPages: number;
  paginatedSlides: CarouselSlide[];
  slidesPerPage: number;
  allSlides: CarouselSlide[]; // ADD this prop
  onPageChange: (page: number) => void;
  onFieldChange: (index: number, field: keyof CarouselSlide, value: string | boolean) => void;
  onImageSelection: (index: number, imagePath: string, cropData: CropData) => void;
  onAddSlide: () => void;
  onDeleteSlide: (slideId: string) => void;
  onReorderSlides: (reorderedSlides: CarouselSlide[]) => void; // ADD this prop
  onClose: () => void;
}

export const SlideEditor = ({
  pageSection,
  currentPage,
  totalPages,
  paginatedSlides,
  slidesPerPage,
  allSlides, // ADD this
  onPageChange,
  onFieldChange,
  onImageSelection,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides, // ADD this
  onClose,
}: SlideEditorProps) => {
  const editMenuRef = useRef<HTMLDivElement>(null);
  const [showReorderModal, setShowReorderModal] = useState(false);

  const handleEditSlide = (slide: CarouselSlide) => {
    // Find the page that contains this slide and navigate to it
    const slideIndex = allSlides.findIndex((s) => s.id === slide.id);
    const targetPage = Math.floor(slideIndex / slidesPerPage) + 1;
    onPageChange(targetPage);
    setShowReorderModal(false);
  };

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
            {/* REPLACE the existing button div with this */}
            <div className="flex flex-row gap-2 justify-center text-center">
              <Button
                onClick={() => setShowReorderModal(true)}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={allSlides.length <= 1}
              >
                <ArrowUpDown className="w-4 h-4" />
                Réorganiser
              </Button>
              <Button
                onClick={onAddSlide}
                className="bg-green-600 hover:bg-green-700 text-white hover:text-white gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Content - NO CHANGES */}
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

          {/* Pagination - NO CHANGES */}
          <CarouselPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* ADD this new component at the end */}
      <SlideReorderModal
        slides={allSlides}
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        onSave={onReorderSlides}
        onEditSlide={handleEditSlide}
        onDeleteSlide={onDeleteSlide}
      />
    </>
  );
};
