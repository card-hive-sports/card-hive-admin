import {ReactNode, useEffect, useRef, useState} from "react";
import {Search, Filter, ArrowUpDown} from "lucide-react";
import {clsx} from "clsx";
import {GameButton} from "@/lib/ui";

interface ToolbarPopoverConfig {
  buttonLabel: string;
  buttonIcon?: ReactNode;
  renderContent: (close: () => void) => ReactNode;
  panelClassName?: string;
}

interface ResourceToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ToolbarPopoverConfig;
  sort?: ToolbarPopoverConfig;
  extraActions?: ReactNode;
  className?: string;
}

export const ResourceToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  sort,
  extraActions,
  className,
}: ResourceToolbarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (showFilters && filterRef.current && !filterRef.current.contains(target)) {
        setShowFilters(false);
      }
      if (showSort && sortRef.current && !sortRef.current.contains(target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showFilters, showSort]);

  return (
    <div className={clsx("glass p-4 rounded-2xl space-y-4 relative z-10", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 relative cursor-pointer">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#CEFE10]"
          />
        </div>

        <div className="flex w-full flex-wrap gap-3 sm:gap-0 md:w-auto md:flex-nowrap md:justify-end">
          {filters && (
            <div className="relative flex-1 min-w-[150px] md:flex-none" ref={filterRef}>
              <GameButton
                type="button"
                variant="secondary"
                className="w-full md:w-auto justify-center"
                onClick={() => {
                  setShowFilters((prev) => !prev);
                  setShowSort(false);
                }}
              >
                {filters.buttonIcon ?? <Filter className="w-5 h-5" />}
                {filters.buttonLabel}
              </GameButton>

              {showFilters && (
                <div
                  className={clsx(
                    "absolute top-full right-0 mt-2 glass-dark glass-dark-thick rounded-lg p-4 z-50",
                    filters.panelClassName ?? "w-72 space-y-4"
                  )}
                >
                  {filters.renderContent(() => setShowFilters(false))}
                </div>
              )}
            </div>
          )}

          {sort && (
            <div className="relative flex-1 min-w-[150px] md:flex-none" ref={sortRef}>
              <GameButton
                type="button"
                variant="secondary"
                className="w-full md:w-auto justify-center"
                onClick={() => {
                  setShowSort((prev) => !prev);
                  setShowFilters(false);
                }}
              >
                {sort.buttonIcon ?? <ArrowUpDown className="w-5 h-5" />}
                {sort.buttonLabel}
              </GameButton>

              {showSort && (
                <div
                  className={clsx(
                    "absolute top-full right-0 mt-2 glass-dark glass-dark-thick rounded-lg p-4 z-50",
                    sort.panelClassName ?? "w-48 space-y-3"
                  )}
                >
                  {sort.renderContent(() => setShowSort(false))}
                </div>
              )}
            </div>
          )}

          {extraActions && <div className="w-full md:w-auto">{extraActions}</div>}
        </div>
      </div>
    </div>
  );
};
