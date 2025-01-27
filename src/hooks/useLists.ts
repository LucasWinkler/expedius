import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createList, getList, getLists, updateList } from "@/lib/api";
import { QUERY_KEYS } from "@/constants";
import type { CreateListInput, UpdateListInput } from "@/types";

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
