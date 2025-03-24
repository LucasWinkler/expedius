"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { usePlaceInteractions } from "@/hooks/usePlaceInteractions";
import { useLikesInfinite } from "@/hooks/useLikes";

interface LikeButtonProps {
  placeId: string;
  username?: string;
  variant?: "icon" | "outline";
  size?: "sm" | "lg" | "default";
}

export const LikeButton = ({
  placeId,
  username,
  variant = "icon",
  size = "default",
}: LikeButtonProps) => {
  const { data: session } = useSession();
  const { data: userData, like } = usePlaceInteractions();
  const { toggle: toggleLike, isPending } = like;
  const isInLikesTab = !!username;
  const isOwner = session?.user.username === username;
  const shouldUpdateLikesQuery = isInLikesTab && isOwner;
  const likesQuery = useLikesInfinite(username ?? "", shouldUpdateLikesQuery);

  const isLiked = userData?.likes.some((like) => like.placeId === placeId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Please sign in to like places");
      return;
    }

    if (shouldUpdateLikesQuery && isLiked) {
      likesQuery.removeLike(placeId);
    }

    toggleLike(placeId, {
      onError: (error) => {
        toast.error("Failed to update like", {
          description: error.message,
        });
        if (shouldUpdateLikesQuery && isLiked) {
          likesQuery.refetch();
        }
      },
    });
  };

  if (variant === "outline") {
    return (
      <Button
        variant="outline"
        size={size}
        className={cn(
          "group/btn transition-all duration-100 ease-out hover:bg-muted/75",
          isLiked
            ? "fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
            : "fill-transparent hover:fill-red-500 hover:text-red-500",
        )}
        onClick={handleClick}
        disabled={isPending}
      >
        <Heart
          className={cn(
            "size-4 fill-transparent transition-all duration-100 ease-out group-hover/btn:fill-current",
            isLiked && "fill-current",
          )}
          aria-hidden="true"
        />
        {isLiked ? "Liked" : "Like"}
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        "group/btn size-8 bg-background/80 backdrop-blur transition-all duration-100 ease-out hover:bg-background/90",
        isLiked
          ? "fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
          : "fill-transparent hover:fill-red-500 hover:text-red-500",
      )}
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart
        className={cn(
          "size-4 fill-transparent transition-all duration-100 ease-out group-hover/btn:fill-current",
          isLiked && "fill-current",
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{isLiked ? "Unlike place" : "Like place"}</span>
    </Button>
  );
};

export default LikeButton;
