import { Skeleton } from "@/components/ui/skeleton";

export const HomeCtaSkeleton = () => {
  return (
    <section className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="mx-auto h-10 w-3/4 max-w-2xl sm:h-12" />
          <Skeleton className="mx-auto mt-4 h-16 w-full max-w-xl" />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
};
