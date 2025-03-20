"use client";

import { useState } from "react";
import { SettingsSection } from "../components/SettingsSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface EmailSectionProps {
  currentEmail: string;
  emailVerified: boolean;
}

const changeEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
});

type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export function EmailSection({
  currentEmail,
  emailVerified,
}: EmailSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  async function onSubmit(data: ChangeEmailValues) {
    if (data.newEmail === currentEmail) {
      toast.error("New email must be different from your current email");
      return;
    }

    setIsLoading(true);
    try {
      await authClient.changeEmail({
        newEmail: data.newEmail,
        callbackURL: "/settings",
      });

      setIsEmailSent(true);
      toast.success("Verification email sent", {
        description: "Please check your current email to verify the change",
      });
      form.reset();
    } catch (error) {
      toast.error("Failed to request email change", {
        description: "Please try again later",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    setIsLoading(true);
    try {
      await authClient.sendVerificationEmail({
        email: currentEmail,
        callbackURL: "/settings",
      });

      toast.success("Verification email sent", {
        description: "Please check your inbox to verify your email address",
      });
    } catch (error) {
      toast.error("Failed to send verification email", {
        description: "Please try again later",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SettingsSection title="Email" description="Manage your email settings">
      <div className="space-y-6">
        <div>
          <div className="flex items-start gap-4">
            <div className="space-y-1">
              <p className="font-medium">Current Email</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{currentEmail}</span>
                {emailVerified ? (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-50 text-green-700 hover:bg-green-50"
                  >
                    <Check className="mr-1 size-3" /> Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="ml-2 bg-amber-50 text-amber-700 hover:bg-amber-50"
                  >
                    Not Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {!emailVerified && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`mr-2 size-3 ${isLoading ? "animate-spin" : ""}`}
                />
                Resend Verification
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-medium">Change Email</p>
            <p className="text-sm text-muted-foreground">
              Update your email address
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          placeholder="Enter new email address"
                          disabled={isLoading || isEmailSent}
                          className="w-full"
                          {...field}
                        />
                        <Button
                          type="submit"
                          disabled={isLoading || isEmailSent}
                          className="w-full sm:w-auto sm:self-start"
                        >
                          {isLoading ? "Processing..." : "Change"}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {isEmailSent && (
            <p className="text-sm text-muted-foreground">
              A verification email has been sent to your current email address.
              Please check your inbox to confirm the change.
            </p>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
