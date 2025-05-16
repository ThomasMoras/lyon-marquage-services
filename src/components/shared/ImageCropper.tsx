"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Move } from "lucide-react";
import { CropData } from "@/types";

interface ImageCropperProps {
  imageUrl: string;
  initialCropData?: CropData;
  aspectRatio?: number; // Optional fixed aspect ratio (width/height)
  onSave: (cropData: CropData) => void;
  onCancel: () => void;
}

export function ImageCropper({
  imageUrl,
  initialCropData,
  aspectRatio,
  onSave,
  onCancel,
}: ImageCropperProps) {
  // Container and image references
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // State for image positioning and zoom
  const [cropData, setCropData] = useState<CropData>(
    initialCropData || {
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0,
    }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  // const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Load image dimensions on mount
  // useEffect(() => {
  //   const img = new Image();
  //   img.onload = () => {
  //     setImageSize({ width: img.width, height: img.height });
  //   };
  //   img.src = imageUrl;

  //   // Get container dimensions
  //   if (containerRef.current) {
  //     const { width, height } = containerRef.current.getBoundingClientRect();
  //     setContainerSize({ width, height });
  //   }

  //   // Window resize handler
  //   const handleResize = () => {
  //     if (containerRef.current) {
  //       const { width, height } = containerRef.current.getBoundingClientRect();
  //       setContainerSize({ width, height });
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [imageUrl]);

  // Mouse and touch event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Update position based on drag
  const updatePosition = (clientX: number, clientY: number) => {
    const deltaX = (clientX - dragStart.x) / cropData.scale;
    const deltaY = (clientY - dragStart.y) / cropData.scale;

    setCropData({
      ...cropData,
      position: {
        x: cropData.position.x + deltaX,
        y: cropData.position.y + deltaY,
      },
    });

    setDragStart({ x: clientX, y: clientY });
  };

  // Update zoom level
  const handleZoomChange = (value: number[]) => {
    setCropData({
      ...cropData,
      scale: value[0],
    });
  };

  // Reset crop to default
  const handleReset = () => {
    setCropData({
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0,
    });
  };

  // Calculate image style based on cropData
  const getImageStyle = () => {
    const { scale, position, rotation } = cropData;

    return {
      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
      transformOrigin: "center",
      width: "100%",
      height: "100%",
      objectFit: "contain" as const,
    };
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="relative" style={{ height: "400px" }}>
        {/* Crop preview area */}
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Crop preview"
            style={getImageStyle()}
            draggable="false"
          />

          {/* Drag indicator */}
          {isDragging && (
            <div className="absolute top-2 right-2 bg-gray-800/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Move className="w-3 h-3" /> Déplacement en cours
            </div>
          )}

          {/* Optional aspect ratio overlay */}
          {aspectRatio && (
            <div className="absolute inset-0 pointer-events-none border-2 border-blue-500/50"></div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-gray-500" />
          <Slider
            value={[cropData.scale]}
            min={0.5}
            max={3}
            step={0.01}
            onValueChange={handleZoomChange}
            className="flex-1"
          />
          <ZoomIn className="w-4 h-4 text-gray-500" />
        </div>

        <div className="flex gap-3 justify-between">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>

          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>

            <Button
              size="sm"
              onClick={() => onSave(cropData)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Appliquer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
