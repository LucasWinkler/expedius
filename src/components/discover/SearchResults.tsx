import { PlaceCard } from "./PlaceCard";
import { NoResults } from "./NoResults";
import { searchPlaces } from "@/server/services/places";
import { getServerSession } from "@/server/auth/session";
import userLists from "@/server/data/userLists";
import { cache } from "react";

type SearchResultsProps = {
  query: string;
};

const getUserLists = cache(async (userId?: string) => {
  return userId ? await userLists.queries.getAllByUserId(userId) : undefined;
});

export const SearchResults = async ({ query }: SearchResultsProps) => {
  const places = await searchPlaces(query, 15);
  const session = await getServerSession();
  const lists = await getUserLists(session?.user.id);

  if (!places || (places.length === 0 && query)) {
    return <NoResults query={query} />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {places.map((place, index) => (
        <PlaceCard
          key={place.id}
          place={place}
          priority={index < 3}
          userLists={lists}
        />
      ))}
    </ul>
  );
};

export default SearchResults;
