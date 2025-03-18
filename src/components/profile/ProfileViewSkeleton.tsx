import { Skeleton } from "@/components/ui/skeleton";
import { ListCardSkeleton } from "../skeletons/ListCardSkeleton";

export const ProfileViewSkeleton = () => (
  <div className="container mx-auto px-4 py-8 md:max-w-3xl">
    <div className="mb-8 flex items-center justify-between">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
      <Skeleton className="h-10 w-24 rounded-full" />
    </div>
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <ListCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
