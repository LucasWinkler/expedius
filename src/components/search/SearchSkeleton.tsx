import { PlaceCardSkeleton } from "../skeletons/PlaceCardSkeleton";
import { cn } from "@/lib/utils";
interface SearchSkeletonProps {
  count?: number;
  className?: string;
}

export const SearchSkeleton = ({
  count = 12,
  className,
}: SearchSkeletonProps) => {
  return (
    <div
      className={cn(
        "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} showActions />
      ))}
    </div>
  );
};
