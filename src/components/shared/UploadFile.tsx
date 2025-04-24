import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UploadFileProps {
  folder: string;
  onUploadComplete: (fileData: { fileUrl: string; path: string }) => void;
}

export function UploadFile({ folder, onUploadComplete }: UploadFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folder", folder);

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      onUploadComplete(data);
      setIsOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
        >
          Ajouter une nouvelle image
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Sélectionner une image</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {previewUrl ? (
            <div className="relative aspect-video">
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          ) : (
            <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              <p>Cliquez ou faites glisser une image ici</p>
            </label>
          )}
        </div>

        <DialogFooter>
          {previewUrl && (
            <>
              <Button variant="outline" onClick={resetForm}>
                Annuler
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
