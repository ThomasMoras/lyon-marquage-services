import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ImageCropperProps } from "@/types/cardTypes";

// Constantes
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 0.1;

export function ImageCropper({
  editedCard,
  cropOptions,
  setCropOptions,
  resetCrop,
  setShowCropMode,
}: ImageCropperProps) {
  // Références
  const cropperRef = useRef<HTMLDivElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropFrameRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startDragPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startCropPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Calculer les limites de position en fonction du zoom et des dimensions
  const calculatePositionLimits = (): { maxX: number; maxY: number } => {
    if (!cropperRef.current || !cropImageRef.current) {
      return { maxX: 50, maxY: 50 };
    }

    const containerRect = cropperRef.current.getBoundingClientRect();
    const naturalWidth = cropImageRef.current.naturalWidth;
    const naturalHeight = cropImageRef.current.naturalHeight;
    const containerRatio = containerRect.width / containerRect.height;
    const imageRatio = naturalWidth / naturalHeight;

    let baseWidth: number, baseHeight: number;
    if (containerRatio > imageRatio) {
      baseHeight = containerRect.height;
      baseWidth = baseHeight * imageRatio;
    } else {
      baseWidth = containerRect.width;
      baseHeight = baseWidth / imageRatio;
    }

    const effectiveWidth = baseWidth * cropOptions.scale;
    const effectiveHeight = baseHeight * cropOptions.scale;

    const horizontalOverflow = Math.max(0, (effectiveWidth - containerRect.width) / 2);
    const verticalOverflow = Math.max(0, (effectiveHeight - containerRect.height) / 2);

    const maxX = (horizontalOverflow / containerRect.width) * 100;
    const maxY = (verticalOverflow / containerRect.height) * 100;

    return { maxX, maxY };
  };

  // Fonction pour déplacer l'image dans une direction
  const moveImage = (direction: "up" | "down" | "left" | "right"): void => {
    if (!cropperRef.current || !cropImageRef.current) return;

    const movePercentage = 5;
    let newX = cropOptions.position.x;
    let newY = cropOptions.position.y;

    switch (direction) {
      case "up":
        newY = cropOptions.position.y - movePercentage;
        break;
      case "down":
        newY = cropOptions.position.y + movePercentage;
        break;
      case "left":
        newX = cropOptions.position.x - movePercentage;
        break;
      case "right":
        newX = cropOptions.position.x + movePercentage;
        break;
    }

    // Calculer et appliquer les limites
    const { maxX, maxY } = calculatePositionLimits();
    newX = Math.min(maxX, Math.max(-maxX, newX));
    newY = Math.min(maxY, Math.max(-maxY, newY));

    setCropOptions({
      ...cropOptions,
      position: { x: newX, y: newY },
    });
  };

  // Setup les gestionnaires d'événements pour le mode crop
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent): void => {
      if (!cropFrameRef.current) return;

      // Vérifier si le clic est sur le cadre
      const frameRect = cropFrameRef.current.getBoundingClientRect();
      const isInFrame =
        e.clientX >= frameRect.left &&
        e.clientX <= frameRect.right &&
        e.clientY >= frameRect.top &&
        e.clientY <= frameRect.bottom;

      if (isInFrame) {
        isDraggingRef.current = true;
        startDragPosRef.current = { x: e.clientX, y: e.clientY };
        startCropPosRef.current = { ...cropOptions.position };
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDraggingRef.current || !cropImageRef.current || !cropperRef.current) return;

      // Calculer le déplacement en pixels
      const deltaX = e.clientX - startDragPosRef.current.x;
      const deltaY = e.clientY - startDragPosRef.current.y;

      // Obtenir les dimensions du conteneur
      const containerRect = cropperRef.current.getBoundingClientRect();

      // Convertir le déplacement en pourcentage par rapport au conteneur
      const moveXPercent = (deltaX / containerRect.width) * 100;
      const moveYPercent = (deltaY / containerRect.height) * 100;

      // Calculer les nouvelles positions (inverser pour que le déplacement soit intuitif)
      const newX = startCropPosRef.current.x - moveXPercent;
      const newY = startCropPosRef.current.y - moveYPercent;

      // Appliquer les limites
      const { maxX, maxY } = calculatePositionLimits();

      setCropOptions({
        ...cropOptions,
        position: {
          x: Math.min(maxX, Math.max(-maxX, newX)),
          y: Math.min(maxY, Math.max(-maxY, newY)),
        },
      });
    };

    const handleMouseUp = (): void => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent): void => {
      if (!cropperRef.current) return;

      // Zoom avec la molette de la souris
      e.preventDefault();

      const delta = -Math.sign(e.deltaY) * ZOOM_STEP;
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, cropOptions.scale + delta));

      setCropOptions({
        ...cropOptions,
        scale: newScale,
      });
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Ajouter l'événement de molette au conteneur de crop
    const cropperElement = cropperRef.current;
    if (cropperElement) {
      cropperElement.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (cropperElement) {
        cropperElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [cropOptions]);

  return (
    <CardContent className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Mode de cadrage avancé</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetCrop}>
            Réinitialiser
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCropMode(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contrôles de zoom */}
      <div className="flex justify-center gap-4 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCropOptions({
              ...cropOptions,
              scale: Math.max(MIN_ZOOM, cropOptions.scale - ZOOM_STEP),
            });
          }}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
          {Math.round(cropOptions.scale * 100)}%
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCropOptions({
              ...cropOptions,
              scale: Math.min(MAX_ZOOM, cropOptions.scale + ZOOM_STEP),
            });
          }}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Contrôles directionnels */}
      <div className="grid grid-cols-3 gap-2 place-items-center mb-2">
        <div></div>
        <Button variant="outline" size="sm" onClick={() => moveImage("up")} className="p-2 h-8 w-8">
          <ChevronUp className="w-4 h-4" />
        </Button>
        <div></div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => moveImage("left")}
          className="p-2 h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-xs text-gray-500">Position</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => moveImage("right")}
          className="p-2 h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <div></div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => moveImage("down")}
          className="p-2 h-8 w-8"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
        <div></div>
      </div>

      {/* Conteneur de l'image avec cadre de sélection */}
      <div
        ref={cropperRef}
        className="h-64 bg-black/10 relative overflow-hidden border rounded-lg"
        style={{ cursor: isDraggingRef.current ? "grabbing" : "grab" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            ref={cropImageRef}
            src={editedCard.imageUrl || "/api/placeholder/400/400"}
            alt="Image à cadrer"
            className="max-w-full max-h-full transition-all duration-200"
            style={{
              objectFit: "contain",
              transformOrigin: "center",
              transform: `scale(${cropOptions.scale})`,
              objectPosition: `calc(50% + ${cropOptions.position.x}%) calc(50% + ${cropOptions.position.y}%)`,
            }}
            draggable="false"
            onLoad={() => {
              if (cropImageRef.current && cropperRef.current) {
                setTimeout(() => {
                  if (
                    cropOptions.scale === 1 &&
                    cropOptions.position.x === 0 &&
                    cropOptions.position.y === 0
                  ) {
                    resetCrop();
                  } else {
                    setCropOptions({ ...cropOptions });
                  }
                }, 100);
              }
            }}
          />
        </div>

        {/* Cadre de sélection - représente la zone visible finale */}
        <div
          ref={cropFrameRef}
          className="absolute inset-0 border-2 border-primary pointer-events-none"
        />

        <div className="absolute bottom-2 left-0 right-0 text-center text-xs bg-black/50 text-white p-1 pointer-events-none">
          Déplacez l&apos;image pour ajuster le cadrage • Utilisez la molette pour zoomer
        </div>
      </div>

      {/* Aperçu du résultat */}
      <div>
        <div className="text-sm font-medium mb-2">Aperçu</div>
        <div className="border rounded-lg overflow-hidden h-32">
          <div className="w-full h-full relative">
            <img
              src={editedCard.imageUrl || "/api/placeholder/400/400"}
              alt="Aperçu du cadrage"
              className="absolute w-full h-full object-cover"
              style={{
                objectFit: "cover",
                transform: `scale(${cropOptions.scale})`,
                transformOrigin: "center",
                objectPosition: `calc(50% + ${cropOptions.position.x}%) calc(50% + ${cropOptions.position.y}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
}
