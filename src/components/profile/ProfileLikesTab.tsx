"use client";

import { useLikesInfinite } from "@/hooks/useLikes";
import { LikeItem } from "@/server/types/profile";
import { useInView } from "react-intersection-observer";
import { TabsContent } from "../ui/tabs";
import { PlaceCardSkeleton } from "../skeletons/PlaceCardSkeleton";
import { PlaceCard } from "../places/PlaceCard";
import LikeButton from "../places/LikeButton";
import { SaveToListButton } from "../places";

interface ProfileLikesTabProps {
  username: string;
}

export const ProfileLikesTab = ({ username }: ProfileLikesTabProps) => {
  const {
    data: likesData,
    fetchNextPage: fetchNextLikes,
    hasNextPage: hasNextLikes,
    isFetchingNextPage: isFetchingNextLikes,
    status: likesStatus,
  } = useLikesInfinite(username, true);

  const { ref: likesRef } = useInView({
    threshold: 0,
    rootMargin: "200px 0px",
    onChange: (inView) => {
      if (inView && hasNextLikes && !isFetchingNextLikes) {
        fetchNextLikes();
      }
    },
  });

  const allLikes =
    likesData?.pages.flatMap((page, pageIndex) =>
      page.items.map((item: LikeItem) => ({
        ...item,
        key: `${item.placeId}-${pageIndex}`,
      })),
    ) ?? [];

  return (
    <TabsContent value="likes">
      {likesStatus === "pending" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaceCardSkeleton showActions key={i} />
          ))}
        </div>
      ) : likesStatus === "error" ? (
        <div className="py-8 text-center text-red-500">Error loading likes</div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {allLikes.map((like) => (
              <PlaceCard
                key={like.key}
                place={like.place}
                isListItem
                actions={
                  <div className="flex flex-col gap-2">
                    <LikeButton placeId={like.placeId} username={username} />
                    <SaveToListButton placeId={like.placeId} />
                  </div>
                }
              />
            ))}
          </div>

          <div ref={likesRef}>
            {hasNextLikes ? (
              isFetchingNextLikes ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PlaceCardSkeleton showActions />
                  <PlaceCardSkeleton showActions />
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <span className="text-sm text-muted-foreground">
                    Scroll for more likes
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
