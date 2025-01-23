"use client";

import { useTransition } from "react";
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
import { FileInput } from "@/components/ui/file-input";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import type { User } from "@/server/db/schema";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/lib/validations/user";
import { updateProfile } from "@/server/actions/user";

type EditProfileDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: User) => void;
};

export const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditProfileDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const { startUpload, isUploading } = useUploadThing("updateProfileImage");

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      bio: user.bio ?? "",
      isPublic: user.isPublic ?? false,
    },
  });

  const isDisabled = isUploading || isPending;
  const canChangeUsername =
    !user.usernameUpdatedAt ||
    user.usernameUpdatedAt < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const onSubmit = async (data: UpdateProfileInput) => {
    startTransition(async () => {
      try {
        let imageUrl: string | null | undefined = user.image;

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
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!canChangeUsername || isDisabled}
                      />
                    </FormControl>
                    <FormDescription>
                      {canChangeUsername
                        ? "Choose a unique username"
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
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isDisabled}
                        className="resize-none"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <FileInput
                        onChange={(files) => onChange(files)}
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
                    <FormDescription>
                      Recommended size: 400x400px. Maximum size: 4MB
                    </FormDescription>
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
                        Public Profile
                      </FormLabel>
                      <FormDescription>
                        Allow others to view your profile and public lists
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isDisabled}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isDisabled}>
                {isDisabled ? (
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
    </Dialog>
  );
};

export default EditProfileDialog;
