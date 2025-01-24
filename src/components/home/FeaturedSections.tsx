import FeaturedSection from "@/components/home/FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionError";
import { searchPlaces } from "@/server/services/places";

export const FEATURED_SECTIONS = [
  {
    title: "Best Rated Restaurants",
    fetch: () => searchPlaces("best rated restaurants near me", 5),
    emptyMessage: "No restaurants found in your area",
  },
  {
    title: "Popular Attractions",
    fetch: () =>
      searchPlaces("famous landmarks and tourist attractions near me", 5),
    emptyMessage: "No attractions found in your area",
  },
  {
    title: "Local Parks",
    fetch: () => searchPlaces("popular parks near me", 5),
    emptyMessage: "No parks found in your area",
  },
] as const;

const FeaturedSections = async () => {
  return (
    <div className="space-y-12">
      {await Promise.all(
        FEATURED_SECTIONS.map(async ({ title, fetch, emptyMessage }) => {
          try {
            const places = await fetch();

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
