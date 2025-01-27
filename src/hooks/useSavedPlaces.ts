import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSavedPlaces, savePlaceToList } from "@/lib/api";
import { QUERY_KEYS } from "@/constants";

export const useSavedPlaces = (listId: string, page?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SAVED_PLACES, listId, { page }],
    queryFn: () => getSavedPlaces(listId, { page }),
  });
};

export const useSavePlaceToList = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: string) => savePlaceToList(listId, placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SAVED_PLACES, listId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LISTS, listId],
      });
    },
  });
};
