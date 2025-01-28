import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  onLoadMore: () => Promise<void>;
  hasNextPage?: boolean;
  isLoading?: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasNextPage = false,
  isLoading = false,
  threshold = 0.1,
}: UseInfiniteScrollProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isLoading) {
          void onLoadMore();
        }
      },
      { threshold },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onLoadMore, hasNextPage, isLoading, threshold]);

  return loadMoreRef;
};
