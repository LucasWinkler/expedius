"use client";

import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { oklchToHex, hexToOklch } from "@/lib/utils";

type ColorSwatchProps = {
  color: string;
  selected: boolean;
  onClick?: () => void;
  onCustomColorChange?: (color: string) => void;
  isCustom?: boolean;
  disabled?: boolean;
};

const iconClassNames = "mx-auto h-4 w-4 text-white";

export const ColorSwatch = ({
  color,
  selected,
  onClick,
  onCustomColorChange,
  isCustom,
  disabled,
}: ColorSwatchProps) => {
  const hexColor = color.startsWith("oklch") ? oklchToHex(color) : color;

  return isCustom ? (
    <div className="relative size-8">
      <Input
        type="color"
        className="absolute inset-0 size-8 cursor-pointer opacity-0"
        value={hexColor}
        onChange={(e) => onCustomColorChange?.(hexToOklch(e.target.value))}
        disabled={disabled}
        aria-label="Choose custom color"
        role="application"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center rounded-md border transition-all",
          selected && "ring-2 ring-primary ring-offset-2",
        )}
        style={{ backgroundColor: color }}
        aria-hidden="true"
      >
        {selected ? (
          <Check className={iconClassNames} />
        ) : (
          <Palette className={iconClassNames} />
        )}
      </div>
    </div>
  ) : (
    <button
      type="button"
      className={cn(
        "h-8 w-8 rounded-md border transition-all hover:scale-110",
        selected && "ring-2 ring-primary ring-offset-2",
      )}
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={`Select ${color} color for list card`}
      aria-checked={selected}
      role="radio"
      disabled={disabled}
    >
      {selected && <Check className={iconClassNames} />}
    </button>
  );
};
