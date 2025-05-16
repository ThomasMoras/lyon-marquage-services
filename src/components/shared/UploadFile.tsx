"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploadResult {
  fileUrl: string;
  path: string;
  metadata?: {
    size?: number;
    width?: number;
    height?: number;
    mimeType?: string;
  };
}

interface UploadFileProps {
  folder: string;
  onUploadComplete: (fileData: FileUploadResult) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
}

export function UploadFile({
  folder,
  onUploadComplete,
  acceptedFileTypes = "image/*",
  maxFileSize = 10, // Default 10MB
}: UploadFileProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file type
    if (!file.type.match(acceptedFileTypes.replace("*", ""))) {
      toast({
        title: "Type de fichier non accepté",
        description: `Veuillez sélectionner un fichier de type ${acceptedFileTypes}`,
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: `La taille maximale autorisée est de ${maxFileSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 95) {
          clearInterval(interval);
          return 95; // We'll set it to 100 when the upload is actually complete
        }
        return newProgress;
      });
    }, 200);
    return interval;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const progressInterval = simulateProgress();

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

      // Upload complete
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Notify success
      toast({
        title: "Upload réussi",
        description: "L'image a été téléchargée avec succès",
      });

      // Call the callback and close dialog
      onUploadComplete(data);

      // Small delay to show 100% progress
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);

      clearInterval(progressInterval);
      setUploadProgress(0);

      toast({
        title: "Échec de l'upload",
        description: error instanceof Error ? error.message : "Veuillez réessayer",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadProgress(0);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          resetForm();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-dashed hover:border-solid transition-all duration-200"
        >
          <Upload className="w-4 h-4" />
          Ajouter une nouvelle image
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Télécharger une image</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {previewUrl ? (
            <div className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden">
              <img src={previewUrl} alt="Preview" className="object-contain w-full h-full" />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white/100"
                onClick={resetForm}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>

              {selectedFile && (
                <div className="absolute bottom-0 inset-x-0 bg-white/80 p-2 text-xs text-center">
                  {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}
            </div>
          ) : (
            <div
              className={`border-2 ${dragActive ? "border-primary" : "border-dashed"} rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-all duration-200 flex flex-col items-center gap-3`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-center mb-1">
                  Déposez votre fichier ici ou cliquez pour parcourir
                </p>
                <p className="text-sm text-gray-500">
                  {acceptedFileTypes.replace("*", "")} (Max. {maxFileSize}MB)
                </p>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center text-gray-500">
                Téléchargement en cours... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {previewUrl && (
            <div className="flex gap-2 justify-end w-full">
              <Button variant="outline" onClick={resetForm} disabled={isUploading}>
                Annuler
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? "Envoi en cours..." : "Envoyer"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
