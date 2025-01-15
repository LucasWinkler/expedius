import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { createUserList } from "@/server/actions/userList";
import { Loader2 } from "lucide-react";
import { ColorSwatch } from "./ColorSwatch";
import { listColourPresets } from "@/constants";
import { useUploadThing } from "@/lib/uploadthing";
import { FileInput } from "@/components/ui/file-input";
import { Palette } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const createListSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
  colour: z
    .string()
    .min(1, "Color is required")
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
  image: z
    .custom<File[]>()
    .optional()
    .refine(
      (files) => {
        if (!files?.[0]) return true;
        return files[0].size <= 4 * 1024 * 1024;
      },
      {
        message: "Image must be less than 4MB",
      },
    ),
});

type CreateListInput = z.infer<typeof createListSchema>;

type CreateListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateListDialog = ({
  open,
  onOpenChange,
}: CreateListDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
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
        imageUrl = uploadResult[0].url;
      }

      const result = await createUserList({
        ...data,
        image: imageUrl,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("List created successfully");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Something went wrong");
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
            Create a new list to organize your favorite places
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
                          placeholder="My Favorite Places"
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
                          placeholder="A collection of my favorite spots..."
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
                  render={({ field }) => {
                    const [customColor, setCustomColor] =
                      useState<string>("#000000");

                    const handleCustomColorChange = (color: string) => {
                      const formattedColor = color.toUpperCase();
                      setCustomColor(formattedColor);
                      field.onChange(formattedColor);
                    };

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
                            <div className="relative">
                              <Input
                                type="color"
                                className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                value={customColor}
                                onChange={(e) =>
                                  handleCustomColorChange(e.target.value)
                                }
                                disabled={isLoading}
                                aria-label="Choose custom color"
                                role="application"
                                aria-description="Press Enter to open color picker, then use arrow keys to adjust color values"
                              />
                              <div
                                className={cn(
                                  "pointer-events-none flex h-8 w-8 items-center justify-center rounded-md border transition-all peer-hover:scale-110",
                                  isCustomSelected &&
                                    "ring-2 ring-primary ring-offset-2",
                                )}
                                style={{ backgroundColor: customColor }}
                                aria-hidden="true"
                              >
                                {isCustomSelected ? (
                                  <Check className="h-4 w-4 text-white" />
                                ) : (
                                  <Palette className="h-4 w-4 text-white" />
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
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Cover Image (Optional)</FormLabel>
                      <FormControl>
                        <FileInput
                          onChange={(files) => onChange(files)}
                          value={value ?? null}
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
