"use client";
import React from "react";

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4">
      {/* Fil d'Ariane skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Left column: Image skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-5 gap-2">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
              ))}
          </div>
        </div>

        {/* Right column: Product info skeleton */}
        <div className="space-y-6">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-16 bg-gray-200 rounded w-full animate-pulse"></div>

          {/* Color selection skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                ))}
            </div>
          </div>

          {/* Size selection skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="h-10 w-14 bg-gray-200 rounded-md animate-pulse"></div>
                ))}
            </div>
          </div>

          {/* Quantity selection skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="flex items-center w-36 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="flex-1 h-12 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Tabs skeleton */}
          <div className="pt-6">
            <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse mb-4"></div>
            <div className="h-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
