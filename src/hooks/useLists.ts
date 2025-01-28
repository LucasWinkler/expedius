import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createList,
  getList,
  getLists,
  getListsByUsername,
  updateList,
} from "@/lib/api";
import { QUERY_KEYS } from "@/constants";
import type { CreateListInput, UpdateListInput } from "@/types";

export const useListsInfinite = (username: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.LISTS, "infinite", username],
    queryFn: ({ pageParam = 1 }) =>
      getListsByUsername(username, { page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.hasNextPage
        ? lastPage.metadata.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
};

export const useLists = (page?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LISTS, { page }],
    queryFn: () => getLists({ page }),
  });
};

export const useList = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LISTS, id],
    queryFn: () => getList(id),
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListInput) => createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
    },
  });
};

export const useUpdateList = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateListInput) => updateList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
    },
  });
};
