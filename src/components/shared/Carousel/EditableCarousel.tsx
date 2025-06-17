"use client";

import React, { useState } from "react";
import { CarouselDisplay } from "./CarouselDisplay";
import { SectionType } from "@prisma/client";
import { SlideEditor } from "./SlideEditor";
import { useCarouselData } from "@/hooks/useCarouselData";

interface EditableCarouselProps {
  pageSection: SectionType;
  isAdmin?: boolean;
}

export default function EditableCarousel({ pageSection, isAdmin = false }: EditableCarouselProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const slidesPerPage = 1;

  const {
    slides,
    isLoading,
    handleFieldChange,
    handleImageSelection,
    handleAddSlide,
    handleDeleteSlide,
    handleReorderSlides,
  } = useCarouselData(pageSection);

  // Handle adding a slide and update pagination
  const handleAddSlideAndUpdatePage = async () => {
    const newSlidesCount = await handleAddSlide();
    const newTotalPages = Math.ceil(newSlidesCount / slidesPerPage);
    setCurrentPage(newTotalPages);
  };

  // Handle deleting a slide and update pagination
  const handleDeleteSlideAndUpdatePage = async (slideId: string) => {
    const newSlidesCount = await handleDeleteSlide(slideId);
    const newTotalPages = Math.ceil(newSlidesCount / slidesPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Calculate paginated slides
  const paginatedSlides = () => {
    const startIndex = (currentPage - 1) * slidesPerPage;
    const endIndex = startIndex + slidesPerPage;
    return slides.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(slides.length / slidesPerPage);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="w-full">
      {isEditing && isAdmin && (
        <SlideEditor
          pageSection={pageSection}
          currentPage={currentPage}
          totalPages={totalPages}
          paginatedSlides={paginatedSlides()}
          slidesPerPage={slidesPerPage}
          onPageChange={setCurrentPage}
          onFieldChange={handleFieldChange}
          onImageSelection={handleImageSelection}
          onAddSlide={handleAddSlideAndUpdatePage}
          onDeleteSlide={handleDeleteSlideAndUpdatePage}
          onClose={() => setIsEditing(false)}
          onReorderSlides={handleReorderSlides}
          allSlides={slides}
        />
      )}

      <CarouselDisplay slides={slides} isAdmin={isAdmin} onEditClick={() => setIsEditing(true)} />
    </div>
  );
}
