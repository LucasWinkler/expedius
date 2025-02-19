import { PlaceCardSkeleton } from "../skeletons/PlaceCardSkeleton";

export const SearchSkeleton = () => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <PlaceCardSkeleton key={i} showActions />
      ))}
    </div>
  );
};
