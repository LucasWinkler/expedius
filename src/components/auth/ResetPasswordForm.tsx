"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PasswordRequirements } from "./SignUpSteps/PasswordRequirements";
import { useWatch } from "react-hook-form";

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      toast.error("Invalid or missing reset token");
    }
  }, [searchParams]);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({
    control: form.control,
    name: "password",
    defaultValue: "",
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setIsLoading(true);
    try {
      await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      toast.success("Password reset successful");
      router.push("/auth/sign-in");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthCard
        heading="Invalid Link"
        subheading="The password reset link is invalid or has expired."
        altAction="Return to sign in"
        altActionLink="/auth/sign-in"
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Please request a new password reset link.
          </p>
          <Button
            onClick={() => router.push("/auth/forgot-password")}
            variant="outline"
            className="mt-4 w-full"
          >
            Request new link
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      heading="Reset your password"
      subheading="Enter a new password for your account"
      altAction="Return to sign in"
      altActionLink="/auth/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                </FormControl>
                <PasswordRequirements password={password} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};
