import { ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react";
import { Card } from "../ui/card";
import { useState } from "react";
import type { PlaceDetails } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

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
                <div key={review.name} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={review.authorAttribution.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={review.authorAttribution.photoUri}
                          alt={review.authorAttribution.displayName}
                          width={32}
                          height={32}
                        />
                        <AvatarFallback>
                          {review.authorAttribution.displayName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </a>
                    <a
                      href={review.authorAttribution.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {review.authorAttribution.displayName}
                      <p className="text-xs text-muted-foreground">
                        {review.relativePublishTimeDescription}
                      </p>
                    </a>
                  </div>
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300",
                          )}
                        />
                      ))}
                  </div>
                  <div className="relative">
                    <p
                      className={cn(
                        "text-sm text-muted-foreground",
                        !expandedReviews[review.name] && "line-clamp-3",
                      )}
                    >
                      {review.text?.text || "No review text provided."}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {review.text?.text && review.text.text.length > 150 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs font-medium"
                          onClick={(e) => {
                            e.preventDefault();
                            setExpandedReviews((prev) => ({
                              ...prev,
                              [review.name]: !prev[review.name],
                            }));
                          }}
                        >
                          {expandedReviews[review.name]
                            ? "Show less"
                            : "Read more"}
                        </Button>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <a
                        href={review.googleMapsUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        View on Google <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
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
