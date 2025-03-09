import React, { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";

interface EditableImageProps {
  initialSrc: string;
  fieldName: string;
  onSave: (fieldName: string, file: File) => Promise<void>;
  isAdmin?: boolean;
  className?: string;
  aspectRatio?: "square" | "16/9" | "4/3";
  maxSizeMB?: number;
  allowedTypes?: string[];
}

const EditableImage: React.FC<EditableImageProps> = ({
  initialSrc,
  fieldName,
  onSave,
  isAdmin = false,
  className = "",
  aspectRatio = "square",
  maxSizeMB = 5,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
}) => {
  // const [setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>(initialSrc);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    "square": "aspect-square",
    "16/9": "aspect-video",
    "4/3": "aspect-4/3",
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Type de fichier non supporté";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `L'image doit faire moins de ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Créer une preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError("");

    try {
      setIsLoading(true);
      await onSave(fieldName, file);
      // setIsEditing(false);
    } catch (error) {
      setError("Erreur lors du téléchargement");
      console.error("Erreur upload:", error);
    } finally {
      setIsLoading(false);
    }

    // Nettoyer l'URL de preview
    return () => URL.revokeObjectURL(objectUrl);
  };

  const triggerFileInput = () => {
    if (isAdmin && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Image container */}
      <div
        className={`relative overflow-hidden bg-gray-100 ${aspectRatioClasses[aspectRatio]}`}
        onClick={triggerFileInput}
      >
        {/* Image actuelle */}
        <img
          src={preview}
          alt={fieldName}
          className={`w-full h-full object-cover transition-opacity duration-200
            ${isLoading ? "opacity-50" : "opacity-100"}
            ${isAdmin && !isLoading ? "cursor-pointer" : ""}`}
        />

        {/* Overlay de chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Overlay au survol (admin uniquement) */}
        {isAdmin && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={allowedTypes.join(",")}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default EditableImage;
