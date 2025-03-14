import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

interface AuthSubmitButtonProps {
  defaultText: string;
  loadingState?: LoadingState;
  className?: string;
}

export const AuthSubmitButton = ({
  defaultText,
  loadingState,
  className,
}: AuthSubmitButtonProps) => {
  const isLoading = loadingState?.isLoading ?? false;
  const loadingText = loadingState?.loadingText ?? "Loading...";

  return (
    <Button type="submit" disabled={isLoading} className={className}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        defaultText
      )}
    </Button>
  );
};
