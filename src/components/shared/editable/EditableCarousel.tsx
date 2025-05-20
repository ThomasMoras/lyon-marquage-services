"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CarouselSlide, CropData } from "@/types";
import { AutoResizeTextarea } from "../AutoResizeTextarea";
import { SectionType } from "@prisma/client";
import { EnhancedImageSelector } from "../EnhancedImageSelector";

// Mise à jour pour utiliser SectionType de Prisma
interface EditableCarouselProps {
  pageSection: SectionType;
  isAdmin?: boolean;
}

const CarouselSlideComponent = ({ slide }: { slide: CarouselSlide }) => {
  // Generate a unique ID for this slide's keyframes
  const animationId = useMemo(() => `zoom-${Math.random().toString(36).substr(2, 9)}`, []);

  // Get crop values with fallbacks
  const scale = slide.cropData?.scale || 1;
  const translateX = slide.cropData?.position?.x || 0;
  const translateY = slide.cropData?.position?.y || 0;
  const rotation = slide.cropData?.rotation || 0;

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-full h-full">
          <style jsx>{`
            @keyframes ${animationId} {
              0% {
                transform: scale(${scale}) translate(${translateX}px, ${translateY}px)
                  rotate(${rotation}deg);
              }
              100% {
                transform: scale(${scale * 1.1}) translate(${translateX}px, ${translateY}px)
                  rotate(${rotation}deg);
              }
            }
          `}</style>

          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              animation: `${animationId} 10s infinite alternate ease-in-out`,
            }}
          />
        </div>
      </div>

      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12 overflow-hidden">
            {slide.title && (
              <div className="relative">
                <h2 className="text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-ellipsis break-words drop-shadow-lg whitespace-pre-line">
                  {slide.title}
                </h2>
                <div className="h-1 w-24 bg-blue-500 mx-auto mt-6 rounded-full"></div>
              </div>
            )}
            {slide.description && (
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed text-ellipsis break-words drop-shadow-md whitespace-pre-line">
                {slide.description}
              </p>
            )}

            <Button
              size="lg"
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 h-auto rounded-3xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href={slide.buttonLink} scroll>
                {slide.buttonText}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EditableCarousel({ pageSection, isAdmin = false }: EditableCarouselProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const slidesPerPage = 1;
  const { toast } = useToast();

  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const editMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/carousel?type=${pageSection}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched slides:", data);
        setSlides(data.sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order));
      })
      .catch((err) => console.error("Error fetching slides:", err));
  }, [pageSection]);

  const paginatedSlides = () => {
    const startIndex = (currentPage - 1) * slidesPerPage;
    const endIndex = startIndex + slidesPerPage;
    return slides.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(slides.length / slidesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Generic field change handler for simple text fields
  const handleFieldChange = (index: number, field: keyof CarouselSlide, value: string) => {
    const newSlides = [...slides];
    const updatedSlide = { ...newSlides[index], [field]: value };
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
    handleSaveSlide(updatedSlide);
  };

  // Specific handler for image selection that handles both image URL and crop data
  const handleImageSelection = (index: number, imagePath: string, cropData: CropData) => {
    console.log("handleImageSelection called with:", { index, imagePath, cropData });

    const newSlides = [...slides];
    const updatedSlide = {
      ...newSlides[index],
      image: imagePath,
      cropData: cropData,
    };

    console.log("Updated slide:", updatedSlide);
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
    handleSaveSlide(updatedSlide);
  };

  const handleSaveSlide = async (slide: CarouselSlide) => {
    try {
      console.log("Saving slide:", slide);
      const response = await fetch("/api/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slide),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save slide");
      }

      const savedData = await response.json();
      console.log("Slide saved successfully:", savedData);
    } catch (error) {
      console.error("Error saving slide:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  const handleAddSlide = async () => {
    const maxOrder = slides.length > 0 ? Math.max(...slides.map((slide) => slide.order)) : -1;
    const newSlide: Omit<CarouselSlide, "id"> = {
      title: "Nouveau titre",
      description: "Nouvelle description",
      image: "/images/placeholder.jpg",
      buttonText: "En savoir plus",
      buttonLink: "#",
      order: maxOrder + 1,
      type: pageSection,
      cropData: {
        scale: 1,
        position: { x: 0, y: 0 },
        rotation: 0,
      },
    };

    try {
      const response = await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSlide, type: pageSection }),
      });

      if (!response.ok) throw new Error("Failed to add slide");

      const updatedResponse = await fetch(`/api/carousel?type=${pageSection}`);
      const updatedSlides = await updatedResponse.json();

      const newTotalPages = Math.ceil(updatedSlides.length / slidesPerPage);
      setCurrentPage(newTotalPages);

      setSlides(updatedSlides);

      toast({
        title: "Succès",
        description: "La slide a été ajoutée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du slide.",
        variant: "destructive",
      });
      console.error("Error adding slide:", error);
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    try {
      const response = await fetch(`/api/carousel/${slideId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete slide");

      const updatedResponse = await fetch(`/api/carousel?type=${pageSection}`);
      const updatedSlides = await updatedResponse.json();

      const newTotalPages = Math.ceil(updatedSlides.length / slidesPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      setSlides(updatedSlides);

      toast({
        title: "Succès",
        description: "La slide a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du slide.",
        variant: "destructive",
      });
      console.error("Error deleting slide:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="relative h-screen">
        {isEditing && isAdmin && (
          <>
            {/* Bouton de fermeture positionné en dehors du modal */}
            <Button
              onClick={() => setIsEditing(false)}
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
                      onClick={handleAddSlide}
                      className="bg-green-600 hover:bg-green-700 text-white hover:text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter une slide
                    </Button>
                  </div>
                </div>
                {/* Content */}
                {paginatedSlides().map((slide, localIndex) => {
                  const globalIndex = (currentPage - 1) * slidesPerPage + localIndex;

                  return (
                    <div
                      key={slide.id}
                      className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-50">
                          Slide {globalIndex + 1}
                        </h4>
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
                                Êtes-vous sûr de vouloir supprimer cette slide ? Cette action est
                                irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {}} className="border-2">
                                Annuler
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteSlide(slide.id)}
                              >
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
                            onChange={(e) =>
                              handleFieldChange(globalIndex, "title", e.target.value)
                            }
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
                            onChange={(e) =>
                              handleFieldChange(globalIndex, "description", e.target.value)
                            }
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
                                onChange={(e) =>
                                  handleFieldChange(globalIndex, "buttonText", e.target.value)
                                }
                                placeholder="Texte du bouton"
                                className="border-2 focus-visible:ring-blue-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">Texte affiché</p>
                            </div>
                            <div>
                              <Input
                                id="button-link"
                                value={slide.buttonLink}
                                onChange={(e) =>
                                  handleFieldChange(globalIndex, "buttonLink", e.target.value)
                                }
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
                              // Use the specialized handler for image selection
                              handleImageSelection(globalIndex, imagePath, cropData);
                            }}
                            disabled={false}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Enhanced pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-2"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
                    </Button>

                    <div className="flex gap-1">
                      {pageNumbers.map((number) => (
                        <Button
                          key={number}
                          variant={currentPage === number ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(number)}
                          className={
                            currentPage === number ? "bg-blue-600 hover:bg-blue-700" : "border-2"
                          }
                        >
                          {number}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="border-2"
                    >
                      Suivant <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          className="w-full h-full"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="basis-full">
                <CarouselSlideComponent slide={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Boutons de navigation sans bordures blanches */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
            <CarouselPrevious
              variant="default"
              className={cn(
                "relative translate-y-0 left-0 mr-2 rounded-full w-12 h-12",
                "border-0 text-white hover:text-white bg-blue-500/80 hover:bg-blue-600/90",
                "shadow-lg transition-all duration-200"
              )}
            />
            <CarouselNext
              variant="default"
              className={cn(
                "relative translate-y-0 right-0 rounded-full w-12 h-12",
                "border-0 text-white hover:text-white bg-blue-500/80 hover:bg-blue-600/90",
                "shadow-lg transition-all duration-200"
              )}
            />
          </div>
        </Carousel>

        {/* Enhanced edit button */}
        {isAdmin && (
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-8 right-8 z-30 rounded-full w-12 h-12 shadow-lg hover:scale-105 transition-transform duration-200"
            variant="outline"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
