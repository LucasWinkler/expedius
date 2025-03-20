"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import {
  ForgotPasswordInput,
  forgotPasswordSchema,
} from "@/lib/validations/auth";
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
import { useSearchParams } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/";

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/auth/reset-password",
      });
      setIsEmailSent(true);
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      heading={isEmailSent ? "Check your email" : "Reset your password"}
      subheading={
        isEmailSent
          ? "We've sent you a password reset link. Please check your email."
          : "Enter your email and we'll send you a link to reset your password."
      }
      altAction="Remember your password? Sign in"
      altActionLink={`/auth/sign-in${callbackURL ? `?callbackUrl=${callbackURL}` : ""}`}
    >
      {!isEmailSent ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
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
                  Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you don&apos;t receive an email within a few minutes, please
            check your spam folder or try again.
          </p>
          <Button onClick={() => setIsEmailSent(false)} className="w-full">
            Try again
          </Button>
        </div>
      )}
    </AuthCard>
  );
};
