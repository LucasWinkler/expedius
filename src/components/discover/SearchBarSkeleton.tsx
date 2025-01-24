import { Skeleton } from "../ui/skeleton";

export const SearchBarSkeleton = () => {
  return (
    <div className="relative w-full">
      <Skeleton className="h-[50px] w-full rounded-full shadow-lg" />
    </div>
  );
};

export default SearchBarSkeleton;
