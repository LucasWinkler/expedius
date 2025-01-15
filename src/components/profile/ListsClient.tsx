"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateListDialog } from "./CreateListDialog";
import { useSession } from "@/lib/auth-client";
import type { User } from "@/server/db/schema";

type ListsClientProps = {
  userId: User["id"];
};

export const ListsClient = ({ userId }: ListsClientProps) => {
  const { data: session, isPending } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const isOwnProfile = session?.user.id === userId;

  if (isPending) return null;
  if (!isOwnProfile) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        New List
      </Button>
      <CreateListDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
};

export default ListsClient;
