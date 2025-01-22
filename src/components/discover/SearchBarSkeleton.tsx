import { Skeleton } from "../ui/skeleton";

export const SearchBarSkeleton = () => {
  return (
    <div className="flex w-full gap-2">
      <Skeleton className="h-10 flex-1 rounded-md" />
      <Skeleton className="h-10 w-24 rounded-md" />
    </div>
  );
};

export default SearchBarSkeleton;
