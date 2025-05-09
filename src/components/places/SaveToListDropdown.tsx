"use client";

import { useState, useEffect, useMemo } from "react";
import { BookmarkPlus, X, Loader2, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { CreateListForPlaceDialog } from "./CreateListForPlaceDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { usePlaceInteractions } from "@/hooks/usePlaceInteractions";
import { toast } from "sonner";

interface SaveToListDropdownProps {
  placeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const SaveToListDropdown = ({
  placeId,
  open,
  onOpenChange,
  children,
}: SaveToListDropdownProps) => {
  const [createListOpen, setCreateListOpen] = useState(false);
  const { data: userData, places } = usePlaceInteractions();
  const { save: savePlaces, isPending } = places;

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
  }, []);

  const lists = useMemo(() => userData?.lists ?? [], [userData?.lists]);
  const selectedListIds = useMemo(
    () =>
      new Set(
        lists
          .filter((list) =>
            list.savedPlaces?.some(
              (savedPlace) => savedPlace.placeId === placeId,
            ),
          )
          .map((list) => list.id),
      ),
    [lists, placeId],
  );

  const [currentSelection, setCurrentSelection] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (selectedListIds.size > 0) {
      setCurrentSelection(new Set(selectedListIds));
    }
  }, [selectedListIds]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCurrentSelection(new Set(selectedListIds));
    }
    onOpenChange(newOpen);
  };

  const handleToggle = (listId: string) => {
    const newSelection = new Set(currentSelection);
    if (newSelection.has(listId)) {
      newSelection.delete(listId);
    } else {
      newSelection.add(listId);
    }
    setCurrentSelection(newSelection);
  };

  const hasChanges = () => {
    if (currentSelection.size !== selectedListIds.size) return true;
    return (
      Array.from(currentSelection).some((id) => !selectedListIds.has(id)) ||
      Array.from(selectedListIds).some((id) => !currentSelection.has(id))
    );
  };

  const handleSave = () => {
    if (isPending) return;

    if (!hasChanges()) {
      onOpenChange(false);
      return;
    }

    savePlaces(
      {
        placeId,
        selectedListIds: Array.from(currentSelection),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Failed to update lists", {
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        asChild
        {...(isTouchDevice
          ? {
              onPointerDown: (e) => e.preventDefault(),
              onClick: () => handleOpenChange(!open),
            }
          : undefined)}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center justify-between p-2">
          <p className="text-base font-medium">Save Place</p>
          <CreateListForPlaceDialog
            open={createListOpen}
            onOpenChange={setCreateListOpen}
          >
            <Button variant="outline" size="icon">
              <Plus />
              <span className="sr-only">Create new list</span>
            </Button>
          </CreateListForPlaceDialog>
        </div>
        {lists?.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <ScrollArea
                type="always"
                className="flex max-h-[120px] flex-col pr-4 md:max-h-[160px]"
              >
                {lists.map((list) => (
                  <label
                    key={list.id}
                    htmlFor={`list-${list.id}`}
                    className={cn(
                      "mb-1 flex w-full cursor-pointer select-none items-center space-x-2 rounded-md px-2 py-1.5 transition-colors last:mb-0 active:bg-accent/60",
                      currentSelection.has(list.id) && "bg-accent/40",
                      "[@media(hover:hover)]:hover:bg-accent/60",
                    )}
                  >
                    <Checkbox
                      id={`list-${list.id}`}
                      checked={currentSelection.has(list.id)}
                      onCheckedChange={() => handleToggle(list.id)}
                      className="size-4 rounded-[4px] border-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm font-medium leading-none transition-colors [@media(hover:hover)]:group-hover:text-primary">
                      {list.name}
                    </span>
                  </label>
                ))}
              </ScrollArea>
            </div>
          </>
        ) : (
          <>
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              No lists found
            </p>
          </>
        )}
        <DropdownMenuSeparator />
        <div className="p-2">
          <SaveToListItemButton
            hasChanges={hasChanges()}
            isPending={isPending}
            onClick={handleSave}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SaveToListItemProps {
  hasChanges: boolean;
  isPending: boolean;
  onClick: () => void;
}

const SaveToListItemButton = ({
  hasChanges,
  isPending,
  onClick,
}: SaveToListItemProps) => {
  return (
    <Button
      size="sm"
      className="w-full"
      variant={hasChanges ? "default" : "secondary"}
      disabled={isPending}
      onClick={onClick}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          {hasChanges ? (
            <>
              <BookmarkPlus className="size-4" />
              Save
            </>
          ) : (
            <>
              <X className="size-4" />
              Close
            </>
          )}
        </>
      )}
    </Button>
  );
};
