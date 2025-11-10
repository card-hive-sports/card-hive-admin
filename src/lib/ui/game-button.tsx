'use client';

import {Slot} from "@radix-ui/react-slot";
import clsx from "clsx";
import {ComponentPropsWithoutRef, CSSProperties, forwardRef} from "react";

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const variantClasses = {
  primary:
    "bg-gradient-to-b from-[#CEFE10] via-[#b8ff2a] to-[#9CD80D] text-black shadow-[0_10px_25px_rgba(206,254,16,0.35)] hover:shadow-[0_15px_30px_rgba(206,254,16,0.45)]",
  secondary:
    "bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-[0_8px_20px_rgba(0,0,0,0.35)]",
  ghost:
    "bg-transparent border border-[#CEFE10]/40 text-[#CEFE10] hover:bg-[#CEFE10]/10",
  danger:
    "bg-gradient-to-b from-[#FF5F6D] via-[#ff3b4a] to-[#C81D25] text-white shadow-[0_10px_25px_rgba(255,71,87,0.35)] hover:shadow-[0_15px_35px_rgba(255,71,87,0.4)]",
  success:
    "bg-gradient-to-b from-[#7CFFBE] via-[#4dff9a] to-[#00C97D] text-black shadow-[0_10px_25px_rgba(0,201,125,0.35)] hover:shadow-[0_15px_35px_rgba(0,201,125,0.45)]",
};

type GameButtonProps = {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button">;

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      asChild = false,
      className,
      style,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const cutMap: Record<keyof typeof sizeClasses, number> = {
      sm: 12,
      md: 14,
      lg: 18,
    };
    const cutSize = cutMap[size];

    const sharedClassName = clsx(
      "relative inline-flex items-center justify-center gap-2 rounded-2xl font-semibold uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CEFE10]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0 text-center",
      sizeClasses[size],
      variantClasses[variant],
      className,
    );

    const shapeStyle: CSSProperties = {
      clipPath: `polygon(${cutSize}px 0%, 100% 0%, 100% calc(100% - ${cutSize}px), calc(100% - ${cutSize}px) 100%, 0% 100%, 0% ${cutSize}px)`,
      ...style,
    };

    if (asChild) {
      return (
        <Comp ref={ref} className={sharedClassName} style={shapeStyle} {...props} />
      );
    }

    return (
      <Comp
        ref={ref}
        className={sharedClassName}
        style={shapeStyle}
        disabled={disabled}
        type={type}
        {...props}
      />
    );
  },
);

GameButton.displayName = "GameButton";
