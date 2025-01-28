import { useQuery } from "@tanstack/react-query";
import { getSavedPlaces } from "@/lib/api/savedPlaces";
import { QUERY_KEYS } from "@/constants";

export const useSavedPlaces = (listId: string, page?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SAVED_PLACES, listId, { page }],
    queryFn: () => getSavedPlaces(listId, { page }),
  });
};
