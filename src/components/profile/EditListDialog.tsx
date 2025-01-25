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
import { createListSchema, type CreateListInput } from "@/lib/validations/list";
import { ColorSwatch } from "./ColorSwatch";
import { Palette, Check, Loader2 } from "lucide-react";
import { listColourPresets } from "@/constants";
import { cn } from "@/lib/utils";
import { FileInput } from "@/components/ui/file-input";
import { useDebouncedCallback } from "use-debounce";

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
  const [customColor, setCustomColor] = useState<string>(
    list.colour && !listColourPresets.includes(list.colour)
      ? list.colour
      : "#000000",
  );
  const { startUpload, isUploading } = useUploadThing("userListImage");

  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: list.name,
      description: list.description ?? "",
      isPublic: list.isPublic ?? false,
      colour: list.colour ?? listColourPresets[0],
    },
  });

  const handleCustomColorChange = useDebouncedCallback(
    (color: string, onChange: (value: string) => void) => {
      const formattedColor = color.toUpperCase();
      setCustomColor(formattedColor);
      onChange(formattedColor);
    },
    16,
  );

  const onSubmit = async (data: CreateListInput) => {
    try {
      setIsLoading(true);
      let imageUrl: string | null | undefined = list.image;

      if (data.image && Array.isArray(data.image)) {
        const uploadResult = await startUpload([data.image[0]]);
        if (!uploadResult) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = uploadResult[0].url;
      } else if (data.image === null) {
        imageUrl = null;
      }

      const result = await updateUserList(list.id, {
        ...data,
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
                          <Input {...field} disabled={isLoading} />
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
                            {...field}
                            disabled={isLoading}
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
                      const isCustomSelected = !listColourPresets.includes(
                        field.value,
                      );

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
                                />
                              ))}
                              <div className="relative size-8">
                                <Input
                                  type="color"
                                  className="absolute inset-0 size-8 cursor-pointer opacity-0"
                                  value={customColor}
                                  onChange={(e) =>
                                    handleCustomColorChange(
                                      e.target.value,
                                      field.onChange,
                                    )
                                  }
                                  disabled={isLoading}
                                  aria-label="Choose custom color"
                                  role="application"
                                />
                                <div
                                  className={cn(
                                    "pointer-events-none absolute inset-0 flex items-center justify-center rounded-md border transition-all",
                                    isCustomSelected &&
                                      "ring-2 ring-primary ring-offset-2",
                                  )}
                                  style={{ backgroundColor: customColor }}
                                  aria-hidden="true"
                                >
                                  {isCustomSelected ? (
                                    <Check className="size-4 text-white" />
                                  ) : (
                                    <Palette className="size-4 text-white" />
                                  )}
                                </div>
                              </div>
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
                <Button type="submit" disabled={isLoading || isUploading}>
                  {isLoading || isUploading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Saving..."}
                    </div>
                  ) : (
                    "Save Changes"
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
