import { Skeleton } from "@/components/ui/skeleton";
import { PERSONALIZATION_CONFIG } from "@/lib/suggestions";
import { cn } from "@/lib/utils";

export function SuggestionSkeleton() {
  // Simple set of widths to ensure proper wrapping (first item short to guarantee 3+2 layout)
  const widthVariations = [
    "w-20", // Extra short (first item - helps ensure 3+2 layout)
    "w-24", // Medium
    "w-28", // Medium-short
    "w-20", // Extra long
    "w-36", // Long
  ];

  return (
    <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
      {Array.from({ length: PERSONALIZATION_CONFIG.MAX_SUGGESTIONS }).map(
        (_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-7 rounded-full sm:h-8 md:h-9 lg:h-9 xl:h-9 2xl:h-10",
              widthVariations[i % widthVariations.length],
            )}
          />
        ),
      )}
    </div>
  );
}
