import { luminance, hex2oklch, convert } from "colorizr";

export const oklchToHex = (oklch: string): string => {
  return convert(oklch, "hex");
};

export const hexToOklch = (hex: string): string => {
  const oklch = hex2oklch(hex);
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
};

export const getLuminance = (color: string): number => {
  return luminance(color);
};

export const shouldBeLight = (color: string): boolean => {
  return getLuminance(color) > 0.5;
};
