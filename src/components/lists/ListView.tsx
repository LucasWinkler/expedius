"use client";

import { cn } from "@/lib/utils";
import type { DbList } from "@/server/types/db";
import { PlaceCard } from "@/components/places/PlaceCard";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSavedPlaces } from "@/hooks/useSavedPlaces";
import { Loader2 } from "lucide-react";

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

interface ListViewProps {
  list: DbList;
  username: string;
  isOwnProfile: boolean;
  currentPage: number;
}

export const ListView = ({
  list,
  username,
  isOwnProfile,
  currentPage,
}: ListViewProps) => {
  const { data, isLoading, error } = useSavedPlaces(list.id, currentPage);
  const hasPlaces = data?.items.length ?? 0 > 0;

  const createPageLink = (page: number) =>
    `/u/${username}/lists/${list.slug}?page=${page}`;

  const renderPaginationItems = () => {
    const totalPages = data?.metadata.totalPages ?? 1;
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
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href={`/u/${username}`}
            className="transition-colors hover:text-foreground"
          >
            {username}
          </Link>
          <span>/</span>
          <Link
            href={`/u/${username}/lists`}
            className="transition-colors hover:text-foreground"
          >
            Lists
          </Link>
          <span>/</span>
          <span className="text-foreground">{list.name}</span>
        </div>
        <h1 className="text-3xl font-bold">{list.name}</h1>
        {list.description && (
          <p className="text-muted-foreground">{list.description}</p>
        )}
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1.5 size-3.5" />
            <span>
              {data?.metadata.totalItems ?? 0}{" "}
              {(data?.metadata.totalItems ?? 0) === 1 ? "place" : "places"}
            </span>
          </div>
          {isOwnProfile && (
            <span className="text-sm text-muted-foreground">
              {list.isPublic ? "Public" : "Private"}
            </span>
          )}
        </div>
      </header>

      <section>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-muted-foreground">
            Error loading places
          </div>
        ) : (
          <>
            <div
              className={cn(
                "mb-8",
                hasPlaces &&
                  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              )}
            >
              {hasPlaces ? (
                data?.items.map((savedPlace) => (
                  <PlaceCard
                    key={savedPlace.placeId}
                    place={savedPlace.place}
                    isListItem
                    actions={
                      <PlaceActions
                        placeId={savedPlace.placeId}
                        username={username}
                      />
                    }
                  />
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No places saved yet.
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
                    aria-disabled={
                      currentPage >= (data?.metadata.totalPages ?? 1)
                    }
                    tabIndex={
                      currentPage >= (data?.metadata.totalPages ?? 1) ? -1 : 0
                    }
                    className={
                      currentPage >= (data?.metadata.totalPages ?? 1)
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationContent>
              </Pagination>
            </nav>
          </>
        )}
      </section>
    </div>
  );
};
