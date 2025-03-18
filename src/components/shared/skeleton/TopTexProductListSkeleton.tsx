"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function TopTexProductListSkeleton({
  itemCount = 12,
  className,
  ...props
}: {
  itemCount?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header with title and sorting options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-36 mt-1 animate-pulse"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-[180px] animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array(itemCount)
          .fill(0)
          .map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <div className="h-5 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded w-[100px] animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-[100px] animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-2">
      {/* Product image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-md animate-pulse"></div>

      {/* Product title skeleton */}
      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>

      {/* Product price skeleton */}
      <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>

      {/* Color options skeleton */}
      <div className="flex gap-1 mt-1">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
          ))}
      </div>
    </div>
  );
}
