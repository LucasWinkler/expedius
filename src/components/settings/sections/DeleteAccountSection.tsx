"use client";

import { useState } from "react";
import { SettingsSection } from "../components/SettingsSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient, signOut } from "@/lib/auth-client";
import { Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmation: z.string().refine(
    (val) => {
      return val === "delete my account" || val === "";
    },
    {
      message: "Please type 'delete my account' exactly",
    },
  ),
});

type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;

export function DeleteAccountSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const form = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmation: "",
    },
  });

  async function onSubmit(data: DeleteAccountValues) {
    if (data.confirmation !== "delete my account") {
      form.setError("confirmation", {
        message: "Please type 'delete my account' exactly",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authClient.deleteUser({
        password: data.password,
      });

      if (response.error) {
        throw new Error(response.error.code);
      }

      toast.info("Confirmation email sent", {
        description:
          "We've sent a confirmation email to your account. Please check your inbox.",
        duration: 6000,
      });
      setShowConfirmDialog(false);
      form.reset();
      await signOut();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "INVALID_PASSWORD") {
          toast.error("Invalid password", {
            description: "Please check your password and try again",
          });
        } else {
          toast.error("Failed to delete account", {
            description: "An error occurred. Please try again later",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleDialogClose(isOpen: boolean) {
    setShowConfirmDialog(isOpen);

    if (!isOpen) {
      form.reset();
    }
  }

  return (
    <SettingsSection
      title="Delete Account"
      description="Permanently delete your account and all of your data"
    >
      <div className="space-y-4">
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4">
          <div className="flex items-start">
            <Trash2 className="mr-3 mt-0.5 size-5 text-destructive" />
            <div>
              <h3 className="text-base font-medium text-destructive">
                Warning: This action is irreversible
              </h3>
              <p className="text-sm text-muted-foreground">
                Deleting your account will permanently remove all your data,
                including lists, likes, and profile information. This action
                cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={handleDialogClose}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 size-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your account and all associated
                  data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 py-2"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enter your password to confirm</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Your current password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Type &quot;delete my account&quot; to confirm
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="delete my account" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel onClick={() => form.reset()}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Deleting..." : "Delete Account"}
                    </Button>
                  </AlertDialogFooter>
                </form>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </SettingsSection>
  );
}
