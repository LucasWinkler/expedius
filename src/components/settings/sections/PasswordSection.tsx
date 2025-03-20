"use client";

import { useState } from "react";
import { SettingsSection } from "../components/SettingsSection";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { minPasswordLength } from "@/constants";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/components/auth/SignUpSteps/PasswordRequirements";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z
      .string()
      .trim()
      .min(
        minPasswordLength,
        `Password must be at least ${minPasswordLength} characters`,
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function PasswordSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = useWatch({
    control: form.control,
    name: "newPassword",
    defaultValue: "",
  });

  async function onSubmit(data: ChangePasswordValues) {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      });

      setIsSuccess(true);
      toast.success("Password changed successfully", {
        description: "Your password has been updated",
      });
      form.reset();
    } catch (error) {
      toast.error("Failed to change password", {
        description: "Please make sure your current password is correct",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingsSection title="Password" description="Change your password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your current password"
                    disabled={isLoading}
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter new password"
                    disabled={isLoading}
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <PasswordRequirements password={newPassword} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Changing...
                </>
              ) : isSuccess ? (
                "Password Changed"
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </SettingsSection>
  );
}
