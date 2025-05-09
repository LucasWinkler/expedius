"use client";

import { HOME_CATEGORIES } from "@/constants";
import { CategoryCarousel } from ".";
import { Badge } from "@/components/ui/badge";

export const HomeCarousels = () => {
  return (
    <section className="container mx-auto space-y-12 px-4 pb-16 pt-6 md:pb-24 md:pt-8">
      <div className="mb-8 text-center md:mb-16">
        <Badge variant="eyebrow" className="mb-3">
          Categories
        </Badge>
        <h2 className="text-balance text-3xl font-semibold lg:text-4xl">
          Explore by category
        </h2>
        <p className="mt-4 text-muted-foreground">
          Find local places by type to get started with your exploration
        </p>
      </div>
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
  );
};
