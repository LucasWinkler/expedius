"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlaceCard } from "../../places/PlaceCard";
import { useInView } from "react-intersection-observer";
import { CategoryCarouselSkeleton } from "./CategoryCarouselSkeleton";
import { NoPlaceResults } from "../../places/NoPlaceResults";
import { CategoryHeader } from "./CategoryHeader";
import { CarouselDots } from "./CarouselDots";
import { useCarouselState } from "@/hooks/useCarouselState";
import { useCategoryPlaces } from "@/hooks/categories";
import { LikeButton } from "@/components/places/LikeButton";
import { SaveToListButton } from "@/components/places/SaveToListButton";

interface CategoryCarouselProps {
  title: string;
  query: string;
}

export const CategoryCarousel = ({ title, query }: CategoryCarouselProps) => {
  const { currentSnapPoint, snapPointCount, api, setApi } = useCarouselState();

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: "100px 0px",
  });

  const { data, isPending, isError } = useCategoryPlaces({
    query,
    enabled: inView,
  });

  return (
    <section className="space-y-2" ref={ref}>
      <CategoryHeader title={title} />
      {isPending ? (
        <CategoryCarouselSkeleton />
      ) : isError || !data?.places?.length ? (
        <NoPlaceResults isError={isError} />
      ) : (
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          setApi={setApi}
          className="relative w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {data.places.map((place, index) => (
              <CarouselItem
                key={place.id}
                className="basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3"
              >
                <PlaceCard
                  place={place}
                  priority={index < 3}
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
          <CarouselPrevious className="absolute -left-3 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background" />
          <CarouselNext className="absolute -right-3 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background" />
          <CarouselDots
            count={snapPointCount}
            currentIndex={currentSnapPoint - 1}
            onDotClick={(index) => api?.scrollTo(index)}
          />
        </Carousel>
      )}
    </section>
  );
};
