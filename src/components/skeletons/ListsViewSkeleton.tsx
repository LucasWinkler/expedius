"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Folders } from "lucide-react";

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
            <li
              key={i}
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <Skeleton className="aspect-[2/1] w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="relative space-y-2.5 p-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </li>
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
