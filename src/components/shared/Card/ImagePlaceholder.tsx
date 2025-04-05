import React from "react";
import { Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  /** Text to display beneath the icon */
  text?: string;
  /** Additional class names for the container */
  className?: string;
  /** Height of the placeholder */
  height?: string;
  /** Additional class names for the content */
  contentClassName?: string;
  /** Icon to display, defaults to Image icon */
  icon?: React.ReactNode;
  /** Size of the icon */
  iconSize?: number;
}

export function ImagePlaceholder({
  text = "Aucune image",
  className = "",
  height = "h-48",
  contentClassName = "",
  icon = null,
  iconSize = 8,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "w-full bg-gray-100 flex items-center justify-center rounded-lg",
        height,
        className
      )}
    >
      <div className={cn("text-gray-400 flex flex-col items-center", contentClassName)}>
        {icon || <Image className={`w-${iconSize} h-${iconSize} mb-2`} />}
        {text && <span>{text}</span>}
      </div>
    </div>
  );
}
