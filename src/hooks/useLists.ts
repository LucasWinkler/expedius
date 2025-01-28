import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { createList, deleteList, updateList } from "@/server/actions/list";
import { DbList, DbUser } from "@/server/db/schema";
import {
  CreateListRequest,
  UpdateListRequest,
} from "@/server/validations/lists";
import { getList, getLists } from "@/lib/api/lists";
import { getListsByUsername } from "@/lib/api/lists";

export const useListsInfinite = (username: DbUser["username"]) => {
  const { data: session } = useSession();
  const isAuthenticated = session?.user.username === username;

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.LISTS, "infinite", username, isAuthenticated],
    queryFn: ({ pageParam = 1 }) =>
      getListsByUsername(username, {
        page: pageParam,
        limit: pageParam === 1 ? 6 : 3,
      }),
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

export const useList = (id: DbList["id"]) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LISTS, id],
    queryFn: () => getList(id),
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListRequest) => createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LISTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PLACE_LISTS],
      });
    },
  });
};

export const useUpdateList = (id: DbList["id"]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateListRequest) => updateList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
    },
  });
};

export const useDeleteList = (id: DbList["id"]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
    },
  });
};
