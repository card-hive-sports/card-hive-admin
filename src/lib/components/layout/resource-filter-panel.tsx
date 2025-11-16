'use client';

import {ReactNode} from "react";
import {clsx} from "clsx";
import {GameButton} from "@/lib/ui";

export interface ResourceFilterPanelSection {
  id: string;
  label: ReactNode;
  control: ReactNode;
  helperText?: ReactNode;
}

export interface ResourceFilterPanelProps {
  sections: ResourceFilterPanelSection[];
  onClear?: () => void;
  clearLabel?: ReactNode;
  primaryAction?: {
    label: ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
    size?: "sm" | "md" | "lg";
  };
  className?: string;
}

export const ResourceFilterPanel = ({
  sections,
  onClear,
  clearLabel = "Clear filters",
  primaryAction,
  className,
}: ResourceFilterPanelProps) => {
  return (
    <div className={clsx("space-y-4", className)}>
      {sections.map((section) => (
        <div key={section.id}>
          <label className="block text-white/70 text-sm font-medium mb-2">{section.label}</label>
          {section.control}
          {section.helperText && (
            <p className="text-white/40 text-xs mt-2">{section.helperText}</p>
          )}
        </div>
      ))}

      {primaryAction && (
        <GameButton
          size={primaryAction.size ?? "sm"}
          variant={primaryAction.variant ?? "primary"}
          className="w-full normal-case"
          onClick={primaryAction.onClick}
        >
          {primaryAction.label}
        </GameButton>
      )}

      {onClear && (
        <div className="border-t border-white/10 pt-4">
          <GameButton
            size="sm"
            variant="ghost"
            className="w-full normal-case text-xs justify-center"
            onClick={onClear}
          >
            {clearLabel}
          </GameButton>
        </div>
      )}
    </div>
  );
};
