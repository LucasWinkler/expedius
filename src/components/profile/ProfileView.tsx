"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { DbListWithPlacesCount } from "@/server/types/db";
import { useState } from "react";
import { ListDeleteDialog } from "../lists/ListDeleteDialog";
import { Button } from "../ui/button";
import ListCreateDialog from "../lists/ListCreateDialog";
import ListEditDialog from "../lists/ListEditDialog";
import { ProfileLikesTab } from "./ProfileLikesTab";
import { ProfileListsTab } from "./ProfileListsTab";

interface ProfileViewProps {
  username: string;
  isOwner: boolean;
}

export const ProfileView = ({ username, isOwner }: ProfileViewProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingList, setEditingList] = useState<DbListWithPlacesCount | null>(
    null,
  );
  const [deletingList, setDeletingList] =
    useState<DbListWithPlacesCount | null>(null);
  const [activeTab, setActiveTab] = useState<"lists" | "likes">("lists");

  const handleEditList = (list: DbListWithPlacesCount) => {
    setEditingList(list);
  };

  const handleDeleteList = (list: DbListWithPlacesCount) => {
    setDeletingList(list);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl">
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

          {isOwner && activeTab === "lists" && (
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

        <ProfileListsTab
          username={username}
          isOwner={isOwner}
          onEdit={handleEditList}
          onDelete={handleDeleteList}
        />
        <ProfileLikesTab username={username} />
      </Tabs>

      {isOwner && activeTab === "lists" && (
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
