"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { CredentialsStep } from "./SignUpSteps/CredentialsStep";
import { ProfileStep } from "./SignUpSteps/ProfileStep";
import { ImageStep } from "./SignUpSteps/ImageStep";
import { StepIndicator } from "./SignUpSteps/StepIndicator";

export const SignUpForm = () => {
  const { form, step, isLoading, isUploading, nextStep, prevStep, onSubmit } =
    useSignUpForm();

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
  }, [step, nextStep]);

  useEffect(() => {
    const firstInput = document.querySelector<HTMLInputElement>(`form input`);
    firstInput?.focus();
  }, [step]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <StepIndicator currentStep={step} />

          {step === "credentials" && <CredentialsStep form={form} />}
          {step === "profile" && <ProfileStep form={form} />}
          {step === "image" && (
            <ImageStep form={form} isUploading={isUploading} />
          )}
        </div>

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
      </form>
    </Form>
  );
};

export default SignUpForm;
