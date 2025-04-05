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
  onUploadComplete: (fileUrl: string) => void;
}

export function UploadFile({ folder, onUploadComplete }: UploadFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      const data = await response.json();
      onUploadComplete(data.fileUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter une nouvelle image</Button>
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
              <p>Cliquez ou faite glisser une image ici</p>
            </label>
          )}
        </div>

        <DialogFooter>
          {previewUrl && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
