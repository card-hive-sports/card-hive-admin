import {ReactNode} from "react";
import {clsx} from "clsx";

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
      <div className="hidden md:block glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
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
                      "border-b border-white/5 hover:bg-white/5 transition-colors",
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
      </div>

      {renderMobileCard && (
        <div className="md:hidden flex flex-col gap-4">
          {data.map((row, index) => (
            <div key={keyExtractor ? keyExtractor(row, index) : index} className="glass rounded-2xl p-4 space-y-4">
              {renderMobileCard(row, index)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
