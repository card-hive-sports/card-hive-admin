'use client';

import {Slot} from "@radix-ui/react-slot";
import clsx from "clsx";
import {ComponentPropsWithoutRef, CSSProperties, forwardRef} from "react";

const variantClasses = {
  neon:
    "bg-gradient-to-br from-[#080808] via-[#0d0d0d] to-[#050505] border border-[#CEFE10]/40",
  glass:
    "bg-white/5 border border-white/15 backdrop-blur-xl",
  danger:
    "bg-gradient-to-br from-[#2b0f13] via-[#3b1116] to-[#1a070a] border border-red-500/40",
  dark:
    "bg-gradient-to-br from-black/60 via-black/40 to-black/70 border border-white/10",
};

type GameCardProps = {
  variant?: keyof typeof variantClasses;
  asChild?: boolean;
  cutSize?: number;
} & ComponentPropsWithoutRef<'div'>;

export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
  (
    { variant = 'glass', asChild = false, cutSize = 18, className, style, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div';
    const fudge = 3;
    const clipPath = `polygon(${cutSize}px -${fudge}px, calc(100% + ${fudge}px) -${fudge}px, calc(100% + ${fudge}px) calc(100% - ${cutSize}px), calc(100% - ${cutSize}px) calc(100% + ${fudge}px), -${fudge}px calc(100% + ${fudge}px), -${fudge}px ${cutSize}px)`;

    const sharedClassName = clsx(
      'relative overflow-hidden rounded-[28px] transition-all duration-300 hover:-translate-y-0.5 focus-within:-translate-y-0.5',
      variantClasses[variant],
      'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-[#CEFE10]/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:pointer-events-none',
      className,
    );

    const shapeStyle: CSSProperties = {
      clipPath,
      ...style,
    };

    if (asChild) {
      return <Comp ref={ref} className={sharedClassName} style={shapeStyle} {...props} />;
    }

    return <Comp ref={ref} className={sharedClassName} style={shapeStyle} {...props} />;
  },
);

GameCard.displayName = 'GameCard';
