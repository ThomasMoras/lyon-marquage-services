import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadFile } from "./UploadFile";

interface Image {
  url: string;
  path: string;
  name: string;
}

interface ImageGalleryProps {
  folder: string;
  onSelect?: (imageUrl: string) => void;
  showUploadButton?: boolean;
}

export function ImageGallery({ folder, onSelect, showUploadButton = true }: ImageGalleryProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/file?folder=${folder}`);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch images");
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (err: unknown) {
      console.error("Error fetching images:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load images");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [folder]);

  const handleUploadComplete = (fileData: { fileUrl: string; path: string }) => {
    setImages((prev) => [
      {
        url: fileData.fileUrl,
        path: fileData.path,
        name: fileData.path.split("/").pop() || "",
      },
      ...prev,
    ]);

    // If onSelect is provided, automatically select the newly uploaded image
    if (onSelect) {
      onSelect(fileData.fileUrl);
    }
  };

  const handleDeleteImage = async (path: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      const response = await fetch(`/api/file?filePath=${encodeURIComponent(path)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete image");
      }

      // Remove the image from the state
      setImages((prev) => prev.filter((img) => img.path !== path));
    } catch (err: unknown) {
      console.error("Error deleting image:", err);

      // Type guard to safely access err.message
      if (err instanceof Error) {
        alert("Failed to delete image: " + err.message);
      } else {
        alert("Failed to delete image: Unknown error");
      }
    }
  };

  return (
    <div className="space-y-4">
      {showUploadButton && (
        <div className="flex justify-end">
          <UploadFile folder={folder} onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">Chargement des images...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : images.length === 0 ? (
        <div className="text-center py-8">Aucune image trouvée dans ce dossier</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.path} className="relative group aspect-square">
              <img
                src={image.url}
                alt={image.name}
                className="rounded-lg object-cover w-full h-full cursor-pointer"
                onClick={() => onSelect && onSelect(image.url)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                {onSelect && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mr-2"
                    onClick={() => onSelect(image.url)}
                  >
                    Sélectionner
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(image.path);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
