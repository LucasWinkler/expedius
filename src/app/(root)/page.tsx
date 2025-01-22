import { Suspense } from "react";
import FeaturedSectionSkeleton from "@/components/discover/FeaturedSectionSkeleton";
import type { Metadata } from "next";
import {
  getPopularAttractions,
  getPopularCityPlaces,
  getBestRatedRestaurants,
} from "@/server/services/places";
import FeaturedSection from "@/components/discover/FeaturedSection";
import { Card } from "@/components/ui/card";
import HeaderWithSearch from "@/components/discover/HeaderWithSearch";

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
      <HeaderWithSearch />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<FeaturedSectionSkeleton />}>
          <FeaturedSections />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
