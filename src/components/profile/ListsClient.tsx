"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateListDialog } from "./CreateListDialog";
import type { UserList } from "@/server/db/schema";

type ListsClientProps = {
  isOwnProfile: boolean;
  onSuccess?: (list: UserList) => void;
};

export const ListsClient = ({ isOwnProfile, onSuccess }: ListsClientProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (!isOwnProfile) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="mr-2 size-4" />
        New List
      </Button>
      <CreateListDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default ListsClient;
