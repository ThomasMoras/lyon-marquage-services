import React, { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarouselSlide, ContentPosition } from "@/types";
import { CAROUSEL_CONTENT, CAROUSEL_TYPOGRAPHY } from "@/constants/carousel";

export const CarouselSlideComponent = ({ slide }: { slide: CarouselSlide }) => {
  const animationId = useMemo(
    () => `zoom-${slide.id || Math.random().toString(36).substring(2, 9)}`,
    [slide.id]
  );

  const scale = slide.cropData?.scale || 1;
  const translateX = slide.cropData?.position?.x || 0;
  const translateY = slide.cropData?.position?.y || 0;
  const rotation = slide.cropData?.rotation || 0;

  // Get positioning classes based on contentPosition
  const getContentPositionClasses = (position: ContentPosition = "center") => {
    const baseClasses = `absolute px-3 py-4 md:px-4 md:py-6 lg:px-10 lg:py-20`;

    switch (position) {
      case "top-left":
        return `${baseClasses} top-0 left-0 mt-24 md:mt-24 lg:mt-32 ml-20 md:ml-24 lg:ml-28 max-w-xs md:max-w-sm lg:max-w-md`;
      case "top-right":
        return `${baseClasses} top-0 right-0 mt-24 md:mt-24 lg:mt-32 mr-20 md:mr-24 lg:mr-28 max-w-xs md:max-w-sm lg:max-w-md`;
      case "bottom-left":
        return `${baseClasses} bottom-0 left-0 mb-24 md:mb-24 lg:mb-32 ml-20 md:ml-24 lg:ml-28 max-w-xs md:max-w-sm lg:max-w-md`;
      case "bottom-right":
        return `${baseClasses} bottom-0 right-0 mb-24 md:mb-24 lg:mb-32 mr-20 md:mr-24 lg:mr-28 max-w-xs md:max-w-sm lg:max-w-md`;
      case "center":
      default:
        return `${baseClasses} inset-0 flex items-center justify-center text-center`;
    }
  };

  const getContentClasses = () => {
    return `max-w-4xl ${CAROUSEL_CONTENT.SPACING} overflow-hidden text-center`;
  };

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
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20">
        <div className={getContentPositionClasses(slide.contentPosition)}>
          <div className={getContentClasses()}>
            {slide.title && (
              <div className="relative">
                <h2
                  className={`font-extrabold text-white tracking-tight leading-tight text-ellipsis break-words drop-shadow-lg whitespace-pre-line ${CAROUSEL_TYPOGRAPHY.TITLE}`}
                >
                  {slide.title}
                </h2>
                <div
                  className={`bg-blue-500 mt-4 md:mt-5 lg:mt-6 rounded-full mx-auto ${CAROUSEL_TYPOGRAPHY.DIVIDER}`}
                ></div>
              </div>
            )}

            {slide.description && (
              <p
                className={`text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed text-ellipsis break-words drop-shadow-md whitespace-pre-line ${CAROUSEL_TYPOGRAPHY.DESCRIPTION} ${slide.contentPosition === "center" ? "max-w-3xl mx-auto" : ""}`}
              >
                {slide.description}
              </p>
            )}

            {slide.showButtons && (
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 h-auto rounded-3xl text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href={slide.buttonLink} scroll>
                  {slide.buttonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
