import { useState, useEffect } from "react";
import { CarouselSlide, CropData } from "@/types";
import { SectionType } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

export const useCarouselData = (pageSection: SectionType) => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch slides data
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/carousel?type=${pageSection}`);
        if (!response.ok) throw new Error("Failed to fetch slides");

        const data = await response.json();
        setSlides(data.sort((a: CarouselSlide, b: CarouselSlide) => a.order - b.order));
      } catch (err) {
        console.error("Error fetching slides:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du carousel",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, [pageSection, toast]);

  // Generic field change handler for simple text fields
  const handleFieldChange = async (
    index: number,
    field: keyof CarouselSlide,
    value: string | boolean
  ) => {
    const newSlides = [...slides];
    const updatedSlide = { ...newSlides[index], [field]: value };
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
    await handleSaveSlide(updatedSlide);
  };

  // Specific handler for image selection that handles both image URL and crop data
  const handleImageSelection = async (index: number, imagePath: string, cropData: CropData) => {
    const newSlides = [...slides];
    const updatedSlide = {
      ...newSlides[index],
      image: imagePath,
      cropData: cropData,
    };

    newSlides[index] = updatedSlide;
    setSlides(newSlides);
    await handleSaveSlide(updatedSlide);
  };

  const handleSaveSlide = async (slide: CarouselSlide) => {
    try {
      const response = await fetch("/api/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slide),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save slide");
      }
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
      showButtons: true,
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
      setSlides(updatedSlides);

      toast({
        title: "Succès",
        description: "La slide a été ajoutée avec succès.",
      });

      return updatedSlides.length; // Return the new number of slides
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du slide.",
        variant: "destructive",
      });
      console.error("Error adding slide:", error);
      return slides.length; // Return current length if error
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
      setSlides(updatedSlides);

      toast({
        title: "Succès",
        description: "La slide a été supprimée avec succès.",
      });

      return updatedSlides.length; // Return the new number of slides
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du slide.",
        variant: "destructive",
      });
      console.error("Error deleting slide:", error);
      return slides.length; // Return current length if error
    }
  };

  return {
    slides,
    isLoading,
    handleFieldChange,
    handleImageSelection,
    handleAddSlide,
    handleDeleteSlide,
  };
};
