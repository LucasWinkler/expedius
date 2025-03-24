import { Skeleton } from "@/components/ui/skeleton";
import { SUGGESTION_COUNTS, SuggestionsContext } from "@/lib/suggestions";

interface ExploreCategoriesSkeletonProps {
  context: SuggestionsContext;
}

export const ExploreCategoriesSkeleton = ({
  context,
}: ExploreCategoriesSkeletonProps) => {
  const amount = SUGGESTION_COUNTS[context];

  return (
    <div className="mx-auto mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: amount }).map((_, i) => (
          <div key={i} className="relative aspect-[4/3]">
            <Skeleton className="absolute inset-0 rounded-lg" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
