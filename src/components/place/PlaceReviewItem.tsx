"use client";

import { ExternalLink, Star } from "lucide-react";
import type { PlaceDetails } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface PlaceReviewItemProps {
  review: NonNullable<PlaceDetails["reviews"]>[number];
  isLoading: boolean;
  isTruncated: boolean;
  isExpanded: boolean;
  onExpand: (expanded: boolean) => void;
  onRef: (el: HTMLParagraphElement | null) => void;
}

export const PlaceReviewItem = ({
  review,
  isLoading,
  isTruncated,
  isExpanded,
  onExpand,
  onRef,
}: PlaceReviewItemProps) => {
  return (
    <div className="flex flex-col gap-2">
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
        {review.text?.text ? (
          <p
            ref={onRef}
            className={cn(
              "text-sm text-muted-foreground",
              !isExpanded && "line-clamp-3",
            )}
          >
            {review.text.text}
          </p>
        ) : null}
        <div className="mt-1 flex items-center gap-1">
          {isLoading && review.text?.text ? (
            <>
              <Skeleton className="h-4 w-16" />
              <span className="text-muted-foreground">•</span>
            </>
          ) : (
            isTruncated &&
            review.text?.text && (
              <>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    onExpand(!isExpanded);
                  }}
                >
                  {isExpanded ? "Show less" : "Read more"}
                </Button>
                <span className="text-muted-foreground">•</span>
              </>
            )
          )}
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
    </div>
  );
};
