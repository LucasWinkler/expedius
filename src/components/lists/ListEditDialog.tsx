"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import type { DbListWithPlacesCount } from "@/server/types/db";
import { Loader2 } from "lucide-react";
import { listColourPresets } from "@/constants";
import { FileInput } from "@/components/ui/file-input";
import { UpdateListInput, updateListSchema } from "@/lib/validations/list";
import { useUpdateList } from "@/hooks/useLists";
import { ColorSwatch } from "./ColorSwatch";

type ListEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  list: DbListWithPlacesCount;
};

export const ListEditDialog = ({
  open,
  onOpenChange,
  list,
}: ListEditDialogProps) => {
  const [customColor, setCustomColor] = useState<string>("#FF0000");
  const { startUpload, isUploading } = useUploadThing("userListImage");
  const { mutateAsync: updateList, isPending } = useUpdateList(list.id);

  const form = useForm<UpdateListInput>({
    resolver: zodResolver(updateListSchema),
    defaultValues: {
      name: list.name,
      description: list.description ?? "",
      isPublic: list.isPublic ?? false,
      colour: list.colour ?? listColourPresets[0],
      image: undefined,
    },
  });

  const onSubmit = async (data: UpdateListInput) => {
    try {
      let imageUrl = list.image;

      if (data.image instanceof File) {
        const uploadResult = await startUpload([data.image]);
        if (!uploadResult) {
          throw new Error("Failed to upload image");
        }
        imageUrl = uploadResult[0].appUrl;
      } else if (data.image === null) {
        imageUrl = null;
      }

      await updateList(
        { ...data, image: imageUrl },
        {
          onSuccess: () => {
            onOpenChange(false);
            toast.success("List updated successfully");
            form.reset();
          },
        },
      );
    } catch (error) {
      toast.error("Failed to update list", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
            <DialogDescription>Update your list details</DialogDescription>
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
                          <Input {...field} disabled={isPending} />
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
                            className="min-h-[120px] resize-none"
                            placeholder="A collection of my favourite spots..."
                            disabled={isPending}
                            {...field}
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
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormDescription>
                            Choose a color for your list card
                          </FormDescription>
                          <div className="space-y-4">
                            <div
                              className="grid grid-cols-5 gap-3"
                              role="radiogroup"
                              aria-label="List card color selection"
                            >
                              {listColourPresets.map((color) => (
                                <ColorSwatch
                                  key={color}
                                  color={color}
                                  selected={field.value === color}
                                  onClick={() => field.onChange(color)}
                                  disabled={isPending}
                                />
                              ))}
                              <ColorSwatch
                                color={customColor}
                                selected={field.value === customColor}
                                onCustomColorChange={(color) => {
                                  setCustomColor(color);
                                  field.onChange(color);
                                }}
                                isCustom
                                disabled={isPending}
                              />
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel>Cover Image (Optional)</FormLabel>
                        <FormControl>
                          <FileInput
                            onChange={(file) => onChange(file)}
                            onClear={() => {
                              if (value) {
                                onChange(undefined);
                              } else if (list.image) {
                                onChange(null);
                              }
                            }}
                            disabled={isPending}
                            existingImage={list.image}
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
                  disabled={isPending}
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
                      {isUploading ? "Uploading..." : "Saving..."}
                    </div>
                  ) : form.formState.isDirty ? (
                    "Save Changes"
                  ) : (
                    "No Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default ListEditDialog;
