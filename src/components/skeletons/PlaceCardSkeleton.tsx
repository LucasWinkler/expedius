import { Skeleton } from "@/components/ui/skeleton";

interface PlaceCardSkeletonProps {
  showActions?: boolean;
}

export const PlaceCardSkeleton = ({
  showActions = false,
}: PlaceCardSkeletonProps) => {
  return (
    <div className="group list-none">
      <div className="relative overflow-hidden rounded-xl border bg-muted shadow-none">
        <div className="relative m-4 overflow-hidden rounded-lg">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        </div>
        <div className="p-4 pt-0">
          <div className="mb-3 flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="mb-4">
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex flex-col gap-1.5 pb-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {showActions && (
          <div className="absolute right-6 top-6 flex flex-col gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
