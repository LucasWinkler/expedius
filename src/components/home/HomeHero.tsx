import SearchBar from "@/components/search/SearchBar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEARCH_SUGGESTIONS } from "@/constants";

const HomeHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted pb-20 pt-12 sm:pb-32 sm:pt-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="animate-fade-up mx-auto bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            Discover your
            <br />
            next adventure.
          </h1>
          <p className="animate-fade-up animation-delay-200 mx-auto mt-4 max-w-[35ch] text-base text-muted-foreground opacity-0 sm:mt-5 sm:text-lg md:text-xl">
            Find, organize, and share your favourite places from around the
            world.
          </p>

          <div className="animate-fade-up animation-delay-300 mt-6 opacity-0 sm:mt-8">
            <div className="relative mx-auto max-w-2xl">
              <SearchBar />
            </div>
            <div className="animate-fade-up animation-delay-500 mx-auto mt-4 flex flex-wrap justify-center gap-2.5 opacity-0 sm:mt-6 sm:gap-3">
              {SEARCH_SUGGESTIONS.map((suggestion, index) => (
                <Link
                  key={suggestion.title}
                  href={`/discover?q=${encodeURIComponent(suggestion.query)}`}
                  className="animate-fade-up group inline-flex items-center rounded-full px-3.5 py-1.5 text-sm text-muted-foreground/75 opacity-0 transition-colors hover:text-foreground/90 sm:px-4 sm:py-2 sm:text-base"
                  style={{ animationDelay: `${index * 100 + 400}ms` }}
                  aria-label={`Search for ${suggestion.title}`}
                >
                  {suggestion.title}
                  <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0">
        <div className="bg-grid-white absolute inset-0 bg-[size:125px_125px] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/25 to-background/0" />
      </div>
    </section>
  );
};

export default HomeHero;
