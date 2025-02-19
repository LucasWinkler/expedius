"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Folders } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ListsViewSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-24" />
          <span>/</span>
          <span className="text-foreground">Lists</span>
        </div>
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center text-sm text-muted-foreground">
            <Folders className="mr-1.5 size-3.5" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </header>

      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <div className="rounded-md border p-2">
            Search/filtering coming soon
          </div>
          <Skeleton className="h-10 w-28" />
        </div>

        <ul className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="relative overflow-hidden border-0 bg-muted/50"
            >
              <article className="relative flex flex-col xs:flex-row">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl p-5 xs:w-48 sm:w-60 md:w-72">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>

                <div className="relative flex flex-1 flex-col justify-between p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </ul>

        <nav className="flex justify-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </nav>
      </section>
    </div>
  );
};
