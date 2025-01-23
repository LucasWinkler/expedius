import { Skeleton } from "../ui/skeleton";

export const SearchSkeleton = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="mb-4 aspect-[4/3] w-full" />
          <div className="flex justify-between">
            <Skeleton className="mb-4 h-4 w-3/4" />
            <Skeleton className="h-4 w-1/12" />
          </div>
          <Skeleton className="mb-2 h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;
