"use client";

import { useState, useTransition } from "react";
import { BookmarkPlus, Loader2, Plus } from "lucide-react";
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
  selectedLists: Set<string>;
  setSelectedLists: React.Dispatch<React.SetStateAction<Set<string>>>;
  onListsUpdate?: (lists: UserListForPlaceCard[]) => void;
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
  const [initialSelectedLists, setInitialSelectedLists] = useState<Set<string>>(
    new Set(),
  );

  const refreshLists = async () => {
    try {
      const response = await fetch("/api/lists/user");
      const data = await response.json();
      if (data.lists) {
        onListsUpdate?.(data.lists);
      }
    } catch (error) {
      console.error("Failed to refresh lists:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isPending) {
      return;
    }

    if (!session && open) {
      toast.error("Please sign in to save places to lists");
      return;
    }

    if (open) {
      setInitialSelectedLists(new Set(selectedLists));
    }
    setIsDropdownOpen(open);
  };

  const toggleListSelection = (listId: string) => {
    setSelectedLists((prev) => {
      const newSelectedLists = new Set(prev);
      if (newSelectedLists.has(listId)) {
        newSelectedLists.delete(listId);
      } else {
        newSelectedLists.add(listId);
      }
      return newSelectedLists;
    });
  };

  const handleSave = async () => {
    if (isPending) return;
    if (!session) {
      toast.error("Please sign in to save places to lists");
      return;
    }

    const selectedListsArray = Array.from(selectedLists);
    const initialListsArray = Array.from(initialSelectedLists);

    const noChanges =
      initialSelectedLists.size === selectedLists.size &&
      selectedListsArray.every((listId) => initialSelectedLists.has(listId)) &&
      initialListsArray.every((listId) => selectedLists.has(listId));

    if (noChanges) {
      setIsDropdownOpen(false);
      return;
    }

    try {
      startTransition(async () => {
        const result = await updateUserLists({
          placeId,
          selectedLists: selectedListsArray,
        });

        if (result.error) {
          toast.error(result.error);
        } else {
          setIsDropdownOpen(false);
          toast.success("Lists updated successfully");
        }
      });
    } catch {
      toast.error("Failed to save place to lists");
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="size-10 bg-white/20 text-white shadow-md backdrop-blur-md hover:bg-white/30 [&_svg]:size-5"
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
              onClick={() => setIsDialogOpen(true)}
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
                  {userLists.map((list) => (
                    <label
                      key={list.id}
                      htmlFor={`list-${list.id}`}
                      className={cn(
                        "mb-1 flex w-full cursor-pointer select-none items-center space-x-2 rounded-md px-2 py-1.5 transition-colors last:mb-0 active:bg-accent/60",
                        selectedLists.has(list.id) && "bg-accent/40",
                        "[@media(hover:hover)]:hover:bg-accent/60",
                      )}
                    >
                      <Checkbox
                        id={`list-${list.id}`}
                        checked={selectedLists.has(list.id)}
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
                  <BookmarkPlus className="size-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </DropdownMenuContent>
        <SaveListDialogForm
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={refreshLists}
        />
      </DropdownMenu>
    </>
  );
};

export default BookmarkButton;
