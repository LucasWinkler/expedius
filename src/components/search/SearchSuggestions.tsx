import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SEARCH_SUGGESTIONS } from "@/constants";

export const SearchSuggestions = () => (
  <div className="animate-fade-up mx-auto mt-4 flex flex-wrap justify-center gap-2.5 opacity-0 sm:mt-6 sm:gap-3 2xl:mt-8 2xl:gap-4">
    {SEARCH_SUGGESTIONS.map((suggestion, index) => (
      <Link
        key={suggestion.title}
        href={`/discover?q=${encodeURIComponent(suggestion.query)}`}
        className="animate-fade-up group inline-flex items-center rounded-full px-3.5 py-1.5 text-sm text-muted-foreground/75 opacity-0 transition-colors hover:text-foreground/90 sm:px-4 sm:py-2 sm:text-base 2xl:px-5 2xl:py-2.5 2xl:text-lg"
        style={{ animationDelay: `${index * 100 + 200}ms` }}
        aria-label={`Search for ${suggestion.title}`}
      >
        {suggestion.title}
        <ArrowRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 sm:size-4 2xl:size-5" />
      </Link>
    ))}
  </div>
);

export default SearchSuggestions;
