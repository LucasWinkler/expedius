import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useLike } from "@/hooks/useLike";

interface LikeButtonProps {
  placeId: string;
}

export const LikeButton = ({ placeId }: LikeButtonProps) => {
  const { isLiked, isLoading, toggleLike } = useLike(placeId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoading) {
      toggleLike();
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn(
        "size-10 bg-white/20 shadow-md backdrop-blur-md transition-all duration-200 ease-out hover:bg-white/30 active:scale-90 [&_svg]:size-5",
        isLoading && "pointer-events-none",
        "disabled:opacity-100",
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          "text-white transition-colors",
          isLiked && "fill-rose-500 text-rose-500",
        )}
      />
    </Button>
  );
};

export default LikeButton;
