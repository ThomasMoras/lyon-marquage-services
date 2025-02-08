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
import { Pencil, Check, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

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

const CarouselSlide = ({
  slide,
  isEditing,
  onEdit,
}: {
  slide: CarouselSlide;
  isEditing: boolean;
  onEdit: (updated: CarouselSlide) => void;
}) => {
  const [editedSlide, setEditedSlide] = useState(slide);

  if (isEditing) {
    return (
      <div className="relative w-full h-screen p-8">
        <div className="max-w-4xl mx-auto space-y-4 bg-background/80 p-6 rounded-lg">
          <Input
            value={editedSlide.title}
            onChange={(e) => setEditedSlide({ ...editedSlide, title: e.target.value })}
            placeholder="Title"
          />
          <Textarea
            value={editedSlide.description}
            onChange={(e) => setEditedSlide({ ...editedSlide, description: e.target.value })}
            placeholder="Description"
          />
          <Input
            value={editedSlide.buttonText}
            onChange={(e) => setEditedSlide({ ...editedSlide, buttonText: e.target.value })}
            placeholder="Button Text"
          />
          <Input
            value={editedSlide.buttonLink}
            onChange={(e) => setEditedSlide({ ...editedSlide, buttonLink: e.target.value })}
            placeholder="Button Link"
          />
          <Input
            value={editedSlide.image}
            onChange={(e) => setEditedSlide({ ...editedSlide, image: e.target.value })}
            placeholder="Image URL"
          />
          <Button onClick={() => onEdit(editedSlide)}>Save</Button>
        </div>
      </div>
    );
  }

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
    await fetch("/api/carousel", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSlide),
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full overflow-hidden relative">
      <Button
        onClick={() => setIsEditing(!isEditing)}
        className="absolute top-4 right-4 z-30"
        variant="outline"
      >
        {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
      </Button>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="basis-full">
              <CarouselSlide slide={slide} isEditing={isEditing} onEdit={handleEdit} />
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
    </div>
  );
}
