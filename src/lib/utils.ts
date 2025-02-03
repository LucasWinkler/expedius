import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hex2oklch, luminance, convert } from "colorizr";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getPlacePhotoUrl = (
  photoRef: string,
  width = 400,
  height = 400,
) => {
  const encodedRef = encodeURIComponent(photoRef);
  return `/api/places/photo/${encodedRef}?maxHeightPx=${height}&maxWidthPx=${width}`;
};

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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

export const getPriceLevelDisplay = (level?: string): string | null => {
  const priceLevelMap: Record<string, string> = {
    PRICE_LEVEL_FREE: "Free",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  };

  return level ? priceLevelMap[level] : null;
};
