"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceCard, NoPlaceResults } from "@/components/places";
import { useInView } from "react-intersection-observer";
import { CategoryCarouselSkeleton, CategoryHeader } from "./";
import { CarouselDots } from "@/components/ui/carousel";
import { useCarouselState, useCategoryPlaces } from "@/hooks";
import { LikeButton, SaveToListButton } from "@/components/places";
import type { LucideIcon } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { CarouselDotsSkeleton } from "@/components/skeletons/CarouselDotsSkeleton";
import { AlertCircle, Clock } from "lucide-react";

interface CategoryCarouselProps {
  title: string;
  query: string;
  icon: LucideIcon;
}

export const CategoryCarousel = ({
  title,
  query,
  icon: Icon,
}: CategoryCarouselProps) => {
  const { currentSnapPoint, snapPointCount, api, setApi } = useCarouselState();
  const [dotsLoaded, setDotsLoaded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const { data, isPending, isError, error } = useCategoryPlaces({
    query,
    enabled: inView,
  });

  const isQuotaError =
    error instanceof Error && error.message?.includes("Too Many Requests");

  useEffect(() => {
    if (snapPointCount > 0) {
      setDotsLoaded(true);
    }
  }, [snapPointCount]);

  useEffect(() => {
    if (!isQuotaError) return;

    const calculateTimeToReset = () => {
      const now = new Date();
      const pacificDate = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
      );
      const tomorrow = new Date(pacificDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diffMs = tomorrow.getTime() - pacificDate.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    };

    setTimeRemaining(calculateTimeToReset());

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeToReset());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [isQuotaError]);

  return (
    <section className="space-y-2" ref={ref}>
      <CategoryHeader title={title} icon={Icon} />
      {isPending ? (
        <CategoryCarouselSkeleton />
      ) : isError ? (
        isQuotaError ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">API Quota Exceeded</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              We&apos;ve reached our daily limit for Google Places API requests.
              The quota will reset at midnight Pacific Time.
            </p>
            {timeRemaining && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-amber-700">
                <Clock className="h-5 w-5" />
                <span>Resets in approximately {timeRemaining}</span>
              </div>
            )}
          </div>
        ) : (
          <NoPlaceResults isError={true} />
        )
      ) : !data?.places?.length ? (
        <NoPlaceResults />
      ) : (
        <Fragment>
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {data.places.map((place) => (
                <CarouselItem
                  key={place.id}
                  className="basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <PlaceCard
                    place={place}
                    actions={
                      <>
                        <LikeButton placeId={place.id} />
                        <SaveToListButton placeId={place.id} />
                      </>
                    }
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <div className="flex justify-center">
                {snapPointCount > 0 && dotsLoaded ? (
                  <CarouselDots
                    count={snapPointCount}
                    currentIndex={currentSnapPoint}
                    onDotClick={(index) => api?.scrollTo(index)}
                  />
                ) : (
                  <CarouselDotsSkeleton />
                )}
                <div className="-mt-2 flex items-center gap-1">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </div>
            </div>
          </Carousel>
          <div className="flex justify-center pt-2 md:hidden">
            {snapPointCount > 0 && dotsLoaded ? (
              <CarouselDots
                count={snapPointCount}
                currentIndex={currentSnapPoint}
                onDotClick={(index) => api?.scrollTo(index)}
              />
            ) : (
              <CarouselDotsSkeleton />
            )}
          </div>
        </Fragment>
      )}
    </section>
  );
};
