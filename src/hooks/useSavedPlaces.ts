import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getSavedPlaces } from "@/lib/api/savedPlaces";
import { QUERY_KEYS } from "@/constants";
import { removeFromList } from "@/server/actions/savedPlace";
import { SavedPlacesResponse } from "@/lib/api/types";

export const useSavedPlaces = (listId: string, page?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SAVED_PLACES, listId, { page }],
    queryFn: () => getSavedPlaces(listId, { page }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useRemoveFromList = (listId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placeId: string) => removeFromList(listId, placeId),
    onMutate: async (placeId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.SAVED_PLACES, listId],
      });

      const previousPlaces = queryClient.getQueryData([
        QUERY_KEYS.SAVED_PLACES,
        listId,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.SAVED_PLACES, listId],
        (old: SavedPlacesResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.filter((item) => item.placeId !== placeId),
            metadata: {
              ...old.metadata,
              totalItems: old.metadata.totalItems - 1,
            },
          };
        },
      );

      return { previousPlaces };
    },
    onError: (_, __, context) => {
      if (context?.previousPlaces) {
        queryClient.setQueryData(
          [QUERY_KEYS.SAVED_PLACES, listId],
          context.previousPlaces,
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SAVED_PLACES, listId],
      });
    },
  });
};
