"use client";

import { useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useListsInfinite } from "@/hooks/useLists";
import { useSavePlaceToList } from "@/hooks/useSavedPlaces";
import { useSession } from "@/lib/auth-client";
import { CreateListDialog } from "../lists/CreateListDialog";

interface SaveToListDialogProps {
  placeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SaveToListDialog = ({
  placeId,
  open,
  onOpenChange,
}: SaveToListDialogProps) => {
  const { data: session } = useSession();
  const [createListOpen, setCreateListOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useListsInfinite(session?.user.username ?? "");

  const allLists = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to list</DialogTitle>
        </DialogHeader>
        {session ? (
          <>
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {allLists.map((list) => (
                  <SaveToListItem
                    key={list.id}
                    listId={list.id}
                    name={list.name}
                    placeId={placeId}
                  />
                ))}
              </div>
              {hasNextPage && (
                <Button
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    "Load more"
                  )}
                </Button>
              )}
            </ScrollArea>
            <CreateListDialog
              open={createListOpen}
              onOpenChange={setCreateListOpen}
            >
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 size-4" />
                Create new list
              </Button>
            </CreateListDialog>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Please sign in to save places to lists
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface SaveToListItemProps {
  listId: string;
  name: string;
  placeId: string;
}

const SaveToListItem = ({ listId, name, placeId }: SaveToListItemProps) => {
  const { mutate, isPending } = useSavePlaceToList(listId);

  return (
    <Button
      variant="outline"
      className="w-full justify-start"
      onClick={() => mutate(placeId)}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Check className="mr-2 size-4" />
      )}
      {name}
    </Button>
  );
};
