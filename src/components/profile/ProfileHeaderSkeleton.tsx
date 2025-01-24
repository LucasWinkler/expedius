import { Skeleton } from "@/components/ui/skeleton";

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col items-center md:flex-row md:items-center">
        <Skeleton className="size-32 rounded-full" />
        <div className="mt-4 md:ml-6 md:mt-0">
          <div className="flex flex-col items-center md:items-start">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>

          <div className="mt-2 flex justify-center space-x-4 md:justify-start">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
