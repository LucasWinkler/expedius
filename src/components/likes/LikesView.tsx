"use client";

import { cn } from "@/lib/utils";
import type { Place } from "@/types";
import { PlaceCard } from "@/components/places/PlaceCard";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const LikeButton = dynamic(
  () => import("@/components/places/LikeButton").then((mod) => mod.LikeButton),
  {
    ssr: false,
  },
);

const SaveToListButton = dynamic(
  () =>
    import("@/components/places/SaveToListButton").then(
      (mod) => mod.SaveToListButton,
    ),
  {
    ssr: false,
  },
);

interface PlaceActionsProps {
  placeId: string;
  username: string;
}

const PlaceActions = ({ placeId, username }: PlaceActionsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <LikeButton placeId={placeId} username={username} />
      <SaveToListButton placeId={placeId} />
    </div>
  );
};

interface LikesViewProps {
  likes: Array<{
    placeId: string;
    place: Place;
  }>;
  username: string;
  isOwnProfile: boolean;
  totalPages: number;
  currentPage: number;
  totalLikes: number;
}

export const LikesView = ({
  likes,
  username,
  isOwnProfile,
  totalPages,
  currentPage,
  totalLikes,
}: LikesViewProps) => {
  const hasLikes = likes.length > 0;

  const createPageLink = (page: number) => `/u/${username}/likes?page=${page}`;

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    items.push(
      <PaginationLink
        key="1"
        href={createPageLink(1)}
        isActive={currentPage === 1}
      >
        1
      </PaginationLink>,
    );

    if (showEllipsisStart) {
      items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) continue;
      items.push(
        <PaginationLink
          key={i}
          href={createPageLink(i)}
          isActive={currentPage === i}
        >
          {i}
        </PaginationLink>,
      );
    }

    if (showEllipsisEnd) {
      items.push(<PaginationEllipsis key="ellipsis-end" />);
    }

    if (totalPages > 1) {
      items.push(
        <PaginationLink
          key={totalPages}
          href={createPageLink(totalPages)}
          isActive={currentPage === totalPages}
        >
          {totalPages}
        </PaginationLink>,
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">
          {isOwnProfile ? (
            "My Likes"
          ) : (
            <>
              <Link
                href={`/u/${username}`}
                className="text-primary hover:underline"
              >
                {username}
                &apos;s
              </Link>{" "}
              Likes
            </>
          )}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {totalLikes} Like{totalLikes === 1 ? "" : "s"}
        </p>
      </header>

      <section>
        <div
          className={cn(
            "mb-8",
            hasLikes &&
              "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {hasLikes ? (
            likes.map((like) => (
              <PlaceCard
                key={like.placeId}
                place={like.place}
                isListItem
                actions={
                  <PlaceActions placeId={like.placeId} username={username} />
                }
              />
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No likes yet.
            </div>
          )}
        </div>

        <nav>
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                href={createPageLink(currentPage - 1)}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : 0}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
              {renderPaginationItems()}
              <PaginationNext
                href={createPageLink(currentPage + 1)}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : 0}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationContent>
          </Pagination>
        </nav>
      </section>
    </div>
  );
};
