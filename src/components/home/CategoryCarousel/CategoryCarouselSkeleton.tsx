import { Skeleton } from "@/components/ui/skeleton";
import { PlaceCardSkeleton } from "@/components/skeletons/PlaceCardSkeleton";

const CategoryCarouselSkeletonCard = () => {
  return <PlaceCardSkeleton showActions />;
};

export const CategoryCarouselSkeleton = () => {
  return (
    <div className="relative">
      <div className="-ml-2 flex md:-ml-4">
        <div className="basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3">
          <CategoryCarouselSkeletonCard />
        </div>
        <div className="hidden pl-2 sm:block sm:basis-1/2 md:pl-4 lg:basis-1/3">
          <CategoryCarouselSkeletonCard />
        </div>
        <div className="hidden pl-2 md:pl-4 lg:block lg:basis-1/3">
          <CategoryCarouselSkeletonCard />
        </div>
      </div>
      <div className="flex justify-center gap-1 py-2">
        <Skeleton className="h-2 w-4 rounded-full sm:h-3 sm:w-6" />
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-2 w-2 rounded-full sm:h-3 sm:w-3"
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCarouselSkeleton;
