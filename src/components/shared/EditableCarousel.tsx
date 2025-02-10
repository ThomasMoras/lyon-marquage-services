"use client";
import React, { useState, useEffect } from "react";
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
import { UploadFile } from "./UploadFile";
import { ImageSelector } from "./ImageSelector";

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface EditableCarouselProps {
  section: "home" | "broderie";
}

const CarouselSlide = ({ slide }: { slide: CarouselSlide }) => {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
      </div>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-8 z-10",
          "bg-gradient-to-t from-black/50 via-transparent to-transparent"
        )}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6 mt-20">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white drop-shadow-md">
            {slide.title}
          </h2>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed text-white/90 drop-shadow">
            {slide.description}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="mt-8 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black transition-all"
            asChild
          >
            <a href={slide.buttonLink}>{slide.buttonText}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function EditableCarousel({ section }: EditableCarouselProps) {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  useEffect(() => {
    fetch(`/api/carousel?type=${section}`)
      .then((res) => res.json())
      .then(setSlides);
  }, [section]);

  const handleEdit = async (updatedSlide: CarouselSlide) => {
    try {
      await fetch("/api/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlide),
      });
      const response = await fetch(`/api/carousel?type=${section}`);
      const updatedSlides = await response.json();
      setSlides(updatedSlides);
    } catch (error) {
      console.error("Error updating slide:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="relative h-screen">
        {isEditing && (
          <div className="absolute inset-0 z-30 overflow-y-auto flex items-center justify-center">
            <div className="max-w-3xl w-full p-6 space-y-4 bg-white my-8">
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
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[index] = { ...slide, title: e.target.value };
                        setSlides(newSlides);
                      }}
                      placeholder="Title"
                    />
                    <Textarea
                      value={slide.description}
                      onChange={(e) => {
                        const newSlides = [...slides];
                        newSlides[index] = { ...slide, description: e.target.value };
                        setSlides(newSlides);
                      }}
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={slide.buttonText}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = { ...slide, buttonText: e.target.value };
                          setSlides(newSlides);
                        }}
                        placeholder="Button Text"
                      />
                      <Input
                        value={slide.buttonLink}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[index] = { ...slide, buttonLink: e.target.value };
                          setSlides(newSlides);
                        }}
                        placeholder="Button Link"
                      />
                    </div>
                    <ImageSelector
                      folder={`images/${section}`}
                      currentImage={slide.image}
                      onSelect={(imagePath) => {
                        const newSlides = [...slides];
                        newSlides[index] = { ...slide, image: imagePath };
                        setSlides(newSlides);
                      }}
                    />
                    {/* <div className="flex justify-end mt-3">
                      <Button
                        className=" bg-green-600 hover:bg-green-500"
                        onClick={() => handleEdit(slide)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div> */}
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
              variant="outline"
              className={cn(
                "relative translate-y-0 left-0 mr-2 bg-background/80 hover:bg-background/90",
                "border-white text-white hover:text-white"
              )}
            />
            <CarouselNext
              variant="outline"
              className={cn(
                "relative translate-y-0 right-0 bg-background/80 hover:bg-background/90",
                "border-white text-white hover:text-white"
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
