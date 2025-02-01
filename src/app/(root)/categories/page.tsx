import type { Metadata } from "next";
import { ALL_CATEGORIES } from "@/constants";
import { CategoryCard } from "@/components/categories/CategoryCard";

export const metadata: Metadata = {
  title: "Browse Categories",
  description:
    "Explore places by category - restaurants, cafes, bars, and more. Find the perfect spots in your area.",
  openGraph: {
    title: "Browse Categories - PoiToGo",
    description:
      "Explore places by category - restaurants, cafes, bars, and more. Find the perfect spots in your area.",
  },
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Categories</h1>
        <p className="mt-2 text-muted-foreground">Explore places by category</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {ALL_CATEGORIES.map(({ title, query, icon: Icon, description }) => (
          <CategoryCard
            key={title}
            href={`/discover?q=${encodeURIComponent(query)}`}
            title={title}
            icon={Icon}
            description={description}
          />
        ))}
      </div>
    </div>
  );
}
