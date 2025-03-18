"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Folders } from "lucide-react";
import { ListCardSkeleton } from "./ListCardSkeleton";

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

        <ul className="mb-8 space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListCardSkeleton key={i} />
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
