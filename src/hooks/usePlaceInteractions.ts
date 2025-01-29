import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { toggleLike } from "@/server/actions/like";
import { updateSavedPlaces } from "@/server/actions/savedPlace";
import type { DbLike, DbListWithPlacesCount } from "@/server/db/schema";
import { getUserPlaceData } from "@/lib/api";

export interface PlaceInteractionsData {
  likes: DbLike[];
  lists: DbListWithPlacesCount[];
}

export const usePlaceInteractions = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PlaceInteractionsData>({
    queryKey: [QUERY_KEYS.USER_PLACE_DATA],
    queryFn: () => getUserPlaceData(),
    enabled: !!session,
  });

  const { mutate: mutateLike, isPending: isLikePending } = useMutation({
    mutationFn: (placeId: string) => toggleLike(placeId),
    onMutate: async (placeId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.USER_PLACE_DATA],
      });
      const previousData = queryClient.getQueryData<PlaceInteractionsData>([
        QUERY_KEYS.USER_PLACE_DATA,
      ]);

      if (previousData) {
        const isCurrentlyLiked = previousData.likes.some(
          (like) => like.placeId === placeId,
        );
        queryClient.setQueryData([QUERY_KEYS.USER_PLACE_DATA], {
          ...previousData,
          likes: isCurrentlyLiked
            ? previousData.likes.filter((like) => like.placeId !== placeId)
            : [...previousData.likes, { placeId, id: crypto.randomUUID() }],
        });
      }
      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QUERY_KEYS.USER_PLACE_DATA],
          context.previousData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PLACE_DATA] });
    },
  });

  const { mutate: savePlaces, isPending: isSavePending } = useMutation({
    mutationFn: ({
      placeId,
      selectedListIds,
    }: {
      placeId: string;
      selectedListIds: string[];
    }) => updateSavedPlaces({ placeId, selectedLists: selectedListIds }),
    onMutate: async ({ placeId, selectedListIds }) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.USER_PLACE_DATA],
      });
      const previousData = queryClient.getQueryData<PlaceInteractionsData>([
        QUERY_KEYS.USER_PLACE_DATA,
      ]);

      if (previousData) {
        queryClient.setQueryData([QUERY_KEYS.USER_PLACE_DATA], {
          ...previousData,
          lists: previousData.lists.map((list) => ({
            ...list,
            savedPlaces: selectedListIds.includes(list.id)
              ? list.savedPlaces?.some((sp) => sp.placeId === placeId)
                ? list.savedPlaces
                : [...(list.savedPlaces ?? []), { placeId }]
              : (list.savedPlaces?.filter((sp) => sp.placeId !== placeId) ??
                []),
          })),
        });
      }

      return { previousData };
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [QUERY_KEYS.USER_PLACE_DATA],
          context.previousData,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PLACE_DATA] });
    },
  });

  return {
    data,
    isLoading,
    like: {
      toggle: mutateLike,
      isPending: isLikePending,
    },
    places: {
      save: savePlaces,
      isPending: isSavePending,
    },
  };
};
