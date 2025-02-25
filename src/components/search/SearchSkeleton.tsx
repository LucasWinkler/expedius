import { PlaceCardSkeleton } from "../skeletons/PlaceCardSkeleton";

interface SearchSkeletonProps {
  count?: number;
}

export const SearchSkeleton = ({ count = 12 }: SearchSkeletonProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} showActions />
      ))}
    </div>
  );
};
