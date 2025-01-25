import { useOptimistic, useTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export const useLike = (placeId: string, initialIsLiked: boolean = false) => {
  const { data: session } = useSession();
  const [baseIsLiked, setBaseIsLiked] = useState(initialIsLiked);
  const [isPending, startTransition] = useTransition();
  const [isInitialized, setIsInitialized] = useState(false);

  const [optimisticLiked, addOptimisticLike] = useOptimistic(
    baseIsLiked,
    (_currentState: boolean, newState: boolean) => newState,
  );

  useEffect(() => {
    const fetchInitialState = async () => {
      // Don't fetch if not authenticated
      if (!session?.user.id) {
        setIsInitialized(true);
        return;
      }

      try {
        const response = await fetch(
          `/api/places/like/status?placeId=${placeId}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch like status");
        }

        const { isLiked } = await response.json();

        setBaseIsLiked(isLiked);
        startTransition(() => {
          addOptimisticLike(isLiked);
        });
      } catch (error) {
        console.error("Failed to fetch initial like state:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchInitialState();
  }, [placeId, addOptimisticLike, session?.user.id]);

  const toggleLike = async () => {
    if (!isInitialized) return;

    // Require authentication to like
    if (!session?.user.id) {
      toast.error("Please sign in to save places");
      return;
    }

    const newState = !optimisticLiked;

    startTransition(async () => {
      try {
        addOptimisticLike(newState);

        const response = await fetch("/api/places/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ placeId }),
        });

        if (!response.ok) {
          throw new Error("Failed to toggle like");
        }

        setBaseIsLiked(newState);
      } catch (error) {
        addOptimisticLike(!newState);
        toast.error("Failed to save place");
        console.error(error);
      }
    });
  };

  return {
    isLiked: optimisticLiked,
    isLoading: !isInitialized || isPending,
    toggleLike,
  };
};
