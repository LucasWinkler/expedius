import { Skeleton } from "@/components/ui/skeleton";

export const ProfileHeaderSkeleton = () => (
  <header className="w-full">
    <div className="relative h-48 w-full bg-muted">
      <div className="container mx-auto flex justify-end gap-2 px-4 pt-6 md:max-w-3xl">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>

    <div className="container relative mx-auto -mt-20 flex w-full flex-col items-center px-4 pb-4 md:max-w-3xl">
      <Skeleton className="size-40 rounded-full border-4 border-background" />
      <div className="mt-4 flex flex-col items-center gap-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3 max-w-md" />
      <div className="mt-6 flex justify-center gap-8">
        <div className="flex flex-col items-center">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="mt-1 h-4 w-12" />
        </div>
        <div className="flex flex-col items-center">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="mt-1 h-4 w-12" />
        </div>
      </div>
    </div>
  </header>
);
