import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { UploadFile } from "./UploadFile";

interface ImageSelectorProps {
  folder: string;
  currentImage: string;
  onSelect: (imagePath: string) => void;
  disabled: boolean;
}

export function ImageSelector({ folder, currentImage, onSelect }: ImageSelectorProps) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching images from folder:", folder);
    fetch(`/api/file?folder=${folder}`)
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        setImages(data.images);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [folder]);

  return (
    <div className="space-y-4 text-center">
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer border rounded-lg p-2">
            <img src={currentImage} alt="Current" className="w-full h-48 object-cover rounded-lg" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
            {images &&
              images.map((image) => (
                <div
                  key={image}
                  onClick={() => onSelect(image)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    currentImage === image ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-32 object-cover" />
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      <UploadFile folder={folder} onUploadComplete={onSelect} />
    </div>
  );
}
