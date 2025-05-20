import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CarouselPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CarouselPaginationProps) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="border-2"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
      </Button>

      <div className="flex gap-1">
        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(number)}
            className={currentPage === number ? "bg-blue-600 hover:bg-blue-700" : "border-2"}
          >
            {number}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="border-2"
      >
        Suivant <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};
