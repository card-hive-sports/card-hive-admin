import {ChevronLeft, ChevronRight} from "lucide-react";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

const createPageWindow = (page: number, totalPages: number) => {
  const windowSize = 5;
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + windowSize - 1);

  if (end - start < windowSize - 1) {
    start = Math.max(1, end - windowSize + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export const Pagination = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isLoading = false,
  className = "",
}: PaginationProps) => {
  const fallbackTotalPages =
    totalPages ?? ((pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1) || 1);
  const safeTotalPages = Math.max(1, fallbackTotalPages);
  const currentPage = Math.min(Math.max(1, page), safeTotalPages);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < safeTotalPages;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pageNumbers = createPageWindow(currentPage, safeTotalPages);

  return (
    <div className={`flex flex-col gap-3 md:flex-row md:items-center md:justify-between ${className}`}>
      <p className="text-white/60 text-sm">
        Showing <span className="text-white">{startItem}</span>-
        <span className="text-white">{endItem}</span> of{" "}
        <span className="text-white">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => canGoPrev && onPageChange(currentPage - 1)}
          disabled={!canGoPrev || isLoading}
          className={`flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold transition-colors ${
            canGoPrev && !isLoading
              ? "text-white hover:bg-white/10 cursor-pointer"
              : "text-white/30 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            disabled={pageNumber === currentPage || isLoading}
            className={`min-w-[40px] rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              pageNumber === currentPage
                ? "border-[#CEFE10] bg-[#CEFE10] text-black"
                : "border-white/20 text-white hover:bg-white/10 cursor-pointer"
            } ${isLoading && pageNumber !== page ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext || isLoading}
          className={`flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold transition-colors ${
            canGoNext && !isLoading
              ? "text-white hover:bg-white/10 cursor-pointer"
              : "text-white/30 cursor-not-allowed"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
