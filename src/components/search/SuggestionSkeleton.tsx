import { Skeleton } from "@/components/ui/skeleton";
import { SUGGESTION_COUNTS, SuggestionsContext } from "@/lib/suggestions";
import { cn } from "@/lib/utils";

interface SuggestionSkeletonProps {
  context: SuggestionsContext;
}

export function SuggestionSkeleton({ context }: SuggestionSkeletonProps) {
  const widthVariations = ["w-20", "w-24", "w-28", "w-20", "w-36"];
  const count = SUGGESTION_COUNTS[context];

  return (
    <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-7 rounded-full sm:h-8 md:h-9 lg:h-9 xl:h-9 2xl:h-10",
            widthVariations[i % widthVariations.length],
          )}
        />
      ))}
    </div>
  );
}
