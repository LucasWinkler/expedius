import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  hex2rgb,
  rgb2oklch,
  hex2oklch,
  luminance,
  textColor,
  convert,
} from "colorizr";
import { FastAverageColor } from "fast-average-color";

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

export const hexToRgb = (hex: string): [number, number, number] => {
  const rgb = hex2rgb(hex);
  return [rgb.r / 255, rgb.g / 255, rgb.b / 255];
};

export const rgbToOklch = (r: number, g: number, b: number): string => {
  const rgb = { r: r * 255, g: g * 255, b: b * 255 };
  const oklch = rgb2oklch(rgb);
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
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

export const getImageAverageColor = async (
  imageUrl: string,
): Promise<{ color: string; isDark: boolean }> => {
  const fac = new FastAverageColor();

  try {
    const result = await fac.getColorAsync(imageUrl);
    const hex = result.hex;
    const isDark = textColor(hex) === "#ffffff";

    return {
      color: hex,
      isDark,
    };
  } catch (error) {
    console.error("Error getting average color:", error);
    return {
      color: "#000000",
      isDark: true,
    };
  }
};
