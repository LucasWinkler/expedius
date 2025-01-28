"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLike } from "@/hooks/useLike";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface LikeButtonProps {
  placeId: string;
  initialIsLiked: boolean;
}

export const LikeButton = ({ placeId, initialIsLiked }: LikeButtonProps) => {
  const { data: session } = useSession();
  const { isLiked, toggleLike } = useLike(placeId, initialIsLiked, !!session);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to like places");
      return;
    }

    toggleLike();
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "size-8 bg-background/80 backdrop-blur hover:bg-background/90",
        isLiked && "text-red-500 hover:text-red-600",
      )}
      onClick={handleClick}
    >
      <Heart
        className={cn("size-4", isLiked && "fill-current")}
        aria-hidden="true"
      />

      <span className="sr-only">{isLiked ? "Unlike place" : "Like place"}</span>
    </Button>
  );
};

export default LikeButton;
