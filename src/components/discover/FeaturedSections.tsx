import {
  getPopularAttractions,
  getPopularCityPlaces,
  getBestRatedRestaurants,
} from "@/server/services/places";
import FeaturedSection from "@/components/discover/FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionError";

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

export default FeaturedSections;
