"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { PlaceCardSkeleton } from "./PlaceCardSkeleton";

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
            <PlaceCardSkeleton key={i} showActions />
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
