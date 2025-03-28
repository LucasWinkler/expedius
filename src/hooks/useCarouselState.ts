import { CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

export const useCarouselState = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);
  const [snapPointCount, setSnapPointCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateSnapPoints = () => {
      setSnapPointCount(api.scrollSnapList().length);
      setCurrentSnapPoint(api.selectedScrollSnap() + 1);
    };

    updateSnapPoints();

    api.on("select", () => {
      setCurrentSnapPoint(api.selectedScrollSnap() + 1);
    });

    api.on("resize", updateSnapPoints);

    return () => {
      api.off("select", () => {
        setCurrentSnapPoint(api.selectedScrollSnap() + 1);
      });
      api.off("resize", updateSnapPoints);
    };
  }, [api]);

  return { api, setApi, currentSnapPoint, snapPointCount };
};
