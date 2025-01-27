import { useTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useLists } from "@/contexts/ListsContext";

export const useLike = (placeId: string) => {
  const { data: session } = useSession();
  const { isPlaceLiked, updatePlaceLikeStatus, isLoadingLikes } = useLists();
  const [isPending, startTransition] = useTransition();

  const [optimisticLiked, addOptimisticLike] = useOptimistic(
    isPlaceLiked(placeId),
    (currentState: boolean, newState: boolean) => newState,
  );

  const toggleLike = async () => {
    if (!session?.user.id) {
      toast.error("Please sign in to save places");
      return;
    }

    const newState = !optimisticLiked;

    startTransition(async () => {
      try {
        addOptimisticLike(newState);
        updatePlaceLikeStatus(placeId, newState);

        const response = await fetch("/api/places/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ placeId }),
        });

        if (!response.ok) throw new Error("Failed to toggle like");
      } catch (error) {
        addOptimisticLike(!newState);
        updatePlaceLikeStatus(placeId, !newState);
        toast.error("Failed to save place");
        console.error(error);
      }
    });
  };

  return {
    isLiked: optimisticLiked,
    isLoading: isPending || isLoadingLikes,
    toggleLike,
  };
};
