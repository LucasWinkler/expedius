import FeaturedSection from "@/components/home/FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionError";
import { searchPlaces } from "@/server/services/places";
import { FEATURED_SECTIONS } from "@/constants";

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
