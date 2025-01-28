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
import { useCreateList } from "@/hooks/useLists";
import { z } from "zod";
import { maxNameLength, minNameLength } from "@/constants";

const createSimpleListSchema = z.object({
  name: z
    .string()
    .min(minNameLength, `Name must be at least ${minNameLength} characters`)
    .max(maxNameLength, `Name must be less than ${maxNameLength} characters`),
});

type CreateSimpleListInput = z.infer<typeof createSimpleListSchema>;

interface CreateListDialogProps {
  children: React.ReactNode;
}

export const CreateListDialog = ({ children }: CreateListDialogProps) => {
  const { mutateAsync: createList, isPending } = useCreateList();

  const form = useForm<CreateSimpleListInput>({
    resolver: zodResolver(createSimpleListSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateSimpleListInput) => {
    try {
      await createList({
        name: data.name,
        isPublic: false,
        colour: "#000000",
      });

      form.reset();
      toast.success("List created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create list",
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new list</DialogTitle>
          <DialogDescription>
            Create a new list to save your favorite places
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
                      placeholder="My favorite places"
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
                ) : form.formState.isDirty ? (
                  "Create List"
                ) : (
                  "No Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
