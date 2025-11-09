import {ComponentPropsWithoutRef} from "react";
import {clsx} from "clsx";

type BaseSkeletonProps = ComponentPropsWithoutRef<"div"> & {
  animate?: boolean;
};

export const Skeleton = ({ className, animate = true, ...props }: BaseSkeletonProps) => (
  <div
    className={clsx(
      "bg-white/10 rounded-md",
      animate && "animate-pulse",
      className,
    )}
    {...props}
  />
);

type SkeletonTextProps = {
  lines?: number;
  className?: string;
  lineClassName?: string;
};

export const SkeletonText = ({
  lines = 3,
  className,
  lineClassName,
}: SkeletonTextProps) => {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={clsx(
            "h-3 w-full",
            index === lines - 1 && "w-2/3",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
};

export const SkeletonCircle = ({
  className,
  ...props
}: Omit<BaseSkeletonProps, "children">) => (
  <Skeleton className={clsx("rounded-full", className)} {...props} />
);
