"use client";

import { HOME_CATEGORIES } from "@/constants";
import { CategoryCarousel } from "./";

export const CategoryCarousels = () => {
  return (
    <section className="container mx-auto space-y-12 px-4 pb-16 pt-6 md:pb-24 md:pt-8">
      <div className="mb-8 text-center md:mb-16">
        <h2 className="text-balance text-3xl font-semibold lg:text-4xl">
          Featured categories
        </h2>
        <p className="mt-4 text-muted-foreground">
          Browse popular categories to jumpstart your exploration
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
