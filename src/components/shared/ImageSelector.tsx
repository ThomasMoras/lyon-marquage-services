import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { UploadFile } from "./UploadFile";
import { Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

// Define the image type returned from the API
interface ImageItem {
  url: string;
  path: string;
  name: string;
}

interface ImageSelectorProps {
  folder: string;
  currentImage: string;
  onSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

export function ImageSelector({
  folder,
  currentImage,
  onSelect,
  disabled = false,
}: ImageSelectorProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset image load error when current image changes
    setImageLoadError(false);
  }, [currentImage]);

  const fetchImages = () => {
    console.log("Fetching images from folder:", folder);
    fetch(`/api/file?folder=${folder.toLowerCase()}`)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        setImages(data.images || []);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchImages();
    }
  }, [folder, isDialogOpen]);

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
            onSelect(newCurrentImage.url);
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
        <ImageIcon className="w-8 h-8 mb-2" />
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

    // Select the new image
    onSelect(fileData.fileUrl);
  };

  return (
    <div className="space-y-4 text-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer border rounded-lg p-2">
            {currentImage && !imageLoadError ? (
              <img
                src={currentImage}
                alt="Current"
                className="w-full h-48 object-cover rounded-lg"
                onError={handleImageError}
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sélectionner une image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
            {images && images.length > 0 ? (
              images.map((image) => (
                <div
                  key={image.path}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group ${
                    currentImage === image.url ? "border-primary" : "border-transparent"
                  }`}
                >
                  <div className="relative h-32">
                    <Image
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      onClick={() => onSelect(image.url)}
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
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. L&apos;image sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => imageToDelete && handleDelete(imageToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!disabled && <UploadFile folder={folder} onUploadComplete={handleUploadComplete} />}
    </div>
  );
}
