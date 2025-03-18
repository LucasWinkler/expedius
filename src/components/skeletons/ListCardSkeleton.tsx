import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ListCardSkeleton = () => (
  <Card className="relative overflow-hidden border-0 bg-muted/50">
    <article className="relative flex flex-col xs:flex-row">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl p-5 xs:w-48 sm:w-60 md:w-72">
        <Skeleton className="aspect-[4/3] h-full w-full rounded-lg" />
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </article>
  </Card>
);
