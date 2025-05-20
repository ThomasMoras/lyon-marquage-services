import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CarouselSlide } from "@/types";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselSlideComponent } from "./CarouselSlideComponent";

interface CarouselDisplayProps {
  slides: CarouselSlide[];
  isAdmin: boolean;
  onEditClick: () => void;
}

export const CarouselDisplay = ({ slides, isAdmin, onEditClick }: CarouselDisplayProps) => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="relative h-screen">
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

      {isAdmin && (
        <Button
          onClick={onEditClick}
          className="absolute bottom-8 right-8 z-30 rounded-full w-12 h-12 shadow-lg hover:scale-105 transition-transform duration-200"
          variant="outline"
        >
          <Pencil className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};
