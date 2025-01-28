import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { toast } from "sonner";
import {
  checkLikeStatus,
  toggleLike as toggleLikeAction,
} from "@/server/actions/like";

export const useLike = (
  placeId: string,
  initialIsLiked: boolean,
  enabled = false,
) => {
  const queryClient = useQueryClient();

  const { data: isLiked } = useQuery({
    queryKey: [QUERY_KEYS.LIKES, placeId],
    queryFn: () => checkLikeStatus(placeId),
    initialData: initialIsLiked,
    enabled,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      return toggleLikeAction(placeId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.LIKES, placeId],
      });
      const previousValue = queryClient.getQueryData([
        QUERY_KEYS.LIKES,
        placeId,
      ]);
      queryClient.setQueryData([QUERY_KEYS.LIKES, placeId], !previousValue);
      return { previousValue };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.LIKES, placeId],
        context?.previousValue,
      );
      toast.error(
        error instanceof Error ? error.message : "Failed to update like",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LIKES, placeId],
      });
    },
  });

  return {
    isLiked,
    toggleLike,
  };
};
