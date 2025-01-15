"use client";

import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorSwatchProps = {
  color: string;
  selected: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  isCustom?: boolean;
};

const iconClassNames = "mx-auto h-4 w-4 text-white";

export const ColorSwatch = ({
  color,
  selected,
  onClick,
  icon: Icon,
  isCustom,
}: ColorSwatchProps) => {
  return (
    <button
      type="button"
      className={cn(
        "h-8 w-8 rounded-md border transition-all hover:scale-110",
        selected && "ring-2 ring-primary ring-offset-2",
      )}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={
        isCustom
          ? "Open color picker to choose custom color"
          : `Select ${color} color for list card`
      }
      aria-pressed={selected}
      role="radio"
    >
      {selected ? (
        <Check className={iconClassNames} />
      ) : (
        Icon && <Icon className={iconClassNames} />
      )}
    </button>
  );
};
