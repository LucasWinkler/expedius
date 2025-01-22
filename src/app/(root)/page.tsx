import { Suspense } from "react";
import SearchBar from "@/components/discover/SearchBar";
import { ArrowRight } from "lucide-react";
import FeaturedSectionSkeleton from "@/components/discover/FeaturedSectionSkeleton";
import type { Metadata } from "next";
import {
  getPopularAttractions,
  getPopularCityPlaces,
  getBestRatedRestaurants,
} from "@/server/services/places";
import FeaturedSection from "@/components/discover/FeaturedSection";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Find Your Next Adventure | PoiToGo",
};
const FeaturedSections = async () => {
  const sections = [
    {
      title: "Best Rated Restaurants",
      fetch: getBestRatedRestaurants,
      emptyMessage: "Discover top-rated restaurants",
    },
    {
      title: "Popular Attractions",
      fetch: getPopularAttractions,
      emptyMessage: "Find interesting places to visit",
    },
    {
      title: "Local Parks",
      fetch: getPopularCityPlaces,
      emptyMessage: "Explore local parks near you",
    },
  ];

  return (
    <div className="space-y-12">
      {await Promise.all(
        sections.map(async ({ title, fetch, emptyMessage }) => {
          try {
            const places = await fetch();

            return (
              <FeaturedSection
                key={title}
                title={title}
                places={places}
                emptyMessage={emptyMessage}
              />
            );
          } catch {
            return <FeaturedSectionError key={title} title={title} />;
          }
        }),
      )}
    </div>
  );
};

const FeaturedSectionError = ({ title }: { title: string }) => {
  return (
    <section className="py-4">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <Card className="flex h-48 items-center justify-center text-muted-foreground">
        Failed to load {title.toLowerCase()}. Please try again later.
      </Card>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <div className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Find Your Next Adventure
            </h1>
            <p className="mt-3 text-base text-muted-foreground md:mt-4 md:text-lg">
              Discover local favorites, hidden gems, and must-visit spots around
              the world
            </p>
            <div className="mt-6 md:mt-8">
              <SearchBar />
            </div>
            <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-1">
              <span>Suggestions:</span>
              <div className="flex flex-wrap justify-center gap-2 sm:space-x-2">
                {["Pizza in New York", "Coffee shops", "Parks near me"].map(
                  (suggestion) => (
                    <a
                      key={suggestion}
                      href={`/discover?q=${encodeURIComponent(suggestion)}`}
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      {suggestion}
                      <ArrowRight className="ml-1 size-3" />
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<FeaturedSectionSkeleton />}>
          <FeaturedSections />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
