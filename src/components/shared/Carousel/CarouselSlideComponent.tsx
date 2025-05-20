import React, { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarouselSlide } from "@/types";

export const CarouselSlideComponent = ({ slide }: { slide: CarouselSlide }) => {
  // Generate a unique ID for this slide's keyframes
  const animationId = useMemo(
    () => `zoom-${slide.id || Math.random().toString(36).substring(2, 9)}`,
    [slide.id]
  );

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
