"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveToListDropdown } from "./SaveToListDropdown";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { usePlaceInteractions } from "@/hooks/usePlaceInteractions";

interface SaveToListButtonProps {
  placeId: string;
  variant?: "icon" | "outline";
  size?: "sm" | "lg" | "default";
}

export const SaveToListButton = ({
  placeId,
  variant = "icon",
  size = "default",
}: SaveToListButtonProps) => {
  const { data: session } = useSession();
  const { data: userData } = usePlaceInteractions();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isSaved = userData?.lists.some((list) =>
    list.savedPlaces?.some((place) => place.placeId === placeId),
  );

  const handleOpenChange = (open: boolean) => {
    if (open && !session) {
      toast.error("Please sign in to save places to lists");
      return;
    }
    setIsDropdownOpen(open);
  };

  if (variant === "outline") {
    return (
      <SaveToListDropdown
        placeId={placeId}
        open={isDropdownOpen}
        onOpenChange={handleOpenChange}
      >
        <Button
          variant="outline"
          size={size}
          className={cn(
            "group/btn transition-all duration-100 ease-out hover:bg-muted/75",
            isSaved
              ? "fill-primary text-primary hover:fill-blue-700 hover:text-blue-700"
              : "fill-transparent hover:fill-primary hover:text-primary",
          )}
          onClick={(e) => e.preventDefault()}
        >
          <Bookmark
            className={cn(
              "size-4 fill-transparent transition-all duration-100 ease-out group-hover/btn:fill-current",
              isSaved && "fill-current",
            )}
            aria-hidden="true"
          />
          {isSaved ? "Saved" : "Save"}
        </Button>
      </SaveToListDropdown>
    );
  }

  return (
    <SaveToListDropdown
      placeId={placeId}
      open={isDropdownOpen}
      onOpenChange={handleOpenChange}
    >
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "group/btn size-8 bg-background/80 backdrop-blur transition-all duration-100 ease-out hover:bg-background/90",
          isSaved
            ? "fill-primary text-primary hover:fill-blue-700 hover:text-blue-700"
            : "fill-transparent hover:fill-primary hover:text-primary",
        )}
        onClick={(e) => e.preventDefault()}
      >
        <Bookmark
          className={cn(
            "size-4 fill-transparent transition-all duration-100 ease-out group-hover/btn:fill-current",
            isSaved && "fill-current",
          )}
          aria-hidden="true"
        />
        <span className="sr-only">Save to list(s)</span>
      </Button>
    </SaveToListDropdown>
  );
};
