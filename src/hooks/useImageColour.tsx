import { useEffect, useRef, useState } from "react";
import { getImageAverageColor } from "@/lib/utils";

const imageColorCache = new Map<string, { color: string; isDark: boolean }>();

export const useImageColour = (imageUrl: string | null) => {
  const [imageColour, setImageColour] = useState<{
    color: string;
    isDark: boolean;
  } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(!imageUrl);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!imageUrl) {
      setImageColour(null);
      setImageLoaded(true);
      return;
    }

    const cached = imageColorCache.get(imageUrl);
    if (cached) {
      setImageColour(cached);
      return;
    }

    setImageLoaded(false);

    getImageAverageColor(imageUrl)
      .then((result) => {
        if (!isMounted.current) return;
        imageColorCache.set(imageUrl, result);
        setImageColour(result);
      })
      .catch((error) => {
        console.error("Error analyzing image color:", error);
        if (!isMounted.current) return;
        setImageColour(null);
      });
  }, [imageUrl]);

  return {
    imageColour,
    imageLoaded,
    setImageLoaded,
  };
};
