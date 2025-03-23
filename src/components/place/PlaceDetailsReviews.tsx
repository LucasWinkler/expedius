"use client";

import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Card } from "../ui/card";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import type { PlaceDetails } from "@/types";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { PlaceReviewItem } from "./PlaceReviewItem";

interface PlaceDetailsReviewsProps {
  googleMapsLinks: PlaceDetails["googleMapsLinks"];
  reviews: PlaceDetails["reviews"];
}

export const PlaceDetailsReviews = ({
  googleMapsLinks,
  reviews,
}: PlaceDetailsReviewsProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [truncatedReviews, setTruncatedReviews] = useState<
    Record<string, boolean>
  >({});
  const [initialLoading, setInitialLoading] = useState(true);
  const reviewRefs = useRef<Record<string, HTMLParagraphElement | null>>({});
  const rafRef = useRef<number | null>(null);

  const checkTruncation = useCallback(
    (isInitialCheck = false) => {
      if (!reviews) return;

      // Cancel any existing animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // First trigger a layout calculation with useLayoutEffect
      // Then use requestAnimationFrame to ensure layout is complete
      const runCheck = () => {
        rafRef.current = requestAnimationFrame(() => {
          const newTruncatedReviews: Record<string, boolean> = {};

          reviews.forEach((review) => {
            const element = reviewRefs.current[review.name];
            if (element) {
              // If scrollHeight > clientHeight, the content is truncated
              newTruncatedReviews[review.name] =
                element.scrollHeight > element.clientHeight;
            }
          });

          setTruncatedReviews(newTruncatedReviews);

          if (isInitialCheck) {
            setInitialLoading(false);
          }

          rafRef.current = null;
        });
      };

      // Use a microtask to run after the current render cycle
      Promise.resolve().then(runCheck);

      // Return a cleanup function
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      };
    },
    [reviews],
  );

  // Check truncation on initial render and when reviews change
  useLayoutEffect(() => {
    setInitialLoading(true);

    const cleanup = checkTruncation(true);
    return () => cleanup && cleanup();
  }, [checkTruncation, reviews]);

  // Check truncation on window resize
  useEffect(() => {
    const handleResize = () => {
      // Debouncing for resize events
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        checkTruncation(false);
        rafRef.current = null;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [checkTruncation]);

  const handleReviewExpand = (reviewName: string, expanded: boolean) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewName]: expanded,
    }));
  };

  const setReviewRef = (
    reviewName: string,
    el: HTMLParagraphElement | null,
  ) => {
    reviewRefs.current[reviewName] = el;
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Popular Reviews</h2>
      <a
        href={googleMapsLinks.reviewsUri}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 inline-flex justify-center rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 active:scale-95"
      >
        View all reviews on Google Maps{" "}
        <ExternalLink className="ml-1 h-3 w-3" />
      </a>
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          <>
            {reviews
              ?.slice(0, showAllReviews ? undefined : 2)
              .map((review, index, reviewsArray) => (
                <div key={review.name}>
                  <PlaceReviewItem
                    review={review}
                    isLoading={initialLoading}
                    isTruncated={!!truncatedReviews[review.name]}
                    isExpanded={!!expandedReviews[review.name]}
                    onExpand={(expanded) =>
                      handleReviewExpand(review.name, expanded)
                    }
                    onRef={(el) => setReviewRef(review.name, el)}
                  />
                  {index < reviewsArray.length - 1 &&
                    (showAllReviews || index < 1) && (
                      <Separator className="mt-2" />
                    )}
                </div>
              ))}
            {reviews && reviews?.length > 2 && (
              <Button
                variant="link"
                size="sm"
                className="mt-2 flex h-auto items-center gap-1 p-0"
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? (
                  <>
                    Show less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    See all reviews <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            No reviews available.
          </p>
        )}
      </div>
    </Card>
  );
};
