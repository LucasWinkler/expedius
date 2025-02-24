import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <article className="flex min-h-screen flex-col items-center">
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
          <Skeleton className="size-40 rounded-full border-4 border-background" />
        </div>
      </div>
      <div className="container relative mx-auto flex w-full flex-col items-center px-4 md:max-w-3xl">
        <div className="mt-24 flex flex-col items-center gap-1">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="mt-4 flex justify-center gap-8">
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
      <div className="container mx-auto mt-8 px-4 md:max-w-3xl">
        <div className="flex items-center gap-2 border-b">
          <div className="flex gap-4 py-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
        <div className="space-y-4 py-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg bg-muted/10"
            >
              <Skeleton className="aspect-[2/1] w-full" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-background/0 p-4">
                <Skeleton className="h-6 w-48" />
                <div className="mt-2 flex items-center gap-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
