"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteList } from "@/hooks/useLists";
import type { DbList } from "@/server/db/schema";
import { toast } from "sonner";

interface DeleteListDialogProps {
  listId: DbList["id"];
  listName: DbList["name"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteListDialog = ({
  listId,
  listName,
  open,
  onOpenChange,
}: DeleteListDialogProps) => {
  const { mutateAsync: deleteList, isPending } = useDeleteList(listId);

  const handleDelete = async () => {
    try {
      await deleteList();
      onOpenChange(false);
      toast.success("List deleted successfully");
    } catch {
      toast.error("Failed to delete list");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete List</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{listName}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
