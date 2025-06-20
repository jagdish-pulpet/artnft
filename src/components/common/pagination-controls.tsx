
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  const maxPagesToShow = 5; // Max number of page buttons to show (including ellipses)
  const halfPagesToShow = Math.floor((maxPagesToShow - 2) / 2); // -2 for first and last page

  // Always show the first page
  pageNumbers.push(1);

  // Ellipsis after first page if needed
  if (currentPage > halfPagesToShow + 2 && totalPages > maxPagesToShow) {
    pageNumbers.push(-1); // -1 represents an ellipsis
  }

  // Determine start and end for middle page numbers
  let startPage = Math.max(2, currentPage - halfPagesToShow);
  let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);
  
  // Adjust if near the beginning
  if (currentPage - halfPagesToShow <= 2) {
    endPage = Math.min(totalPages -1, 1 + (maxPagesToShow - 2) );
  }
  // Adjust if near the end
  if (currentPage + halfPagesToShow >= totalPages - 1) {
    startPage = Math.max(2, totalPages - (maxPagesToShow - 2) );
  }


  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < totalPages) {
      pageNumbers.push(i);
    }
  }

  // Ellipsis before last page if needed
  if (currentPage < totalPages - (halfPagesToShow + 1) && totalPages > maxPagesToShow) {
     if (pageNumbers[pageNumbers.length -1] !== totalPages -1 ) {
         pageNumbers.push(-1); // -1 represents an ellipsis
     }
  }

  // Always show the last page if totalPages > 1
  if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
    pageNumbers.push(totalPages);
  }
  
  // Remove duplicate page numbers if any (e.g. if totalPages is small)
  const uniquePageNumbers = [...new Set(pageNumbers)];


  return (
    <div className={cn("mt-8 flex justify-center items-center space-x-1 sm:space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      <span className="text-sm text-muted-foreground px-2 hidden sm:inline">
        Page {currentPage} of {totalPages}
      </span>

      {uniquePageNumbers.map((page, index) =>
        page === -1 ? (
          <Button key={`ellipsis-${index}`} variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground cursor-default" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

