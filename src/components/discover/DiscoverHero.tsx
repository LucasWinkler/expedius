import React, { Suspense } from "react";
import SearchBar from "@/components/discover/SearchBar";
import { ArrowRight } from "lucide-react";
import SearchBarSkeleton from "@/components/discover/SearchBarSkeleton";

const DiscoverHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted pb-32 pt-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Find Your Next Adventure
          </h1>
          <p className="animate-fade-up animation-delay-200 mt-6 text-lg text-muted-foreground opacity-0">
            Discover local favourites, hidden gems, and must-visit spots around
            the world
          </p>
          <div className="animate-fade-up animation-delay-300 mt-8 opacity-0">
            <div className="relative mx-auto max-w-2xl">
              <Suspense fallback={<SearchBarSkeleton />}>
                <SearchBar />
              </Suspense>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Pizza in New York", "Coffee shops", "Parks near me"].map(
                (suggestion) => (
                  <a
                    key={suggestion}
                    href={`/discover?q=${encodeURIComponent(suggestion)}`}
                    className="inline-flex items-center rounded-full px-3 py-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
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

      {/* Background Pattern */}
      <div className="bg-grid-white/10 absolute inset-0 bg-[size:60px_60px] opacity-10" />
    </section>
  );
};

export default DiscoverHero;
