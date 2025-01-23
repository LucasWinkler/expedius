import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const getLuminance = (hexColor: string): number => {
  const hex = hexColor.replace("#", "");
  const [r, g, b] = [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];

  const toSRGB = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toSRGB(r) + 0.7152 * toSRGB(g) + 0.0722 * toSRGB(b);
};

export const shouldUseWhiteText = (hexColor: string): boolean => {
  const luminance = getLuminance(hexColor);
  return luminance < 0.6;
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
