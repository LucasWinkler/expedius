import { Suspense } from "react";
import SearchBar from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import SearchSkeleton from "@/components/search/SearchSkeleton";
import { LocationProvider } from "@/contexts/LocationContext";

type DiscoverPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const generateMetadata = async ({ searchParams }: DiscoverPageProps) => {
  const query = (await searchParams).q;
  if (!query)
    return {
      title: "Start discovering",
      description:
        "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
      openGraph: {
        title: "Start discovering - PoiToGo",
        description:
          "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
      },
    };

  return {
    title: `Discover ${query}`,
    description:
      "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
    openGraph: {
      title: `Discover ${query} - PoiToGo`,
      description:
        "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
    },
  };
};

const DiscoverPage = async ({ searchParams }: DiscoverPageProps) => {
  const query = (await searchParams).q;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
      <div className="mb-8 space-y-4">
        <SearchBar initialQuery={query ?? ""} />
        {query && (
          <p className="text-sm text-muted-foreground">
            Showing results for &quot;{query}&quot;
          </p>
        )}
      </div>

      <div className="mt-6">
        {query ? (
          <Suspense key={query} fallback={<SearchSkeleton />}>
            <LocationProvider>
              <SearchResults query={query} />
            </LocationProvider>
          </Suspense>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-lg text-muted-foreground">
              Enter a search term to discover places
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
