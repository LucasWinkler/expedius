import { PlaceCardSkeleton } from "@/components/skeletons/PlaceCardSkeleton";
import { CarouselDotsSkeleton } from "@/components/skeletons/CarouselDotsSkeleton";

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
      <CarouselDotsSkeleton />
    </div>
  );
};

export default CategoryCarouselSkeleton;
