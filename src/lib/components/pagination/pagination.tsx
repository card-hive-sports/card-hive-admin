'use client';

import {Fragment, useEffect, useMemo, useRef, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {GameButton} from "@/lib/ui";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
  maxPageButtons?: number;
}

const createPageWindow = (page: number, totalPages: number, desiredWindowSize: number) => {
  const windowSize = Math.max(1, Math.min(desiredWindowSize, totalPages));
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
  maxPageButtons = 1,
}: PaginationProps) => {
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const jumpDropdownRef = useRef<HTMLDivElement>(null);

  const fallbackTotalPages =
    totalPages ?? ((pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1) || 1);
  const safeTotalPages = Math.max(1, fallbackTotalPages);
  const currentPage = Math.min(Math.max(1, page), safeTotalPages);
  const clampedWindowSize = Math.max(1, maxPageButtons);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < safeTotalPages;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pageNumbers = createPageWindow(currentPage, safeTotalPages, clampedWindowSize);
  const pagesToRender = Array.from(new Set([1, ...pageNumbers, safeTotalPages])).sort(
    (a, b) => a - b,
  );

  useEffect(() => {
    if (!isJumpOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (jumpDropdownRef.current && !jumpDropdownRef.current.contains(target)) {
        setIsJumpOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isJumpOpen]);

  const jumpOptions = useMemo(
    () => Array.from({ length: safeTotalPages }, (_, index) => index + 1),
    [safeTotalPages],
  );

  const handleJumpSelect = (targetPage: number) => {
    setIsJumpOpen(false);
    if (targetPage === currentPage || isLoading) return;
    onPageChange(targetPage);
  };

  return (
    <div className={`flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between ${className}`}>
      <p className="text-white/60 text-sm text-center md:text-left">
        Showing <span className="text-white">{startItem}</span>-
        <span className="text-white">{endItem}</span> of{" "}
        <span className="text-white">{totalItems}</span>
      </p>
      <div className="flex w-full items-center justify-center gap-2 flex-wrap md:w-auto md:justify-end">
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

        {pagesToRender.map((pageNumber, index) => {
          const previousPage = pagesToRender[index - 1];
          const shouldShowEllipsis = previousPage && pageNumber - previousPage > 1;

          return (
            <Fragment key={pageNumber}>
              {shouldShowEllipsis && (
                <span className="px-2 text-white/50 text-sm font-semibold select-none">...</span>
              )}
              <button
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
            </Fragment>
          );
        })}

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

        <div className="relative" ref={jumpDropdownRef}>
          <GameButton
            type="button"
            size="sm"
            variant="secondary"
            disabled={isLoading}
            className="normal-case tracking-normal"
            onClick={() => setIsJumpOpen((prev) => !prev)}
          >
            Jump to page
          </GameButton>

          {isJumpOpen && (
            <div className="absolute right-0 bottom-full mb-2 glass-dark glass-dark-thick rounded-xl p-4 w-56 z-30 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-semibold">Jump to page</p>
                <span className="text-white/60 text-xs">1 - {safeTotalPages}</span>
              </div>
              <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                {jumpOptions.map((pageNumber) => (
                  <GameButton
                    key={pageNumber}
                    type="button"
                    size="sm"
                    variant={pageNumber === currentPage ? "primary" : "secondary"}
                    disabled={isLoading}
                    onClick={() => handleJumpSelect(pageNumber)}
                    className="w-full justify-between normal-case tracking-normal"
                  >
                    <span>Page {pageNumber}</span>
                    {pageNumber === currentPage && <span className="text-black text-xs font-bold">Current</span>}
                  </GameButton>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
