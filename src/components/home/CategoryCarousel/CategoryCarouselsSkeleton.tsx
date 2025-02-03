import { Skeleton } from "@/components/ui/skeleton";
import { CategoryCarouselSkeleton } from "./CategoryCarouselSkeleton";

export const CategoryCarouselsSkeleton = () => {
  return (
    <section className="container mx-auto space-y-12 px-4 py-8 md:py-12">
      {[1, 2, 3].map((index) => (
        <div key={index} className="space-y-8">
          <div className="container">
            <Skeleton className="h-8 w-48" />
          </div>
          <CategoryCarouselSkeleton />
        </div>
      ))}
    </section>
  );
};
