import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { UploadFile } from "./UploadFile";
import { Trash2 } from "lucide-react";
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

interface ImageSelectorProps {
  folder: string;
  currentImage: string;
  onSelect: (imagePath: string) => void;
  disabled?: boolean;
}

export function ImageSelector({
  folder,
  currentImage,
  onSelect,
  disabled = false,
}: ImageSelectorProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const fetchImages = () => {
    console.log("Fetching images from folder:", folder);
    fetch(`/api/file?folder=${folder.toLocaleLowerCase()}`)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        setImages(data.images);
      })
      .catch((error) => console.error("Fetch error:", error));
  };

  useEffect(() => {
    if (isDialogOpen) {
      fetchImages();
    }
  }, [folder, isDialogOpen]);

  const handleDelete = async (image: string) => {
    setIsDeleting(true);
    try {
      // Extraction du chemin relatif du fichier, en supprimant le "/" initial
      const filePath = image.startsWith("/") ? image.substring(1) : image;

      const response = await fetch(`/api/file?filePath=${filePath}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        // Si l'image supprimée est l'image courante, sélectionner une nouvelle image
        if (image === currentImage && images.length > 1) {
          const newCurrentImage = images.find((img) => img !== image) || "";
          onSelect(newCurrentImage);
        }

        // Mettre à jour la liste des images
        setImages(images.filter((img) => img !== image));

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

  return (
    <div className="space-y-4 text-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="cursor-pointer border rounded-lg p-2">
            <img src={currentImage} alt="Current" className="w-full h-48 object-cover rounded-lg" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sélectionner une image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
            {images &&
              images.map((image) => (
                <div
                  key={image}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 relative group ${
                    currentImage === image ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-32 object-cover"
                    onClick={() => onSelect(image)}
                  />
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
              ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. L`&apos;`image sera définitivement supprimée.
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

      {!disabled && <UploadFile folder={folder} onUploadComplete={onSelect} />}
    </div>
  );
}
