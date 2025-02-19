"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface PlaceCardSkeletonProps {
  showActions?: boolean;
}

export const PlaceCardSkeleton = ({
  showActions = false,
}: PlaceCardSkeletonProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow">
      <Skeleton className="mb-4 aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="flex justify-between">
          <Skeleton className="mb-4 h-4 w-3/4" />
          <Skeleton className="h-4 w-1/12" />
        </div>
        <Skeleton className="mb-2 h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      {showActions && (
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      )}
    </div>
  );
};
