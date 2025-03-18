"use client";
import React from "react";
import { ProductGridSkeleton } from "./ProductCardSkeleton";

export function ProductCategorySkeleton() {
  return (
    <div>
      {/* Title skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-8">
        <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-5 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>

      {/* Filter bar skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>

      {/* Products grid skeleton - now using the reusable component */}
      <ProductGridSkeleton count={12} columns={4} className="mb-8" />

      {/* Pagination skeleton */}
      <div className="flex justify-center items-center mt-12">
        <div className="flex gap-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-10 h-10 rounded bg-gray-200 animate-pulse"></div>
            ))}
        </div>
      </div>
    </div>
  );
}
