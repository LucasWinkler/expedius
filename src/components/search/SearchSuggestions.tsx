import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEARCH_SUGGESTIONS } from "@/constants";

export const SearchSuggestions = () => (
  <div className="mx-auto mt-4 flex flex-wrap justify-center gap-2.5 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
    {SEARCH_SUGGESTIONS.map((suggestion) => (
      <Link
        key={suggestion.title}
        href={`/explore?q=${encodeURIComponent(suggestion.query)}`}
        className="group inline-flex items-center rounded-full border border-border/30 bg-background/50 px-3.5 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur-sm transition-all hover:border-border/50 hover:bg-background/80 hover:text-foreground hover:shadow sm:px-4 sm:py-2 sm:text-base 2xl:px-5 2xl:py-2.5 2xl:text-lg"
        aria-label={`Search for ${suggestion.title}`}
      >
        {suggestion.title}
        <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-4 2xl:size-5" />
      </Link>
    ))}
  </div>
);
