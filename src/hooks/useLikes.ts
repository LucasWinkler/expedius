import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import type { DbUser } from "@/server/types/db";
import { getLikesByUsername } from "@/lib/api/likes";
import type { Place } from "@/types";

interface LikeItem {
  placeId: string;
  place: Place;
}

interface LikesPage {
  items: LikeItem[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
  };
}

interface InfiniteLikesData {
  pages: LikesPage[];
  pageParams: number[];
}

export const useLikesInfinite = (username: DbUser["username"]) => {
  const queryClient = useQueryClient();
  const ITEMS_PER_PAGE = 6;
  const queryKey = [QUERY_KEYS.LIKES, "infinite", username];

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) =>
      getLikesByUsername(username, {
        page: pageParam,
        limit: ITEMS_PER_PAGE,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.hasNextPage
        ? lastPage.metadata.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  const removeLike = (placeId: string) => {
    queryClient.setQueryData<InfiniteLikesData>(queryKey, (data) => {
      if (!data) return data;

      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter((item) => item.placeId !== placeId),
        })),
      };
    });
  };

  return {
    ...query,
    removeLike,
  };
};
