import { FEATURED_SECTIONS } from "@/constants";
import FeaturedSection from "@/components/home/FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionError";

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
