"use client";

import { CategoryCard } from "./CategoryCard";

// Placeholder will replace with personalized categories
const FEATURED_CATEGORIES = [
  {
    title: "Tourist Attractions",
    query: "tourist attractions",
    imageUrl: "/place-image-fallback.webp",
  },
  {
    title: "Local Restaurants",
    query: "restaurants",
    imageUrl: "/place-image-fallback.webp",
  },
  {
    title: "Coffee Shops",
    query: "coffee shops",
    imageUrl: "/place-image-fallback.webp",
  },
  {
    title: "Parks & Recreation",
    query: "parks",
    imageUrl: "/place-image-fallback.webp",
  },
  {
    title: "Museums & Galleries",
    query: "museums",
    imageUrl: "/place-image-fallback.webp",
  },
  {
    title: "Shopping",
    query: "shopping",
    imageUrl: "/place-image-fallback.webp",
  },
];

export const DiscoverEmptyState = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">
        Popular Categories
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {FEATURED_CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.title}
            title={category.title}
            query={category.query}
            imageUrl={category.imageUrl}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
