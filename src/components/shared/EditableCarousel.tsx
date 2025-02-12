"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { ImageSelector } from "./ImageSelector";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

const CarouselSlide = ({ slide }: { slide: CarouselSlide }) => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 flex items-center bg-gradient-to-t from-black/50">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white">{slide.title}</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{slide.description}</p>
          <Button size="lg" className="btn-carousel" asChild>
            <Link href={slide.buttonLink} scroll>
              {slide.buttonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function EditableCarousel({ pageSection }: PageSections) {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const slidesPerPage = 2;
  const { toast } = useToast();

  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const editMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editMenuRef.current &&
        !editMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[role="dialog"]')
      ) {
        setIsEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch(`/api/carousel?type=${pageSection}`)
      .then((res) => res.json())
      .then((data) =>
        setSlides(data.sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order))
      );
  }, [pageSection]);

  const paginatedSlides = () => {
    const startIndex = (currentPage - 1) * slidesPerPage;
    const endIndex = startIndex + slidesPerPage;
    return slides.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(slides.length / slidesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleFieldChange = (index: number, field: keyof CarouselSlide, value: string) => {
    const newSlides = [...slides];
    const updatedSlide = { ...newSlides[index], [field]: value };
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
    handleSaveSlide(updatedSlide);
  };

  const handleSaveSlide = async (slide: CarouselSlide) => {
    try {
      await fetch("/api/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slide),
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleAddSlide = async () => {
    const maxOrder = slides.length > 0 ? Math.max(...slides.map((slide) => slide.order)) : -1;
    const sectionType = pageSection.toUpperCase() as CarouselSlide["type"];
    const newSlide: Omit<CarouselSlide, "id"> = {
      title: "Nouveau titre",
      description: "Nouvelle description",
      image: "/images/placeholder.jpg",
      buttonText: "En savoir plus",
      buttonLink: "#",
      order: maxOrder + 1,
      type: sectionType,
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
        {isEditing && (
          <div className="absolute inset-0 z-30 overflow-y-auto flex items-center justify-center mt-8">
            <div ref={editMenuRef} className="max-w-3xl w-full p-6 space-y-4 bg-white my-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Modification Carousel</h3>
                <div className="flex flex-row justify-center text-center gap-2">
                  <Button
                    onClick={handleAddSlide}
                    variant="outline"
                    className="bg-green-500 hover:bg-green-400 text-white hover:text-white"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une slide
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              {paginatedSlides().map((slide, localIndex) => {
                const globalIndex = (currentPage - 1) * slidesPerPage + localIndex;

                return (
                  <div key={slide.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Slide {globalIndex + 1}</h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="hover:bg-red-400" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette slide ? Cette action est
                              irréversible.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => {}}>
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

                    <div className="space-y-3">
                      <Input
                        value={slide.title}
                        onChange={(e) => handleFieldChange(globalIndex, "title", e.target.value)}
                        placeholder="Title"
                      />
                      <Textarea
                        value={slide.description}
                        onChange={(e) =>
                          handleFieldChange(globalIndex, "description", e.target.value)
                        }
                        placeholder="Description"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          value={slide.buttonText}
                          onChange={(e) =>
                            handleFieldChange(globalIndex, "buttonText", e.target.value)
                          }
                          placeholder="Button Text"
                        />
                        <Input
                          value={slide.buttonLink}
                          onChange={(e) =>
                            handleFieldChange(globalIndex, "buttonLink", e.target.value)
                          }
                          placeholder="Button Link"
                        />
                      </div>
                      <ImageSelector
                        folder={`images/${pageSection}`}
                        currentImage={slide.image}
                        onSelect={(imagePath) => {
                          handleFieldChange(globalIndex, "image", imagePath);
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Footer */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </Button>

                  {pageNumbers.map((number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </div>
          </div>
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
                <CarouselSlide slide={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            <CarouselPrevious
              variant="default"
              className={cn(
                "relative translate-y-0 left-0 mr-2 bg-background/80 hover:bg-background/90",
                "border-white text-white hover:text-white  bg-blue-400 hover:bg-blue-300"
              )}
            />
            <CarouselNext
              variant="default"
              className={cn(
                "relative translate-y-0 right-0 bg-background/80 hover:bg-background/90",
                "border-white text-white hover:text-white bg-blue-400 hover:bg-blue-300"
              )}
            />
          </div>
        </Carousel>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute bottom-4 right-4 z-30"
          variant="outline"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
