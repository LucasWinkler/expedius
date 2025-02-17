"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { usePlaceInteractions } from "@/hooks/usePlaceInteractions";

interface LikeButtonProps {
  placeId: string;
  className?: string;
}

export const LikeButton = ({ placeId, className }: LikeButtonProps) => {
  const { data: session } = useSession();
  const { data: userData, like } = usePlaceInteractions();
  const { toggle: toggleLike, isPending } = like;

  const isLiked = userData?.likes.some((like) => like.placeId === placeId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to like places");
      return;
    }

    toggleLike(placeId, {
      onError: (error) =>
        toast.error("Failed to update like", {
          description: error.message,
        }),
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "size-8 bg-background/80 backdrop-blur hover:bg-background/90",
        isLiked && "text-red-500 hover:text-red-600",
        className,
      )}
      onClick={handleClick}
      disabled={isPending}
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
