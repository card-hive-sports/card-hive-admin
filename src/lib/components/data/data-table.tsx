import {ReactNode} from "react";
import {clsx} from "clsx";
import {GameCard} from "@/lib/ui";

type Alignment = "left" | "center" | "right";

const alignmentClasses: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  align?: Alignment;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor?: (row: T, index: number) => string;
  emptyState?: ReactNode;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  renderMobileCard?: (row: T, index: number) => ReactNode;
}

export const DataTable = <T,>({
  data,
  columns,
  keyExtractor,
  emptyState,
  className = "",
  rowClassName,
  renderMobileCard,
}: DataTableProps<T>) => {
  if (!data.length && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={clsx("space-y-4", className)}>
      <GameCard asChild variant="glass" className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={clsx(
                      "px-6 py-4 text-white/70 font-semibold text-sm",
                      alignmentClasses[column.align ?? "left"],
                      column.headerClassName
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => {
                const key = keyExtractor ? keyExtractor(row, rowIndex) : `${rowIndex}`;
                return (
                  <tr
                    key={key}
                    className={clsx(
                      "border-b border-white/5 transition-all duration-200 hover:bg-[#CEFE10]/5 hover:shadow-[0_10px_20px_rgba(206,254,16,0.15)]",
                      rowClassName?.(row, rowIndex)
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={clsx(
                          "px-6 py-4",
                          alignmentClasses[column.align ?? "left"],
                          column.cellClassName
                        )}
                      >
                        {column.cell(row, rowIndex)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GameCard>

      {renderMobileCard && (
        <div className="md:hidden flex flex-col gap-4">
          {data.map((row, index) => (
            <GameCard
              variant="glass"
              key={keyExtractor ? keyExtractor(row, index) : index}
              className="p-4 space-y-4"
            >
              {renderMobileCard(row, index)}
            </GameCard>
          ))}
        </div>
      )}
    </div>
  );
};
