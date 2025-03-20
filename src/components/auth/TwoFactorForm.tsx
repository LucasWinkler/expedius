"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthCard } from "./";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";

const twoFactorSchema = z.object({
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(6, "Code must be 6 characters"),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

interface TwoFactorFormProps {
  callbackURL?: string;
}

export const TwoFactorForm = ({ callbackURL = "/" }: TwoFactorFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);
  const router = useRouter();

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: TwoFactorFormValues) => {
    setIsLoading(true);

    try {
      await authClient.twoFactor.verifyTotp({
        code: data.code,
        trustDevice: trustDevice,
      });

      toast.success("Successfully authenticated", {
        description: "You have been signed in securely.",
      });

      router.push(callbackURL);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err?.status === 400 || err?.message?.includes("code")) {
        toast.error("Invalid verification code", {
          description: "Please check the code and try again.",
        });
      } else {
        toast.error("Verification failed", {
          description: "An error occurred. Please try again later.",
        });
      }
      console.error("2FA Verification Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      heading="Two-Factor Authentication"
      subheading="Enter the 6-digit code from your authenticator app"
      altAction="Return to sign in"
      altActionLink={`/auth/sign-in${callbackURL ? `?callbackUrl=${callbackURL}` : ""}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="trust-device"
              checked={trustDevice}
              onCheckedChange={(checked: CheckedState) =>
                setTrustDevice(checked === true)
              }
            />
            <label
              htmlFor="trust-device"
              className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Trust this device for 60 days (won&apos;t need 2FA codes when
              signing in)
            </label>
          </div>

          <AuthSubmitButton
            defaultText="Verify"
            loadingState={{ isLoading, loadingText: "Verifying..." }}
          />
        </form>
      </Form>
    </AuthCard>
  );
};

export default TwoFactorForm;
