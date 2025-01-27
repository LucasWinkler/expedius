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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { ColorSwatch } from "./ColorSwatch";
import { listColourPresets } from "@/constants";
import { useUploadThing } from "@/lib/uploadthing";
import { FileInput } from "@/components/ui/file-input";
import { createListSchema, type CreateListInput } from "@/lib/validations/list";
import { createList } from "@/server/actions/list";

type CreateListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateListDialog = ({
  open,
  onOpenChange,
}: CreateListDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [customColor, setCustomColor] = useState<string>("#FF0000");
  const { startUpload, isUploading } = useUploadThing("userListImage");

  const form = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      colour: listColourPresets[0],
    },
  });

  const onSubmit = async (data: CreateListInput) => {
    try {
      setIsLoading(true);
      let imageUrl: string | undefined;

      if (data.image?.[0]) {
        const uploadResult = await startUpload([data.image[0]]);
        if (!uploadResult) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = uploadResult[0].appUrl;
      }

      await createList({
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        colour: data.colour,
        image: imageUrl,
      });

      onOpenChange(false);
      toast.success("List created successfully");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                        <Input
                          placeholder="My Favourite Places"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A collection of my favourite spots..."
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
                        <FormLabel className="text-base">Public List</FormLabel>
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
                  render={({ field }) => (
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
                          onChange={(files) => onChange(files)}
                          onClear={() => onChange(undefined)}
                          disabled={isLoading}
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
                    {isUploading ? "Uploading..." : "Creating..."}
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

export default CreateListDialog;
