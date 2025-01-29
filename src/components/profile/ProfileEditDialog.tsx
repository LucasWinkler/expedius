"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { FileInput } from "@/components/ui/file-input";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import type { DbUser } from "@/server/types/db";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/user";
import { updateProfile } from "@/server/actions/user";
import { useDebouncedCallback } from "use-debounce";
import { checkUsernameAvailability } from "@/server/actions/user";
import { listColourPresets } from "@/constants";
import { ColorSwatch } from "../lists/ColorSwatch";

interface ProfileEditDialogProps {
  user: DbUser;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: DbUser) => void;
}

export const ProfileEditDialog = ({
  user,
  onOpenChange,
  onSuccess,
}: ProfileEditDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const { startUpload, isUploading } = useUploadThing("updateProfileImage");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [customColor, setCustomColor] = useState<string>("#FF0000");

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio ?? "",
      isPublic: user.isPublic ?? false,
      colour: user.colour ?? listColourPresets[0],
    },
  });

  const username = useWatch({
    control: form.control,
    name: "username",
    defaultValue: user.username,
  });

  const isDisabled = isUploading || isPending;
  const canChangeUsername =
    !user.usernameUpdatedAt ||
    user.usernameUpdatedAt < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const checkUsername = useDebouncedCallback(async (value: string) => {
    if (value === user.username) {
      setIsAvailable(null);
      return;
    }

    const validationResult =
      updateProfileSchema.shape.username.safeParse(value);
    if (!validationResult.success) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    try {
      const { available } = await checkUsernameAvailability(value);
      setIsAvailable(available);
      if (!available) {
        form.setError("username", {
          message: "Username is already taken",
        });
      }
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, 500);

  useEffect(() => {
    void checkUsername(username);
  }, [username, checkUsername]);

  const onSubmit = async (data: UpdateProfileInput) => {
    if (data.username !== user.username) {
      const result = await checkUsernameAvailability(data.username);
      if (!result.available) {
        throw new Error("Username is already taken");
      }
    }

    startTransition(async () => {
      try {
        let imageUrl: string | null | undefined = user.image;

        if (data.image instanceof File) {
          const uploadResult = await startUpload([data.image]);
          if (!uploadResult) {
            toast.error("Failed to upload profile image");
            return;
          }
          imageUrl = uploadResult[0].appUrl;
        } else if (data.image === null) {
          imageUrl = null;
        }

        const result = await updateProfile({
          ...data,
          image: imageUrl,
        });

        if (result.error) {
          toast.error(result.error);
          return;
        }

        if (result.data) {
          onSuccess?.(result.data);
          onOpenChange(false);
          toast.success("Profile updated successfully");
          form.reset();
        }
      } catch (error) {
        toast.error("Failed to update profile", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={!canChangeUsername || isDisabled}
                        />
                        {canChangeUsername && username !== user.username && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isChecking ? (
                              <Loader2 className="size-4 animate-spin text-muted-foreground" />
                            ) : isAvailable ? (
                              <CheckCircle2 className="size-4 text-green-500" />
                            ) : (
                              <XCircle className="size-4 text-destructive" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {canChangeUsername
                        ? "Username can only be changed once every 30 days"
                        : `Username can be changed again in ${
                            30 -
                            Math.ceil(
                              (new Date().getTime() -
                                new Date(user.usernameUpdatedAt!).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )
                          } days`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isDisabled}
                        className="resize-none"
                        rows={4}
                        placeholder="Add a bio to your profile"
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
                    <FormLabel>Profile Visibility</FormLabel>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <FormDescription>
                        Allow others to view your profile, public lists and
                        likes
                      </FormDescription>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isDisabled}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4">
                      <FormControl>
                        <FileInput
                          className=""
                          onChange={(file) => onChange(file)}
                          onClear={() => {
                            if (value) {
                              onChange(undefined);
                            } else if (user.image) {
                              onChange(null);
                            }
                          }}
                          disabled={isDisabled}
                          existingImage={user.image}
                          variant="square"
                        />
                      </FormControl>
                      <FormDescription>Maximum size: 4MB</FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Color</FormLabel>
                    <FormDescription>
                      Choose a color for your profile header
                    </FormDescription>
                    <div className="space-y-4">
                      <div
                        className="grid grid-cols-5 gap-3"
                        role="radiogroup"
                        aria-label="Profile header color selection"
                      >
                        {listColourPresets.map((color) => (
                          <ColorSwatch
                            key={color}
                            color={color}
                            selected={field.value === color}
                            onClick={() => field.onChange(color)}
                            disabled={isDisabled}
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
                          disabled={isDisabled}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isDisabled}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isDisabled || !form.formState.isDirty}
              >
                {isDisabled ? (
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
    </Dialog>
  );
};

export default ProfileEditDialog;
