import { Skeleton } from "@/components/ui/skeleton";
import { SUGGESTION_COUNTS, SuggestionsContext } from "@/lib/suggestions";
import { cn } from "@/lib/utils";

interface ExploreCategoriesSkeletonProps {
  context: SuggestionsContext;
  className?: string;
}

export const ExploreCategoriesSkeleton = ({
  context,
  className,
}: ExploreCategoriesSkeletonProps) => {
  const amount = SUGGESTION_COUNTS[context];

  return (
    <div className={cn("mx-auto space-y-6", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: amount }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-lg"
          >
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
