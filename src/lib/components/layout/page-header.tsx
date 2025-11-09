import {ReactNode} from "react";
import {clsx} from "clsx";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, subtitle, actions, className }: PageHeaderProps) => (
  <div
    className={clsx(
      "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
      className
    )}
  >
    <div>
      <h2 className="text-white text-3xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-white/60">{subtitle}</p>}
    </div>
    {actions && <div className="w-full md:w-auto">{actions}</div>}
  </div>
);
