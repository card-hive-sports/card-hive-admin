import {ReactNode} from "react";
import {clsx} from "clsx";

export interface DataTableMobileCardField {
  id: string;
  label: ReactNode;
  value: ReactNode;
  span?: 1 | 2;
}

export interface DataTableMobileCardLayoutProps {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: {
    label: ReactNode;
    className?: string;
  };
  fields?: DataTableMobileCardField[];
  actions?: ReactNode;
  className?: string;
}

export const DataTableMobileCardLayout = ({
  title,
  subtitle,
  badge,
  fields = [],
  actions,
  className,
}: DataTableMobileCardLayoutProps) => {
  return (
    <div className={clsx("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white text-lg font-semibold">{title}</p>
          {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        </div>
        {badge && (
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0",
              badge.className
            )}
          >
            {badge.label}
          </span>
        )}
      </div>

      {fields.length > 0 && (
        <div className={`grid grid-cols-${fields.length} gap-3 text-white/70 text-sm`}>
          {fields.map(({id, label, value, span}) => (
            <div key={id} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-white/50 text-xs">{label}</p>
              <p className="text-white font-semibold">
                {value}
              </p>
            </div>
          ))}
        </div>
        // <div key={id} className={clsx(span === 2 && "col-span-2")}>
            //   <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">{label}</p>
            //   <div className="text-white font-semibold">{value}</div>
            // </div>
      )}
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
};
