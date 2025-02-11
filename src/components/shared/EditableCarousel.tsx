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
import { Pencil, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { ImageSelector } from "./ImageSelector";
import Link from "next/link";

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

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
      .then(setSlides);
  }, [pageSection]);

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

  return (
    <div className="w-full">
      <div className="relative h-screen">
        {isEditing && (
          <div className="absolute inset-0 z-30 overflow-y-auto flex items-center justify-center">
            <div ref={editMenuRef} className="max-w-3xl w-full p-6 space-y-4 bg-white my-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Edit Carousel</h3>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {slides.map((slide, index) => (
                <div key={slide.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Slide {index + 1}</h4>
                  <div className="space-y-3">
                    <Input
                      value={slide.title}
                      onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                      placeholder="Title"
                    />
                    <Textarea
                      value={slide.description}
                      onChange={(e) => handleFieldChange(index, "description", e.target.value)}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={slide.buttonText}
                        onChange={(e) => handleFieldChange(index, "buttonText", e.target.value)}
                        placeholder="Button Text"
                      />
                      <Input
                        value={slide.buttonLink}
                        onChange={(e) => handleFieldChange(index, "buttonLink", e.target.value)}
                        placeholder="Button Link"
                      />
                    </div>
                    <ImageSelector
                      folder={`images/${pageSection}`}
                      currentImage={slide.image}
                      onSelect={(imagePath) => {
                        handleFieldChange(index, "image", imagePath);
                      }}
                    />
                  </div>
                </div>
              ))}
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
