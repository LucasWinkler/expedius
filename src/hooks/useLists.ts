import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { createList, deleteList, updateList } from "@/server/actions/list";
import type { DbList, DbUser } from "@/server/types/db";
import {
  CreateListRequest,
  UpdateListRequest,
} from "@/server/validations/lists";
import { getList, getLists } from "@/lib/api/lists";
import { getListsByUsername } from "@/lib/api/lists";

export const useListsInfinite = (username: DbUser["username"]) => {
  const { data: session } = useSession();
  const isAuthenticated = session?.user.username === username;
  const ITEMS_PER_PAGE = 6;

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.LISTS, "infinite", username, isAuthenticated],
    queryFn: ({ pageParam = 1 }) =>
      getListsByUsername(username, {
        page: pageParam,
        limit: ITEMS_PER_PAGE,
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

export const useCreateList = (placeId?: string) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: CreateListRequest) => createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LISTS] });
      if (placeId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.PLACE_LISTS, placeId],
        });
      }
      if (session?.user.username) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LISTS, "infinite", session.user.username],
        });
      }
    },
  });
};

export const useUpdateList = (id: DbList["id"]) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (data: UpdateListRequest) => updateList(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LISTS] });
      if (session?.user.username) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LISTS, "infinite", session.user.username],
        });
      }
    },
  });
};

export const useDeleteList = (id: DbList["id"]) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: () => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LISTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_LISTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLACE_LISTS] });
      if (session?.user.username) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.LISTS, "infinite", session.user.username],
        });
      }
    },
  });
};
