import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function PlaceDetailsSkeleton() {
  return (
    <article className="container relative mx-auto px-4 py-8 sm:space-y-8 md:py-12 xl:max-w-7xl xl:space-y-12 xl:py-16">
      <div className="mb-4 space-y-2">
        <Skeleton className="h-8 w-2/3 sm:h-9" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-6 lg:w-2/3">
          <Skeleton className="aspect-video w-full rounded-lg" />

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 md:gap-4">
            <Skeleton className="col-span-2 h-9 w-28 rounded-md sm:col-span-1" />

            <div className="col-span-2 grid grid-cols-3 gap-2 sm:col-span-1 sm:flex sm:flex-wrap sm:items-center">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </div>
          </div>

          <Card className="p-6">
            <Skeleton className="mb-4 h-7 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </Card>

          <div className="lg:hidden">
            <Card className="p-6">
              <Skeleton className="mb-4 h-7 w-32" />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="mt-2 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="mt-3 h-8 w-full rounded-md sm:w-36" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <Skeleton className="mb-4 h-7 w-32" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="size-2 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-3 h-8 w-full rounded-md sm:w-36" />
          </Card>

          <Card className="p-6">
            <Skeleton className="mb-4 h-7 w-32" />
            <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
              <Skeleton className="h-full w-full" />
            </div>
            <Skeleton className="h-4 w-5/6" />
          </Card>

          <div className="lg:hidden">
            <Card className="p-6">
              <Skeleton className="mb-4 h-7 w-40" />
              <Skeleton className="mb-4 h-8 w-64 rounded-md" />
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Skeleton key={j} className="h-4 w-4" />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                    </div>
                    {i < 1 && <Separator className="mt-4" />}
                  </div>
                ))}
                <Skeleton className="mt-3 h-8 w-full rounded-md sm:w-36" />
              </div>
            </Card>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/3 lg:flex-col lg:gap-6">
          <Card className="p-6">
            <Skeleton className="mb-4 h-7 w-32" />
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="mt-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="mt-3 h-8 w-36 rounded-md" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="mb-4 h-7 w-40" />
            <Skeleton className="mb-4 h-8 w-64 rounded-md" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4" />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  {i < 1 && <Separator className="mt-4" />}
                </div>
              ))}
              <Skeleton className="mt-3 h-8 w-36 rounded-md" />
            </div>
          </Card>
        </div>
      </div>
    </article>
  );
}
