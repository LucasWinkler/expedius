"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { ColourSwatch } from "@/components/lists/ColourSwatch";
import { listColourPresets } from "@/constants";
import { useUploadThing } from "@/lib/uploadthing";
import { FileInput } from "@/components/ui/file-input";
import { createListSchema, type CreateListInput } from "@/lib/validations/list";
import { useCreateList } from "@/hooks/useLists";
import { AvailabilityInput } from "@/components/ui/availability-input";

type ListCreateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ListCreateDialog = ({
  open,
  onOpenChange,
}: ListCreateDialogProps) => {
  const [customColor, setCustomColor] = useState<string>("#FF0000");
  const { startUpload, isUploading } = useUploadThing("userListImage");
  const { mutateAsync: createList, isPending } = useCreateList();

  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      colour: listColourPresets[0],
      image: undefined,
    },
  });

  const onSubmit = async (data: CreateListInput) => {
    try {
      let imageUrl: string | undefined;

      if (data.image) {
        const uploadResult = await startUpload([data.image]);
        if (!uploadResult) {
          throw new Error("Failed to upload image");
        }
        imageUrl = uploadResult[0].ufsUrl;
      }

      await createList(
        {
          name: data.name,
          description: data.description,
          isPublic: data.isPublic,
          colour: data.colour,
          image: imageUrl,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            toast.success("List created successfully");
            form.reset();
          },
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to create list", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        form.reset();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <DialogDescription>
            Create a new list to organize your favourite places
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <AvailabilityInput
                          form={form}
                          field={field}
                          schema={createListSchema.shape.name}
                          type="list/name"
                          placeholder="My Favourite Places"
                          disabled={isPending || isUploading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A collection of my favourite spots..."
                          className="min-h-[120px] resize-none"
                          {...field}
                          disabled={isPending || isUploading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Visibility</FormLabel>
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <FormDescription>
                          Allow others to view this list
                        </FormDescription>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending || isUploading}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="colour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colour</FormLabel>
                      <FormDescription>
                        Choose a colour for your list card
                      </FormDescription>
                      <div className="space-y-4">
                        <div
                          className="grid grid-cols-5 gap-3"
                          role="radiogroup"
                          aria-label="List card color selection"
                        >
                          {listColourPresets.map((color) => (
                            <ColourSwatch
                              key={color}
                              color={color}
                              selected={field.value === color}
                              onClick={() => field.onChange(color)}
                              disabled={isPending || isUploading}
                            />
                          ))}
                          <ColourSwatch
                            color={customColor}
                            selected={field.value === customColor}
                            onCustomColorChange={(color) => {
                              setCustomColor(color);
                              field.onChange(color);
                            }}
                            isCustom
                            disabled={isPending || isUploading}
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Cover Image (Optional)</FormLabel>
                      <FormControl>
                        <FileInput
                          onChange={(file) => onChange(file)}
                          onClear={() => onChange(undefined)}
                          disabled={isPending || isUploading}
                        />
                      </FormControl>
                      <FormDescription>Maximum size: 4MB</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending || isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isUploading || !form.formState.isDirty}
              >
                {isPending || isUploading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Creating..."}
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

export default ListCreateDialog;
