import { Skeleton } from "@/components/ui/skeleton";

export const CarouselDotsSkeleton = () => {
  return (
    <div className="my-1 flex h-6 items-center justify-center gap-1">
      <div className="flex gap-1 sm:hidden">
        <Skeleton className="h-2 w-4 rounded-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-2 w-2 rounded-full" />
        ))}
      </div>

      <div className="hidden gap-1 sm:flex md:hidden">
        <Skeleton className="h-3 w-6 rounded-full" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-3 rounded-full" />
        ))}
      </div>

      <div className="hidden gap-1 md:flex">
        <Skeleton className="h-3 w-6 rounded-full" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-3 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default CarouselDotsSkeleton;
