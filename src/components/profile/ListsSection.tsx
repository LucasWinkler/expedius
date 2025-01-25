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

  // Separate likes list and other lists
  const likesLists = lists.filter((list) => list.isDefault);
  const customLists = lists
    .filter((list) => !list.isDefault)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const handleEdit = async (list: UserList) => {
    setEditingList(list);
  };

  const handleEditSuccess = (updatedList: UserList) => {
    setLists((currentLists) =>
      currentLists.map((l) => (l.id === updatedList.id ? updatedList : l)),
    );
  };

  const handleEditDialogClose = () => {
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
        <div className="space-y-6">
          {likesLists.map((list) => (
            <div key={list.id} className="w-full">
              <ListCard
                list={list}
                showActions={isOwnProfile}
                showPrivacyBadge={isOwnProfile}
                onEdit={() => handleEdit(list)}
                onDelete={() => handleDelete(list.id)}
                isDefault={true}
              />
            </div>
          ))}

          {customLists.length > 0 && (
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-sm text-muted-foreground">
                  Custom Lists
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {customLists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                showActions={isOwnProfile}
                showPrivacyBadge={isOwnProfile}
                onEdit={() => handleEdit(list)}
                onDelete={() => handleDelete(list.id)}
                isDefault={false}
              />
            ))}
          </div>

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
          onOpenChange={handleEditDialogClose}
          onSuccess={(list) => {
            handleEditSuccess(list);
            handleEditDialogClose();
          }}
        />
      )}
    </Card>
  );
};

export default ListsSection;
