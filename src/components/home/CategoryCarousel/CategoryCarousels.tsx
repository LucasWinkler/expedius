"use client";

import { FEATURED_SECTIONS } from "@/constants";
import { CategoryCarousel } from "./CategoryCarousel";
import { LocationProvider } from "@/contexts/LocationContext";

export const CategoryCarousels = () => {
  return (
    <LocationProvider>
      <section className="container mx-auto space-y-12 px-4 py-8 md:py-12">
        {FEATURED_SECTIONS.map(({ title, query }) => {
          return <CategoryCarousel key={title} title={title} query={query} />;
        })}
      </section>
    </LocationProvider>
  );
};
