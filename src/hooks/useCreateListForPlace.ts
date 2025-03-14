import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { createList as createListAction } from "@/server/actions/list";
import type { DbList } from "@/server/types/db";
import { CreateListRequest } from "@/server/validations/lists";

export const useCreateListForPlace = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    { success: boolean; data?: DbList; error?: string },
    Error,
    CreateListRequest
  >({
    mutationFn: (data: CreateListRequest) => createListAction(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_PLACE_DATA],
        });
      }
    },
  });

  const createList = (
    data: CreateListRequest,
    {
      onSuccess,
      onError,
    }: { onSuccess?: () => void; onError?: (error: Error) => void } = {},
  ) => {
    return mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          onSuccess?.();
        } else if (response.error) {
          onError?.(new Error(response.error));
        }
      },
      onError,
    });
  };

  return {
    createList,
    isPending,
  };
};
