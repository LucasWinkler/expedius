"use client";

import { useListsInfinite } from "@/hooks/useLists";
import { ListCard } from "../lists/ListCard";
import { ListCardSkeleton } from "../skeletons/ListCardSkeleton";
import { TabsContent } from "../ui/tabs";
import { useInView } from "react-intersection-observer";
import { DbListWithPlacesCount } from "@/server/types/db";

interface ProfileListsTabProps {
  username: string;
  isOwner: boolean;
  onEdit: (list: DbListWithPlacesCount) => void;
  onDelete: (list: DbListWithPlacesCount) => void;
}

export const ProfileListsTab = ({
  username,
  isOwner,
  onEdit,
  onDelete,
}: ProfileListsTabProps) => {
  const {
    data: listsData,
    fetchNextPage: fetchNextLists,
    hasNextPage: hasNextLists,
    isFetchingNextPage: isFetchingNextLists,
    status: listsStatus,
  } = useListsInfinite(username);

  const { ref: listsRef } = useInView({
    threshold: 0,
    rootMargin: "200px 0px",
    onChange: (inView) => {
      if (inView && hasNextLists && !isFetchingNextLists) {
        fetchNextLists();
      }
    },
  });

  const allLists =
    listsData?.pages.flatMap((page, pageIndex) =>
      page.items.map((item) => ({
        ...item,
        key: `${item.id}-${pageIndex}`,
      })),
    ) ?? [];

  return (
    <TabsContent value="lists">
      {listsStatus === "pending" ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListCardSkeleton key={i} />
          ))}
        </div>
      ) : listsStatus === "error" ? (
        <div className="py-8 text-center text-red-500">Error loading lists</div>
      ) : (
        <div className="space-y-8">
          {allLists.map((list) => (
            <ListCard
              key={list.key}
              list={list}
              username={username}
              isOwner={isOwner}
              onEdit={onEdit}
              onDelete={onDelete}
              showPrivacyBadge={isOwner}
            />
          ))}

          <div ref={listsRef}>
            {hasNextLists ? (
              isFetchingNextLists ? (
                <ListCardSkeleton />
              ) : (
                <div className="flex justify-center py-4">
                  <span className="text-sm text-muted-foreground">
                    Scroll for more lists
                  </span>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </TabsContent>
  );
};
