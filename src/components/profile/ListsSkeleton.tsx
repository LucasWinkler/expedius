import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

type ListsSkeletonProps = {
  isOwnProfile: boolean;
};

export const ListsSkeleton = ({ isOwnProfile }: ListsSkeletonProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-8 w-24" />
        {isOwnProfile && <Skeleton className="h-9 w-[100px]" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isOwnProfile && (
            <div className="w-full">
              <Skeleton className="h-40 w-full" />
            </div>
          )}

          {isOwnProfile && (
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <Skeleton className="h-[1px] w-full" />
              </div>
              <div className="relative flex justify-center">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(isOwnProfile ? 4 : 2)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
