"use client";

import { FeaturedSection } from "./FeaturedSection";
import { FeaturedSectionError } from "./FeaturedSectionNoResults";
import { FeaturedSectionSkeleton } from "./FeaturedSectionSkeleton";
import { useFeaturedSections } from "@/hooks/useFeaturedSections";

const FeaturedSections = () => {
  const sections = useFeaturedSections();

  return (
    <div className="space-y-12">
      {sections.map(({ title, response, isPending, isError }) => {
        if (isPending) {
          return <FeaturedSectionSkeleton key={title} title={title} />;
        }

        if (isError || !response?.places?.length) {
          return (
            <FeaturedSectionError key={title} title={title} isError={isError} />
          );
        }

        return <FeaturedSection key={title} title={title} data={response} />;
      })}
    </div>
  );
};

export default FeaturedSections;
