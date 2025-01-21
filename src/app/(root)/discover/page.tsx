import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover | PoiTogo",
};

const DiscoverPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const query = (await searchParams).q;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-4 text-3xl font-bold">Discover Places</h1>
        <SearchBar initialQuery={query} />
      </div>

      <SearchResults query={query} />
    </div>
  );
};

export default DiscoverPage;
