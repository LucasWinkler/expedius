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
import { updateUserList } from "@/server/actions/userList";
import { useUploadThing } from "@/lib/uploadthing";
import type { UserList } from "@/server/db/schema";
import { editListSchema, type EditListInput } from "@/lib/validations/list";
import { ColorSwatch } from "./ColorSwatch";
import { Loader2 } from "lucide-react";
import { listColourPresets } from "@/constants";
import { FileInput } from "@/components/ui/file-input";

type EditListDialogProps = {
  list: UserList;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (list: UserList) => void;
};

export const EditListDialog = ({
  list,
  open,
  onOpenChange,
  onSuccess,
}: EditListDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customColor, setCustomColor] = useState<string>("#FF0000");
  const { startUpload, isUploading } = useUploadThing("userListImage");

  const form = useForm<EditListInput>({
    resolver: zodResolver(editListSchema),
    defaultValues: {
      name: list.name,
      description: list.description ?? "",
      isPublic: list.isPublic ?? false,
      colour: list.colour ?? listColourPresets[0],
    },
  });

  const onSubmit = async (data: EditListInput) => {
    try {
      // Create an object containing only the changed fields
      const changedFields: Partial<EditListInput> = {};

      if (data.name !== list.name) changedFields.name = data.name;
      if (data.description !== list.description)
        changedFields.description = data.description;
      if (data.isPublic !== list.isPublic)
        changedFields.isPublic = data.isPublic;
      if (data.colour !== list.colour) changedFields.colour = data.colour;
      if (data.image !== undefined) changedFields.image = data.image;

      // If no fields have changed, close the dialog without making an API call
      if (Object.keys(changedFields).length === 0) {
        onOpenChange(false);
        return;
      }

      setIsLoading(true);
      let imageUrl: string | null = list.image;

      if (data.image && Array.isArray(data.image)) {
        const uploadResult = await startUpload([data.image[0]]);
        if (!uploadResult) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = uploadResult[0].appUrl;
      } else if (data.image === null) {
        imageUrl = null;
      }

      const result = await updateUserList(list.id, {
        name: data.name,
        isPublic: data.isPublic,
        colour: data.colour,
        description: changedFields.description,
        image: imageUrl,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.data) {
        onSuccess?.(result.data);
      }
      toast.success("List updated successfully");
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
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
                          <Input
                            {...field}
                            disabled={isLoading || list.isDefault}
                          />
                        </FormControl>
                        {list.isDefault && (
                          <FormDescription>
                            The name of your likes list cannot be modified
                          </FormDescription>
                        )}
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
                            disabled={isLoading || list.isDefault}
                            {...field}
                          />
                        </FormControl>
                        {list.isDefault && (
                          <FormDescription>
                            The description of your likes list cannot be
                            modified
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Public List
                          </FormLabel>
                          <FormDescription>
                            Make this list visible to everyone
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
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
                                  disabled={isLoading}
                                />
                              ))}
                              <ColorSwatch
                                color={customColor}
                                selected={field.value === customColor}
                                onClick={() => {}}
                                onCustomColorChange={(color) => {
                                  setCustomColor(color);
                                  field.onChange(color);
                                }}
                                isCustom
                                disabled={isLoading}
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
                            onChange={(files) => onChange(files)}
                            onClear={() => {
                              if (value) {
                                // Clear new selection, keep existing
                                onChange(undefined);
                              } else if (list.image) {
                                // Remove existing image
                                onChange(null);
                              }
                            }}
                            disabled={isLoading}
                            existingImage={list.image}
                          />
                        </FormControl>
                        <FormDescription>
                          Recommended size: 1200x630px. Maximum size: 4MB
                        </FormDescription>
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
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || isUploading || !form.formState.isDirty}
                >
                  {isLoading || isUploading ? (
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

export default EditListDialog;
