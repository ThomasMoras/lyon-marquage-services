"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showColors?: boolean;
  showDescription?: boolean;
}

export function ProductCardSkeleton({
  showColors = true,
  showDescription = false,
  className,
  ...props
}: ProductCardSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Product image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-md animate-pulse"></div>

      {/* Product title skeleton */}
      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>

      {/* Product description (optional) */}
      {showDescription && (
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>
      )}

      {/* Product price skeleton */}
      <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>

      {/* Color options skeleton (optional) */}
      {showColors && (
        <div className="flex gap-1 mt-1">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-gray-300 animate-pulse"></div>
            ))}
        </div>
      )}
    </div>
  );
}

export function ProductGridSkeleton({
  count = 12,
  columns = 4,
  showColors = true,
  showDescription = false,
  className,
  ...props
}: {
  count?: number;
  columns?: 1 | 2 | 3 | 4 | 6;
  showColors?: boolean;
  showDescription?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2",
        {
          "md:grid-cols-3 lg:grid-cols-4": columns === 4,
          "md:grid-cols-3": columns === 3,
          "sm:grid-cols-2": columns === 2,
          "sm:grid-cols-1": columns === 1,
          "md:grid-cols-3 lg:grid-cols-6": columns === 6,
        },
        "gap-6",
        className
      )}
      {...props}
    >
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ProductCardSkeleton
            key={index}
            showColors={showColors}
            showDescription={showDescription}
          />
        ))}
    </div>
  );
}
