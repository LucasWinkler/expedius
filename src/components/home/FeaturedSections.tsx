import FeaturedSection from "@/components/home/FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionError";
import { searchPlaces } from "@/server/services/places";

const FEATURED_SECTIONS: FeaturedSection[] = [
  {
    title: "Best Rated Restaurants",
    query: "best rated restaurants near me",
    emptyMessage: "No restaurants found in your area",
  },
  {
    title: "Popular Attractions",
    query: "famous landmarks and tourist attractions near me",
    emptyMessage: "No attractions found in your area",
  },
  {
    title: "Local Parks",
    query: "popular parks near me",
    emptyMessage: "No parks found in your area",
  },
];

export type FeaturedSection = {
  title: string;
  query: string;
  emptyMessage: string;
};

const FeaturedSections = async () => {
  return (
    <div className="space-y-12">
      {await Promise.all(
        FEATURED_SECTIONS.map(async ({ title, query, emptyMessage }) => {
          try {
            const places = await searchPlaces(query, 5);

            if (!places || places.length === 0) {
              return (
                <FeaturedSectionError
                  key={title}
                  title={title}
                  emptyMessage={emptyMessage}
                />
              );
            }

            return (
              <FeaturedSection key={title} title={title} places={places} />
            );
          } catch {
            return (
              <FeaturedSectionError
                key={title}
                title={title}
                emptyMessage={emptyMessage}
              />
            );
          }
        }),
      )}
    </div>
  );
};

export default FeaturedSections;
