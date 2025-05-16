export interface CropData {
  scale: number;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
}

export interface ImageMetadata {
  url: string;
  path: string;
  name: string;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
  createdAt?: string;
}

export interface ImageWithCrop {
  image: ImageMetadata;
  cropData: CropData;
}
