"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface PlaceDetailsCarouselProps {
  photos?: PlacePhoto[];
  placeName: string;
  showThumbnails?: boolean;
}

export function PlaceDetailsCarousel({
  photos,
  placeName,
  showThumbnails = true,
}: PlaceDetailsCarouselProps) {
  const { currentSnapPoint, snapPointCount, api, setApi } = useCarouselState();
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState<
    Record<string, boolean>
  >({});

  if (!photos?.length) {
    return null;
  }

  return (
    <div className="relative">
      <Carousel
        className="relative w-full overflow-hidden rounded-lg"
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {photos.map((photo, index) => (
            <CarouselItem
              className="relative aspect-video w-full select-none"
              key={photo.name}
            >
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                {!imagesLoaded[photo.name] && (
                  <div className="absolute inset-0 z-10">
                    <Skeleton className="h-full w-full rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-8 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <Image
                  src={`/api/places/photo/${encodeURIComponent(photo.name)}?maxHeightPx=480&maxWidthPx=850`}
                  alt={`${placeName} photo ${index + 1}`}
                  className="h-full w-full rounded-lg object-cover"
                  fill
                  priority={index === 0}
                  unoptimized
                  onLoad={() =>
                    setImagesLoaded((prev) => ({ ...prev, [photo.name]: true }))
                  }
                />
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-black/50 to-transparent" />
                {photo.authorAttributions && (
                  <div className="absolute left-2 right-2 top-2 z-30 rounded bg-black/60 px-2 py-1 text-[10px] text-white/90 sm:text-xs">
                    <p className="line-clamp-2">
                      Photo by{" "}
                      {photo.authorAttributions.map((author, i) => (
                        <a
                          key={author.uri}
                          href={author.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {author.displayName}
                          {i < photo.authorAttributions.length - 1 ? ", " : ""}
                        </a>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {photos.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50 sm:left-4 sm:size-12"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="size-5" />
              <span className="sr-only">Previous slide</span>
            </button>
            <button
              className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50 sm:right-4 sm:size-12"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="size-5" />
              <span className="sr-only">Next slide</span>
            </button>

            <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center">
              <CarouselDots
                buttonVariant="image-carousel"
                count={snapPointCount}
                currentIndex={currentSnapPoint - 1}
                onDotClick={(index) => api?.scrollTo(index)}
              />
            </div>
          </>
        )}
      </Carousel>
      {showThumbnails && photos.length > 1 && (
        <div className="scrollbar-thin mt-4 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {photos.map((photo, index) => (
              <button
                key={`thumb-${photo.name}`}
                className={cn(
                  "relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all",
                  currentSnapPoint === index + 1
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50",
                )}
                onClick={() => api?.scrollTo(index)}
                aria-label={`View ${placeName} photo ${index + 1}`}
              >
                {!thumbnailsLoaded[photo.name] && (
                  <div className="absolute inset-0">
                    <Skeleton className="absolute inset-0 rounded-none" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <Image
                  src={`/api/places/photo/${encodeURIComponent(photo.name)}?maxHeightPx=80&maxWidthPx=120`}
                  alt={`${placeName} thumbnail ${index + 1}`}
                  className="object-cover"
                  fill
                  unoptimized
                  onLoad={() =>
                    setThumbnailsLoaded((prev) => ({
                      ...prev,
                      [photo.name]: true,
                    }))
                  }
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
