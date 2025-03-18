// components/ui/spinner.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary";
}

export function Spinner({ size = "md", variant = "default", className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-transparent",
        {
          "w-4 h-4 border-2": size === "sm",
          "w-8 h-8 border-3": size === "md",
          "w-12 h-12 border-4": size === "lg",
          "border-gray-300": variant === "default",
          "border-primary": variant === "primary",
        },
        className
      )}
      {...props}
    />
  );
}
