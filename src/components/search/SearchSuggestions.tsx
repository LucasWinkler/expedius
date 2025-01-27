import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEARCH_SUGGESTIONS } from "@/constants";

export const SearchSuggestions = () => (
  <div className="animate-fade-up animation-delay-500 mx-auto mt-4 flex flex-wrap justify-center gap-2.5 opacity-0 sm:mt-6 sm:gap-3">
    {SEARCH_SUGGESTIONS.map((suggestion) => (
      <Link
        key={suggestion.title}
        href={`/discover?q=${encodeURIComponent(suggestion.query)}`}
        className="group inline-flex items-center rounded-full px-3.5 py-1.5 text-sm text-muted-foreground/75 transition-colors hover:text-foreground/90 sm:px-4 sm:py-2 sm:text-base"
        aria-label={`Search for ${suggestion.title}`}
      >
        {suggestion.title}
        <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-4" />
      </Link>
    ))}
  </div>
);

export default SearchSuggestions;
