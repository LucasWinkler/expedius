import { redirect } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "@/components/discover/SearchBar";
import SearchResults from "@/components/discover/SearchResults";
import SearchSkeleton from "@/components/discover/SearchSkeleton";

type DiscoverPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const generateMetadata = async ({ searchParams }: DiscoverPageProps) => {
  const query = (await searchParams).q;
  if (!query) return { title: "Find Your Next Adventure | PoiToGo" };
  return { title: `${query} - Search Results | PoiToGo` };
};

const DiscoverPage = async ({ searchParams }: DiscoverPageProps) => {
  const query = (await searchParams).q;

  if (!query) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
      <div className="mb-8 space-y-4">
        <SearchBar initialQuery={query} />
        <p className="text-sm text-muted-foreground">
          Showing results for &quot;{query}&quot;
        </p>
      </div>

      <div className="mt-6">
        <Suspense key={query} fallback={<SearchSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
};

export default DiscoverPage;
