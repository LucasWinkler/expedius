import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

interface SignUpNextButtonProps {
  nextStep: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isDisabled: boolean;
}

export const SignUpNextButton = ({
  nextStep,
  isDisabled,
}: SignUpNextButtonProps) => {
  return (
    <Button
      type="button"
      onClick={(e) => void nextStep(e)}
      className="w-[120px]"
      disabled={isDisabled}
    >
      Next
      <ArrowRight className="ml-2 size-4" />
    </Button>
  );
};
