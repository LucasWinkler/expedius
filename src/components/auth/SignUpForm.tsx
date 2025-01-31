"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { CredentialsStep } from "./SignUpSteps/CredentialsStep";
import { ProfileStep } from "./SignUpSteps/ProfileStep";
import { FinalStep } from "./SignUpSteps/FinalStep";
import { StepIndicator } from "./SignUpSteps/StepIndicator";
import AuthCard from "./AuthCard";

export const SignUpForm = () => {
  const {
    form,
    step,
    isLoading,
    isUploading,
    nextStep,
    prevStep,
    onSubmit,
    altActionLink,
  } = useSignUpForm();

  const isDisabled = isUploading || isLoading;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (step === "final") {
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
    <AuthCard
      heading="Create an account"
      subheading="Enter your details below to create your account"
      altAction="Already have an account? Sign In"
      altActionLink={altActionLink}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <StepIndicator currentStep={step} />
            {step === "credentials" && (
              <CredentialsStep isDisabled={isDisabled} form={form} />
            )}
            {step === "profile" && (
              <ProfileStep isDisabled={isDisabled} form={form} />
            )}
            {step === "final" && (
              <FinalStep form={form} isDisabled={isDisabled} />
            )}
          </div>

          <div className="flex justify-between">
            {step !== "credentials" && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="w-[120px]"
                disabled={isDisabled}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
            )}

            {step === "final" ? (
              <Button type="submit" className="w-[120px]" disabled={isDisabled}>
                {isDisabled ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
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
                disabled={isDisabled}
              >
                Next
                <ArrowRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignUpForm;
