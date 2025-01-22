"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { UserList } from "@/server/db/schema";
import { ListCard } from "./ListCard";
import ListsClient from "./ListsClient";
import { useState } from "react";
import { EditListDialog } from "./EditListDialog";
import { deleteUserList } from "@/server/actions/userList";
import { toast } from "sonner";

type ListsSectionProps = {
  initialLists?: UserList[];
  isOwnProfile: boolean;
};

export const ListsSection = ({
  initialLists = [],
  isOwnProfile,
}: ListsSectionProps) => {
  const [lists, setLists] = useState(initialLists);
  const [editingList, setEditingList] = useState<UserList | null>(null);

  const handleEdit = async (list: UserList) => {
    setEditingList(list);
  };

  const handleEditSuccess = (updatedList: UserList) => {
    setLists(lists.map((l) => (l.id === updatedList.id ? updatedList : l)));
    setEditingList(null);
  };

  const handleDelete = async (listId: UserList["id"]) => {
    const result = await deleteUserList(listId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setLists(lists.filter((list) => list.id !== listId));
    toast.success("List deleted successfully");
  };

  return (
    <Card id="lists">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isOwnProfile ? "My Lists" : "Their Lists"}</CardTitle>
        <ListsClient
          isOwnProfile={isOwnProfile}
          onSuccess={(newList) => setLists([newList, ...lists])}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              showActions={isOwnProfile}
              showPrivacyBadge={isOwnProfile}
              onEdit={() => handleEdit(list)}
              onDelete={() => handleDelete(list.id)}
              isDefault={list.isDefault}
            />
          ))}
          {lists.length === 0 && (
            <p className="col-span-2 py-8 text-center text-muted-foreground">
              No lists created yet.
            </p>
          )}
        </div>
      </CardContent>
      {editingList && (
        <EditListDialog
          list={editingList}
          open={!!editingList}
          onOpenChange={(open) => !open && setEditingList(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </Card>
  );
};

export default ListsSection;
