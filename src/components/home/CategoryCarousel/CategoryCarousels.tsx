"use client";

import { HOME_CATEGORIES } from "@/constants";
import { CategoryCarousel } from "./CategoryCarousel";
import { LocationProvider } from "@/contexts/LocationContext";

export const CategoryCarousels = () => {
  return (
    <LocationProvider>
      <section className="container mx-auto space-y-12 px-4 py-8 md:py-12">
        {HOME_CATEGORIES.map(({ title, query, icon }) => {
          return (
            <CategoryCarousel
              key={title}
              title={title}
              query={query}
              icon={icon}
            />
          );
        })}
      </section>
    </LocationProvider>
  );
};
