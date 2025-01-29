"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { listColourPresets, maxNameLength, minNameLength } from "@/constants";
import { useCreateListForPlace } from "@/hooks/useCreateListForPlace";

const createListForPlaceSchema = z.object({
  name: z
    .string()
    .min(minNameLength, `Name must be at least ${minNameLength} characters`)
    .max(maxNameLength, `Name must be less than ${maxNameLength} characters`),
});

type CreateListForPlaceInput = z.infer<typeof createListForPlaceSchema>;

interface CreateListForPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const CreateListForPlaceDialog = ({
  open,
  onOpenChange,
  children,
}: CreateListForPlaceDialogProps) => {
  const { createList, isPending } = useCreateListForPlace();

  const form = useForm<CreateListForPlaceInput>({
    resolver: zodResolver(createListForPlaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: CreateListForPlaceInput) => {
    createList(
      {
        name: data.name,
        colour: listColourPresets[0],
      },
      {
        onSuccess: () => {
          toast.success("List created successfully");
          onOpenChange(false);
          form.reset();
        },
        onError: (error) => {
          toast.error("Failed to create list", {
            description: error.message,
          });
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new list</DialogTitle>
          <DialogDescription>
            Create a new list to save your favourite places
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My favourite places"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <DialogTrigger asChild>
                <Button type="button" variant="ghost" disabled={isPending}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create List"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
