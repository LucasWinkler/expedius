"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import type { PlacePhoto } from "@/types";
import { useCarouselState } from "@/hooks";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PlaceImageCarouselProps {
  photos?: PlacePhoto[];
  placeName: string;
}

export function PlaceImageCarousel({
  photos,
  placeName,
}: PlaceImageCarouselProps) {
  const { currentSnapPoint, snapPointCount, api, setApi } = useCarouselState();
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  if (!photos?.length) {
    return null;
  }

  return (
    <div className="relative">
      <Carousel
        className="relative aspect-video w-full overflow-hidden rounded-lg"
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem
              className="relative block aspect-video w-full"
              key={photo.name}
            >
              {!imagesLoaded[photo.name] && (
                <div className="absolute inset-0">
                  <Skeleton className="absolute inset-0 rounded-none" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <Image
                src={`/api/places/photo/${encodeURIComponent(photo.name)}?maxHeightPx=1080&maxWidthPx=1920`}
                alt={`${placeName} photo ${index + 1}`}
                className="object-cover"
                fill
                priority={index === 0}
                unoptimized
                onLoad={() =>
                  setImagesLoaded((prev) => ({ ...prev, [photo.name]: true }))
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {photos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background sm:left-4 sm:size-12"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="size-5 sm:size-6" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background sm:right-4 sm:size-12"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="size-5 sm:size-6" />
              <span className="sr-only">Next slide</span>
            </Button>
          </>
        )}
      </Carousel>
      {photos.length > 1 && (
        <CarouselDots
          count={snapPointCount}
          currentIndex={currentSnapPoint - 1}
          onDotClick={(index) => api?.scrollTo(index)}
          className="mt-2"
        />
      )}
    </div>
  );
}
