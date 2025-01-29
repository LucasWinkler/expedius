"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ListDeleteDialog } from "../lists/ListDeleteDialog";
import type { DbListWithPlacesCount } from "@/server/types/db";
import { ListCard } from "../lists/ListCard";
import ListEditDialog from "../lists/ListEditDialog";
import ListCreateDialog from "../lists/ListCreateDialog";

interface ProfileListsProps {
  lists: DbListWithPlacesCount[];
  username: string;
  isOwnProfile: boolean;
  totalPages: number;
  currentPage: number;
}

export const ProfileLists = ({
  lists,
  username,
  isOwnProfile,
  totalPages,
  currentPage,
}: ProfileListsProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<DbListWithPlacesCount | null>(
    null,
  );
  const [deletingList, setDeletingList] =
    useState<DbListWithPlacesCount | null>(null);

  const createPageLink = (page: number) => `/u/${username}?page=${page}`;

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isOwnProfile ? "My Lists" : "Their Lists"}</CardTitle>
        {isOwnProfile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 size-4" />
            New List
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              username={username}
              isOwnProfile={isOwnProfile}
              showPrivacyBadge={isOwnProfile}
              onEdit={() => setEditingList(list)}
              onDelete={() => setDeletingList(list)}
            />
          ))}
          {lists.length === 0 && (
            <p className="col-span-2 py-8 text-center text-muted-foreground">
              No lists created yet.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
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
          </div>
        )}
      </CardContent>

      <ListCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {editingList && (
        <ListEditDialog
          list={editingList}
          open={!!editingList}
          onOpenChange={() => setEditingList(null)}
        />
      )}

      {deletingList && (
        <ListDeleteDialog
          listId={deletingList.id}
          listName={deletingList.name}
          open={!!deletingList}
          onOpenChange={() => setDeletingList(null)}
        />
      )}
    </Card>
  );
};
