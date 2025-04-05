import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X as Close } from "lucide-react";
import { CardModalProps } from "@/types/cardTypes";

export function CardModal({
  cardToShow,
  visualCurrentCard,
  visualCards,
  toggleExpand,
  navigateToCard,
}: CardModalProps) {
  // const [imageRect, setImageRect] = useState<DOMRect | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // useEffect(() => {
  //   const updateImageRect = (): void => {
  //     if (imageRef.current) {
  //       setTimeout(() => {
  //         if (imageRef.current) {
  //           const rect = imageRef.current.getBoundingClientRect();
  //           setImageRect(rect);
  //         }
  //       }, 150);
  //     }
  //   };

  //   updateImageRect();
  //   window.addEventListener("resize", updateImageRect);

  //   return () => {
  //     window.removeEventListener("resize", updateImageRect);
  //   };
  // }, [visualCurrentCard]);

  // Gestion des raccourcis clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        toggleExpand(new MouseEvent("click") as unknown as React.MouseEvent);
      } else if (e.key === "ArrowRight") {
        navigateToCard("next");
      } else if (e.key === "ArrowLeft") {
        navigateToCard("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleExpand, navigateToCard]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300"
      onClick={toggleExpand}
    >
      <div
        className="relative flex items-center justify-center w-full max-w-7xl"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="relative max-w-5xl max-h-screen transition-transform duration-300 transform scale-100 animate-in fade-in">
          <Button
            onClick={toggleExpand}
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-2 h-8 w-8"
          >
            <Close className="w-4 h-4" />
          </Button>

          <img
            ref={imageRef}
            src={visualCurrentCard?.imageUrl || cardToShow.imageUrl || "/api/placeholder/800/800"}
            alt="Card image expanded"
            className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
          />

          {(visualCurrentCard?.title || cardToShow.title) && (
            <div className="absolute bottom-0 left-0 right-0 text-center bg-black/50 p-2 text-white rounded-b-md">
              <h3 className="font-semibold">{visualCurrentCard?.title || cardToShow.title}</h3>
              {(visualCurrentCard?.description || cardToShow.description) && (
                <p className="text-sm mt-1">
                  {visualCurrentCard?.description || cardToShow.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Flèches de navigation positionnées relativement à l'image */}
        {visualCards && visualCards.length > 1 && (
          <>
            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                navigateToCard("prev");
              }}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 h-12 w-12 shadow-md z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                navigateToCard("next");
              }}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 h-12 w-12 shadow-md z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
