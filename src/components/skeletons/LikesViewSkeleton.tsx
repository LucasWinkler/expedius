"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export const LikesViewSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Skeleton className="h-4 w-24" />
          <span>/</span>
          <span className="text-foreground">Likes</span>
        </div>
        <Skeleton className="h-9 w-32" />
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center text-sm text-muted-foreground">
            <Heart className="mr-1.5 size-3.5" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </header>

      <section>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <Skeleton className="aspect-[3/2] w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="relative space-y-2.5 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="absolute right-4 top-4 flex flex-col gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>

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
