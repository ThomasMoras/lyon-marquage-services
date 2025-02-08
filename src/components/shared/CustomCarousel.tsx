"use client";
import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

const carouselData = {
  home: [
    {
      id: 1,
      image: "/images/t_1.jpg",
      title: "Titre 1",
      description: "Description 1",
      buttonText: "En savoir plus",
      buttonLink: "/service1",
    },
    // Add more home slides
  ],
  broderie: [
    {
      id: 1,
      image: "/images/broderie_1.jpg",
      title: "Broderie Artisanale",
      description: "Découvrez nos créations uniques",
      buttonText: "Explorer",
      buttonLink: "/collections",
    },
    // Add more broderie slides
  ],
};

const CarouselSlide = ({ slide }) => {
  return (
    <div className="embla__slide relative w-full h-screen">
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

interface CustomCarouselProps {
  section: "home" | "broderie";
}

export default function CustomCarousel({ section }: CustomCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const slides = carouselData[section];

  return (
    <div className="w-full overflow-hidden">
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
    </div>
  );
}
