"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListsInfinite } from "@/hooks/useLists";
import { ListCard } from "../lists/ListCard";
import { Loader2, Plus } from "lucide-react";
import { useInView } from "react-intersection-observer";
import type { DbListWithPlacesCount } from "@/server/types/db";
import { useState } from "react";
import { ListDeleteDialog } from "../lists/ListDeleteDialog";
import { Button } from "../ui/button";
import ListCreateDialog from "../lists/ListCreateDialog";
import ListEditDialog from "../lists/ListEditDialog";

interface ProfileViewProps {
  username: string;
  isOwnProfile: boolean;
}

export const ProfileView = ({ username, isOwnProfile }: ProfileViewProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useListsInfinite(username);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<DbListWithPlacesCount | null>(
    null,
  );
  const [deletingList, setDeletingList] =
    useState<DbListWithPlacesCount | null>(null);
  const [activeTab, setActiveTab] = useState<"lists" | "likes">("lists");

  const { ref } = useInView({
    threshold: 0,
    rootMargin: "200px 0px",
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const allLists =
    data?.pages.flatMap((page, pageIndex) =>
      page.items.map((item) => ({
        ...item,
        key: `${item.id}-${pageIndex}`,
      })),
    ) ?? [];

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Tabs
        defaultValue="lists"
        onValueChange={(value) => setActiveTab(value as "lists" | "likes")}
      >
        <div className="mb-8 flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger className="hover:bg-muted" value="lists">
              Lists
            </TabsTrigger>
            <TabsTrigger className="hover:bg-muted" value="likes">
              Likes
            </TabsTrigger>
          </TabsList>

          {isOwnProfile && activeTab === "lists" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground ring-1 ring-border transition-all hover:bg-muted"
            >
              <Plus className="size-4" />
              Create
            </Button>
          )}
        </div>
        <TabsContent value="lists">
          {status === "pending" ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : status === "error" ? (
            <div className="py-8 text-center text-muted-foreground">
              Error loading lists
            </div>
          ) : (
            <div className="space-y-4">
              {allLists.map((list) => (
                <ListCard
                  key={list.key}
                  list={list}
                  username={username}
                  isOwnProfile={isOwnProfile}
                  onEdit={() => setEditingList(list)}
                  onDelete={() => setDeletingList(list)}
                  showPrivacyBadge={isOwnProfile}
                />
              ))}

              <div ref={ref} className="h-8 w-full">
                {hasNextPage ? (
                  isFetchingNextPage ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex justify-center py-4">
                      <span className="text-sm text-muted-foreground">
                        Scroll for more lists
                      </span>
                    </div>
                  )
                ) : allLists.length > 0 ? (
                  <div className="flex justify-center py-4">
                    <span className="text-sm text-muted-foreground">
                      No more lists to load
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="likes">Likes... eventually</TabsContent>
      </Tabs>
      {isOwnProfile && activeTab === "lists" && (
        <ListCreateDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      )}
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
    </div>
  );
};
