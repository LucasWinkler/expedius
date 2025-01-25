import { cn } from "@/lib/utils";
import type { SignUpStep } from "@/hooks/useSignUpForm";

type StepIndicatorProps = {
  currentStep: SignUpStep;
};

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2">
      {["credentials", "profile", "final"].map((step) => (
        <div
          key={step}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            currentStep === step ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
};
