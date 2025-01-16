import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInput, signUpSchema } from "@/lib/validations/auth";
import { useUploadThing } from "@/lib/uploadthing";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { checkUsernameAvailability } from "@/server/actions/user";

export type SignUpStep = "credentials" | "profile" | "image";

export const useSignUpForm = () => {
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

      const username = form.getValues("username");
      const { available } = await checkUsernameAvailability(username);

      if (!available) {
        form.setError("username", {
          type: "manual",
          message: "This username is already taken",
        });
        return;
      }

      setStep("image");
    }
  };

  const prevStep = () => {
    if (step === "profile") setStep("credentials");
    if (step === "image") setStep("profile");
  };

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
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    step,
    isLoading,
    isUploading,
    nextStep,
    prevStep,
    onSubmit,
  };
};
