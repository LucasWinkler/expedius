import { XCircle } from "lucide-react";
import { memo } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ClearButtonProps {
  onClick: () => void;
  className?: string;
}

export const ClearButton = memo(({ onClick, className }: ClearButtonProps) => (
  <Button
    type="button"
    onClick={onClick}
    variant="ghost"
    size="icon"
    className={cn(
      "absolute right-[5.5rem] top-1/2 -translate-y-1/2 p-0 text-muted-foreground transition-all duration-200 ease-out hover:text-foreground",
      className,
    )}
  >
    <XCircle className="h-4 w-4" />
    <span className="sr-only">Clear search input</span>
  </Button>
));

ClearButton.displayName = "ClearButton";
