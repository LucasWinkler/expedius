"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/lib/auth-client";
import { SignUpInput, signUpSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";

type SignUpStep = "credentials" | "profile" | "image";

export const SignUpForm = () => {
  const [step, setStep] = useState<SignUpStep>("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const { startUpload, isUploading } = useUploadThing("signUpImage");

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      username: "",
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);

    try {
      let imageUrl: string | undefined;

      if (data.image?.[0]) {
        const uploadResult = await startUpload([data.image[0]]);
        if (!uploadResult) {
          toast.error("Image upload failed", {
            description: "Please try uploading your profile image again.",
          });
          return;
        }

        imageUrl = uploadResult[0].url;
      }

      await signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          username: data.username,
          image: imageUrl,
        },
        {
          onSuccess: () => {
            toast.success("Account created!", {
              description: "Welcome to PoiToGo.",
            });
          },
          onError: (ctx) => {
            toast.error("Registration failed", {
              description: ctx.error.message,
            });
          },
        },
      );
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async (e?: React.MouseEvent<HTMLButtonElement> | Event) => {
    if (e) e.preventDefault();
    if (step === "credentials") {
      const result = await form.trigger([
        "email",
        "password",
        "confirmPassword",
      ]);
      if (!result) return;
      setStep("profile");
    } else if (step === "profile") {
      const result = await form.trigger(["name", "username"]);
      if (!result) return;
      setStep("image");
    }
  };

  const prevStep = () => {
    if (step === "profile") setStep("credentials");
    if (step === "image") setStep("profile");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (step === "image") {
          const submitButton = document.querySelector<HTMLButtonElement>(
            'button[type="submit"]',
          );
          submitButton?.click();
        } else {
          void nextStep(e);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  useEffect(() => {
    const firstInput = document.querySelector<HTMLInputElement>(`form input`);
    firstInput?.focus();
  }, [step]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          {/* Step indicators */}
          <div className="flex justify-center space-x-2">
            {["credentials", "profile", "image"].map((s, i) => (
              <div
                key={s}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  step === s ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="space-y-4">
            {step === "credentials" && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
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
                        <Input type="password" {...field} />
                      </FormControl>
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
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === "profile" && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This will be your unique identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === "image" && (
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Profile Image (Optional)</FormLabel>
                    <FormControl>
                      <FileInput
                        onChange={(files) => onChange(files)}
                        onClear={() => onChange(undefined)}
                        disabled={isUploading}
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
            )}
          </div>
        </div>

        {/* Navigation and submit buttons */}
        <div className="flex justify-between">
          {step !== "credentials" && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="w-[120px]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          {step === "image" ? (
            <Button
              type="submit"
              className="w-[120px]"
              disabled={isLoading || isUploading}
            >
              {isLoading || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Creating..."}
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={(e) => void nextStep(e)}
              className="w-[120px]"
              disabled={isLoading}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  );
};

export default SignUpForm;
