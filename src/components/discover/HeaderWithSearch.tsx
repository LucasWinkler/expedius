import React, { Suspense } from "react";
import SearchBar from "@/components/discover/SearchBar";
import { ArrowRight } from "lucide-react";
import SearchBarSkeleton from "@/components/discover/SearchBarSkeleton";

const HeaderWithSearch = () => {
  return (
    <div className="border-b bg-muted/40">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Find Your Next Adventure
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:mt-4 md:text-lg">
            Discover local favorites, hidden gems, and must-visit spots around
            the world
          </p>
          <div className="mt-6 md:mt-8">
            <Suspense fallback={<SearchBarSkeleton />}>
              <SearchBar />
            </Suspense>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-1">
            <span>Suggestions:</span>
            <div className="flex flex-wrap justify-center gap-2 sm:space-x-2">
              {["Pizza in New York", "Coffee shops", "Parks near me"].map(
                (suggestion) => (
                  <a
                    key={suggestion}
                    href={`/discover?q=${encodeURIComponent(suggestion)}`}
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    {suggestion}
                    <ArrowRight className="ml-1 size-3" />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderWithSearch;
