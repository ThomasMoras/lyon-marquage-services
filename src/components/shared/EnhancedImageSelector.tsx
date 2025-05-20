"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageCropper } from "./ImageCropper";
import { Trash2, Image, Crop, ZoomIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CropData } from "@/types";
import { UploadFile } from "./UploadFile";

interface ImageItem {
  url: string;
  path: string;
  name: string;
}

interface EnhancedImageSelectorProps {
  folder: string;
  currentImage: string | null;
  currentCropData?: CropData;
  onSelect: (imageUrl: string, cropData: CropData) => void;
  aspectRatio?: number; // Optional fixed aspect ratio
  disabled?: boolean;
}

export function EnhancedImageSelector({
  folder,
  currentImage,
  currentCropData,
  onSelect,
  aspectRatio,
  disabled = false,
}: EnhancedImageSelectorProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage);
  const [cropData, setCropData] = useState<CropData>(
    currentCropData || {
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0,
    }
  );
  const [showCropper, setShowCropper] = useState(false);
  const { toast } = useToast();

  // Reset image load error when current image changes
  useState(() => {
    setImageLoadError(false);
    setSelectedImage(currentImage);
    if (currentCropData) {
      setCropData(currentCropData);
    }
  });

  const fetchImages = () => {
    fetch(`/api/file?folder=${folder.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les images",
          variant: "destructive",
        });
      });
  };

  const handleDelete = async (image: ImageItem) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/file?filePath=${encodeURIComponent(image.path)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        // If the deleted image is the current image, select a new image
        if (image.url === currentImage && images.length > 1) {
          const newCurrentImage = images.find((img) => img.url !== image.url);
          if (newCurrentImage) {
            onSelect(newCurrentImage.url, {
              scale: 1,
              position: { x: 0, y: 0 },
              rotation: 0,
            });
          }
        }

        // Update the image list
        setImages(images.filter((img) => img.path !== image.path));

        toast({
          title: "Image supprimée",
          description: "L'image a été supprimée avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Échec de la suppression de l'image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la suppression de l'image",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  // Placeholder component for when there's no image or image fails to load
  const ImagePlaceholder = () => (
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="text-gray-400 flex flex-col items-center">
        <Image className="w-8 h-8 mb-2" />
        <span>Aucune image</span>
      </div>
    </div>
  );

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const handleUploadComplete = (fileData: { fileUrl: string; path: string }) => {
    // Add the new image to the list
    const newImage: ImageItem = {
      url: fileData.fileUrl,
      path: fileData.path,
      name: fileData.path.split("/").pop() || "",
    };

    setImages([newImage, ...images]);

    // Select the new image with default crop
    setSelectedImage(fileData.fileUrl);
    setCropData({
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0,
    });
  };

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setCropData({
      scale: 1,
      position: { x: 0, y: 0 },
      rotation: 0,
    });
  };

  const handleCropSave = (newCropData: CropData) => {
    setCropData(newCropData);
    setShowCropper(false);
    if (selectedImage) {
      onSelect(selectedImage, newCropData);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      console.log("handleConfirmSelection : ", selectedImage);
      onSelect(selectedImage, cropData);
      setIsDialogOpen(false);
    }
  };

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      fetchImages();
    }
    setIsDialogOpen(open);
  };

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer border rounded-lg p-2 group relative">
            {currentImage && !imageLoadError ? (
              <div className="relative w-full h-48 overflow-hidden rounded-lg">
                <img
                  src={currentImage}
                  alt="Current"
                  className="w-full h-full object-cover absolute"
                  style={{
                    transform: `scale(${currentCropData?.scale || 1}) translate(${currentCropData?.position?.x || 0}px, ${currentCropData?.position?.y || 0}px) rotate(${currentCropData?.rotation || 0}deg)`,
                    transformOrigin: "center",
                  }}
                  onError={handleImageError}
                />
                {!disabled && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" className="bg-white/80 hover:bg-white">
                      <ZoomIn className="w-5 h-5 mr-2" />
                      Modifier
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sélectionner et ajuster une image</DialogTitle>
          </DialogHeader>

          {showCropper && selectedImage ? (
            <ImageCropper
              imageUrl={selectedImage}
              initialCropData={cropData}
              aspectRatio={aspectRatio}
              onSave={handleCropSave}
              onCancel={() => setShowCropper(false)}
            />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
                {images && images.length > 0 ? (
                  images.map((image) => (
                    <div
                      key={image.path}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group ${
                        selectedImage === image.url ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <div className="relative h-32">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                          onClick={() => handleImageSelect(image.url)}
                          onError={(e) => {
                            // Replace broken image with placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const placeholder = document.createElement("div");
                              placeholder.className =
                                "w-full h-full bg-gray-100 flex items-center justify-center";
                              placeholder.innerHTML =
                                '<span class="text-gray-400">Image non disponible</span>';
                              parent.appendChild(placeholder);
                            }
                          }}
                        />

                        {selectedImage === image.url && (
                          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                            <div className="bg-white/80 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                              Sélectionnée
                            </div>
                          </div>
                        )}
                      </div>

                      {!disabled && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-8 h-8 p-0 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageToDelete(image);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    Aucune image disponible dans ce dossier
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between items-center">
                <div>
                  {!disabled && (
                    <UploadFile folder={folder} onUploadComplete={handleUploadComplete} />
                  )}
                </div>

                <div className="flex gap-2">
                  {selectedImage && (
                    <Button
                      variant="outline"
                      onClick={() => setShowCropper(true)}
                      className="flex items-center gap-2"
                    >
                      <Crop className="w-4 h-4" />
                      Ajuster l&apos;image
                    </Button>
                  )}

                  <Button
                    onClick={handleConfirmSelection}
                    disabled={!selectedImage}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Confirmer la sélection
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
          </DialogHeader>
          <p>Cette action ne peut pas être annulée. L&apos;image sera définitivement supprimée.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageToDelete(null)} disabled={isDeleting}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => imageToDelete && handleDelete(imageToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!disabled && (
        <div className="flex justify-center">
          <UploadFile folder={folder} onUploadComplete={handleUploadComplete} />
        </div>
      )}
    </div>
  );
}

// Re-export the UploadFile component with the same interface
export { UploadFile } from "./UploadFile";
