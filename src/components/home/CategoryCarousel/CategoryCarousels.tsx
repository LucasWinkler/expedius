"use client";

import { FEATURED_SECTIONS } from "@/constants";
import { CategoryCarousel } from "./CategoryCarousel";
import { LocationProvider } from "@/contexts/LocationContext";

export const CategoryCarousels = () => {
  return (
    <LocationProvider>
      <div className="space-y-12">
        {FEATURED_SECTIONS.map(({ title, query }) => {
          return <CategoryCarousel key={title} title={title} query={query} />;
        })}
      </div>
    </LocationProvider>
  );
};
