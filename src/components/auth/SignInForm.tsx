"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/lib/auth-client";
import { SignInInput, signInSchema } from "@/lib/validations/auth";
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
import { PasswordInput } from "@/components/ui/password-input";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "./";
import { AuthSubmitButton } from "./AuthSubmitButton";

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl") || "/";
  const altActionLink = `/auth/sign-up${callbackURL ? `?callbackUrl=${callbackURL}` : ""}`;

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);

    try {
      await signIn.email(
        { ...data, callbackURL },
        {
          onSuccess: () => {
            toast.success("Welcome back!", {
              description: "You have been successfully signed in.",
            });
          },
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              toast.error("Sign in failed", {
                description: "Please check your email to verify your account.",
              });
              return;
            }

            toast.error("Sign in failed", {
              description: ctx.error.message,
            });
          },
        },
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      heading="Welcome back"
      subheading="Enter your email to sign in to your account"
      altAction="Don't have an account? Sign Up"
      altActionLink={altActionLink}
    >
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
                    type="email"
                    autoComplete="email"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AuthSubmitButton
            defaultText="Sign in"
            loadingState={{ isLoading, loadingText: "Signing in..." }}
          />
          {form.formState.errors.root && (
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignInForm;
