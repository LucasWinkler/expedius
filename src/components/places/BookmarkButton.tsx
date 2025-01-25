"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import { BookmarkPlus, Loader2, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserListForPlaceCard } from "@/server/data/userLists";
import { updateUserLists } from "@/server/actions/userList";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import SaveListDialogForm from "./SaveListDialogForm";

type BookmarkButtonProps = {
  placeId: string;
  userLists?: UserListForPlaceCard[];
  selectedLists: Set<string>; // Lists currently selected from parent/context
  setSelectedLists: (lists: Set<string>) => void; // Callback to update parent/context state
  onListsUpdate?: () => void; // Callback to refresh lists data after changes
};

export const BookmarkButton = ({
  placeId,
  userLists,
  selectedLists,
  setSelectedLists,
  onListsUpdate,
}: BookmarkButtonProps) => {
  const { data: session, isPending } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActionPending, startTransition] = useTransition();

  // State Management:
  // We use three states to handle different scenarios and prevent UI flicker:
  // 1. selectedLists (prop): The source of truth from the parent/context
  // 2. initialSelectedLists: Snapshot of lists when dropdown opens or external changes occur
  // 3. localSelectedLists: Temporary state for changes made in the dropdown before saving
  const [initialSelectedLists, setInitialSelectedLists] = useState<Set<string>>(
    new Set(selectedLists),
  );
  const [localSelectedLists, setLocalSelectedLists] = useState<Set<string>>(
    new Set(selectedLists),
  );

  // This effect handles external state changes (e.g., from like button)
  // By updating both local states, we ensure:
  // 1. The UI immediately reflects external changes
  // 2. The save button doesn't appear for changes we didn't make
  // 3. We don't lose external updates while the dropdown is open
  useEffect(() => {
    setInitialSelectedLists(new Set(selectedLists));
    setLocalSelectedLists(new Set(selectedLists));
  }, [selectedLists]);

  // Sort lists to ensure consistent order with default list first
  const sortedLists = useMemo(() => {
    if (!userLists) return [];
    return [...userLists].sort((a, b) => {
      // Default list first
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      // Keep original order for non-default lists
      return 0;
    });
  }, [userLists]);

  // Handles dropdown open/close with auth check
  const handleOpenChange = (open: boolean) => {
    if (isPending) {
      return;
    }

    if (!session && open) {
      toast.error("Please sign in to save places to lists");
      return;
    }

    setIsDropdownOpen(open);
  };

  // Updates localSelectedLists when user toggles checkboxes
  // Only affects local state - changes aren't saved until user clicks "Save"
  const toggleListSelection = (listId: string) => {
    const newSelectedLists = new Set(localSelectedLists);
    if (newSelectedLists.has(listId)) {
      newSelectedLists.delete(listId);
    } else {
      newSelectedLists.add(listId);
    }
    setLocalSelectedLists(newSelectedLists);
  };

  // Compares local changes against initial state to determine if save is needed
  // This prevents unnecessary API calls and controls save/close button state
  const hasListChanges = () => {
    const selectedListsArray = Array.from(localSelectedLists);
    const initialListsArray = Array.from(initialSelectedLists);

    return !(
      initialSelectedLists.size === localSelectedLists.size &&
      selectedListsArray.every((listId) => initialSelectedLists.has(listId)) &&
      initialListsArray.every((listId) => localSelectedLists.has(listId))
    );
  };

  // Handles saving changes to the server with optimistic updates
  // 1. Prevents double submissions
  // 2. Handles auth check
  // 3. Implements optimistic updates with rollback on error
  // 4. Updates all relevant states on success
  const handleSave = async () => {
    if (isPending) return;
    if (!session) {
      toast.error("Please sign in to save places to lists");
      return;
    }

    if (!hasListChanges()) {
      setIsDropdownOpen(false);
      return;
    }

    // Store current state for potential rollback
    const previousLists = new Set(initialSelectedLists);

    try {
      startTransition(async () => {
        const result = await updateUserLists({
          placeId,
          selectedLists: Array.from(localSelectedLists),
        });

        if (result.error) {
          toast.error(result.error);
          // Rollback all states on error
          setLocalSelectedLists(previousLists);
          setSelectedLists(previousLists);
        } else {
          setIsDropdownOpen(false);
          toast.success("Lists updated successfully");
          // Sync all states with the new selection
          setInitialSelectedLists(new Set(localSelectedLists));
          setSelectedLists(localSelectedLists);
          // Refresh lists data in parent/context
          onListsUpdate?.();
        }
      });
    } catch {
      toast.error("Failed to save place to lists");
      // Rollback all states on error
      setLocalSelectedLists(previousLists);
      setSelectedLists(previousLists);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu
        modal={false}
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="size-10 bg-white/20 text-white shadow-md backdrop-blur-md transition-all duration-200 ease-out hover:bg-white/30 active:scale-90 [&_svg]:size-5"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <BookmarkPlus />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <div className="flex items-center justify-between p-2">
            <p className="text-base font-medium">Save Place</p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setIsDialogOpen(true);
                setIsDropdownOpen(false);
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {userLists && userLists.length > 0 ? (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <ScrollArea
                  type="always"
                  className="flex max-h-[120px] flex-col pr-4 md:max-h-[160px]"
                >
                  {sortedLists.map((list) => (
                    <label
                      key={list.id}
                      htmlFor={`list-${list.id}`}
                      className={cn(
                        "mb-1 flex w-full cursor-pointer select-none items-center space-x-2 rounded-md px-2 py-1.5 transition-colors last:mb-0 active:bg-accent/60",
                        localSelectedLists.has(list.id) && "bg-accent/40",
                        "[@media(hover:hover)]:hover:bg-accent/60",
                      )}
                    >
                      <Checkbox
                        id={`list-${list.id}`}
                        checked={localSelectedLists.has(list.id)}
                        onCheckedChange={() => toggleListSelection(list.id)}
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
            <Button
              size="sm"
              className="w-full"
              variant={hasListChanges() ? "default" : "secondary"}
              disabled={isActionPending}
              onClick={handleSave}
            >
              {isActionPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {hasListChanges() ? (
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
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <SaveListDialogForm
        isOpen={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setIsDropdownOpen(true);
          }
        }}
        onSuccess={onListsUpdate}
      />
    </div>
  );
};

export default BookmarkButton;
