import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { getServerSession } from "@/server/auth/session";
import userLists from "@/server/data/userLists";
import { Metadata } from "next";
import { cache } from "react";

export const metadata: Metadata = {
  title: "Discover | PoiTogo",
};

const getUserLists = cache(async (userId: string) => {
  return await userLists.queries.getAllByUserId(userId);
});

const DiscoverPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const query = (await searchParams).q;
  const session = await getServerSession();
  const lists = session && (await getUserLists(session.user.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-center">
        <h1 className="mb-4 text-3xl font-bold">Discover Places</h1>
        <SearchBar initialQuery={query} />
      </div>

      <SearchResults query={query} userLists={lists} />
    </div>
  );
};

export default DiscoverPage;
