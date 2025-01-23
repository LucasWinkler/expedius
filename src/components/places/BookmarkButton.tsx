"use client";

import { useState, useEffect, useTransition } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserListForPlaceCard } from "@/server/data/userLists";
import { createUserList, updateUserLists } from "@/server/actions/userList";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";

type BookmarkButtonProps = {
  placeId: string;
  userLists?: UserListForPlaceCard[];
};

const createListSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters").max(50),
});

export const BookmarkButton = ({ placeId, userLists }: BookmarkButtonProps) => {
  const { data: session, isPending } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [isActionPending, startTransition] = useTransition();
  const [initialSelectedLists, setInitialSelectedLists] = useState<Set<string>>(
    new Set(),
  );

  const form = useForm<z.infer<typeof createListSchema>>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const initialLists = new Set(
      userLists
        ?.filter((list) =>
          list.places.some((place) => place.placeId === placeId),
        )
        .map((list) => list.id),
    );
    setSelectedLists(initialLists);
    setInitialSelectedLists(initialLists);
  }, [userLists, placeId]);

  const handleClick = () => {
    if (isPending) {
      return;
    }

    if (!session) {
      toast.error("Please sign in to save places to lists");
      return;
    }
  };

  const onSubmit = async (values: z.infer<typeof createListSchema>) => {
    startTransition(async () => {
      try {
        const result = await createUserList({ name: values.name });

        if (result.error) {
          toast.error(result.error);
        } else {
          setIsDialogOpen(false);
          form.reset();
          toast.success("List created successfully");
        }
      } catch (error) {
        console.error("Error occurred while creating the list:", error);
        toast.error("An error occurred while creating the list");
      }
    });
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

    const result = await updateUserLists({
      placeId,
      selectedLists: Array.from(selectedLists),
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      const updatedLists = result.data;
      const initialLists = new Set(
        updatedLists
          ?.filter((list) =>
            list.places.some((place) => place.placeId === placeId),
          )
          .map((list) => list.id),
      );
      setSelectedLists(initialLists);
      setInitialSelectedLists(initialLists);
      toast.success("Lists updated successfully");
    }
  };

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          form.reset();
          setIsDialogOpen(open);
        }}
      >
        <DropdownMenu
          onOpenChange={(open) => {
            if (!open) {
              setSelectedLists(initialSelectedLists);
            }
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="size-10 bg-white/20 text-white shadow-md backdrop-blur-md hover:bg-white/30 [&_svg]:size-5"
              onClick={handleClick}
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
            {userLists ? <DropdownMenuSeparator /> : null}
            <div className={cn(userLists ? "px-2 py-1.5" : "p-0")}>
              <ScrollArea type="always" className="h-[120px] pr-4 md:h-[160px]">
                {userLists?.map((list) => (
                  <label
                    key={list.id}
                    htmlFor={`list-${list.id}`}
                    className={cn(
                      "mb-2 flex w-full cursor-pointer select-none items-center space-x-2 rounded-md px-2 py-1.5 transition-colors active:bg-accent/60",
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
                  <BookmarkPlus className="size-4" />
                )}
                Save
              </Button>
            </div>
          </DropdownMenuContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
              <DialogDescription>
                You can edit this list later.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="List Name"
                          disabled={isActionPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isActionPending}
                    onClick={() => {
                      setIsDialogOpen(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isActionPending}>
                    {isActionPending ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
};

export default BookmarkButton;
