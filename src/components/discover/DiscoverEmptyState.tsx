"use client";

import { Coffee, MapPin, Compass, Trees } from "lucide-react";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

const POPULAR_CATEGORIES = [
  { icon: Compass, label: "Tourist Attractions", query: "tourist attractions" },
  { icon: MapPin, label: "Local Restaurants", query: "restaurants" },
  { icon: Coffee, label: "Coffee Shops", query: "coffee shops" },
  { icon: Trees, label: "Parks & Recreation", query: "parks" },
];

export const DiscoverEmptyState = () => {
  const router = useRouter();

  const handleCategoryClick = (query: string) => {
    router.push(`/discover?q=${encodeURIComponent(query)}`, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Popular Categories</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_CATEGORIES.map(({ icon: Icon, label, query }) => (
            <Card
              key={label}
              className="group cursor-pointer p-4 transition-all hover:bg-accent"
              onClick={() => handleCategoryClick(query)}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                <span className="font-medium">{label}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Search Tips</h2>
        <Card className="p-4">
          <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
            <li>
              Try searching for specific types of places (e.g., &quot;coffee
              shops&quot;, &quot;parks&quot;)
            </li>
            <li>
              Include neighborhood or area names for better results (e.g.,
              &quot;restaurants in South Congress, Austin&quot;)
            </li>
            <li>Use filters to refine your search results</li>
            <li>Enable location services for nearby recommendations</li>
          </ul>
        </Card>
      </section>
    </div>
  );
};
