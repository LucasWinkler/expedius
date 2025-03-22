"use client";

import {
  Globe,
  Phone,
  Clock,
  DollarSign,
  Star,
  Share2,
  Navigation,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Dot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaceDetails } from "@/types";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProxiedImage } from "../ui/ProxiedImage";
import { LikeButton } from "../places/LikeButton";
import { PlaceImageCarousel } from "./PlaceImageCarousel";
import { PLACE_FEATURES } from "@/constants/places";
import { formatBooleanFeatures, formatPlaceType } from "@/utils/places";
import { getPriceLevelDisplayShort } from "@/lib/place";
import { PlaceDetailsHeader } from "./PlaceDetailsHeader";
import Link from "next/link";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SaveToListButton = dynamic(
  () =>
    import("../places/SaveToListButton").then((mod) => mod.SaveToListButton),
  { ssr: false },
);

interface PlaceDetailsViewProps {
  place: PlaceDetails;
}

export function PlaceDetailsView({ place }: PlaceDetailsViewProps) {
  const [canShare, setCanShare] = useState(false);
  const [showAllHours, setShowAllHours] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setCanShare(Boolean(navigator?.share));
  }, []);

  const availableFeatures = formatBooleanFeatures(place, PLACE_FEATURES);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: place.displayName.text,
      text:
        place.editorialSummary?.text ??
        `Check out ${place.displayName.text} on Expedius`,
      url: shareUrl,
    };

    try {
      if (canShare) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  return (
    <article className="container relative mx-auto space-y-6 px-4 py-8 sm:space-y-8 md:py-12 xl:max-w-7xl xl:space-y-12 xl:py-16">
      <PlaceDetailsHeader
        displayName={place.displayName}
        rating={place.rating}
        userRatingCount={place.userRatingCount}
        priceLevel={place.priceLevel}
        types={place.types}
        googleMapsLinks={place.googleMapsLinks}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {place.photos?.length && (
            <PlaceImageCarousel
              photos={place.photos}
              placeName={place.displayName.text}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <Card className="mb-6 p-6">
            <h2 className="mb-4 text-xl font-semibold">Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <a
                    href={place.googleMapsLinks.directionsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {place.formattedAddress}
                  </a>
                </div>
              </div>
              {place.internationalPhoneNumber && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <a
                        href={`tel:${place.internationalPhoneNumber}`}
                        className="text-primary hover:underline"
                      >
                        {place.internationalPhoneNumber}
                      </a>
                    </div>
                  </div>
                </>
              )}
              {place.websiteUri && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Website</h3>
                      <Link
                        href={place.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {new URL(place.websiteUri).hostname}
                      </Link>
                    </div>
                  </div>
                </>
              )}
              {place.currentOpeningHours && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Hours</h3>
                        <p
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-sm font-medium",
                            place.currentOpeningHours.openNow
                              ? "bg-green-500/20 text-green-600"
                              : "bg-red-500/20 text-red-600",
                          )}
                        >
                          {place.currentOpeningHours.openNow
                            ? "Open"
                            : "Closed"}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-col items-start gap-1 text-sm">
                        {place.currentOpeningHours.weekdayDescriptions
                          ?.slice(0, showAllHours ? undefined : 3)
                          .map((day, index) => (
                            <p key={index} className="text-muted-foreground">
                              {day}
                            </p>
                          ))}
                        {place.currentOpeningHours.weekdayDescriptions &&
                          place.currentOpeningHours.weekdayDescriptions.length >
                            3 && (
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-2 flex h-auto items-center gap-1 p-0"
                              onClick={() => setShowAllHours(!showAllHours)}
                            >
                              {showAllHours ? (
                                <>
                                  Show less <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  Show all hours{" "}
                                  <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </Button>
                          )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Popular Reviews</h2>
            <a
              href={place.googleMapsLinks.reviewsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-flex justify-center rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 active:scale-95"
            >
              View all reviews on Google Maps{" "}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            <div className="space-y-4">
              {place.reviews && place.reviews.length > 0 ? (
                <>
                  {place.reviews
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
                            {review.text?.text &&
                              review.text.text.length > 150 && (
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
                              View on Google{" "}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        {index < reviewsArray.length - 1 &&
                          (showAllReviews || index < 1) && (
                            <Separator className="mt-2" />
                          )}
                      </div>
                    ))}
                  {place.reviews && place.reviews?.length > 2 && (
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
        </div>
      </div>

      {/* <div className="grid gap-12 lg:grid-cols-[2fr_1fr] [&>*:nth-child(2)]:-order-1 lg:[&>*:nth-child(2)]:order-none">
        <div className="space-y-12">
          {place.editorialSummary && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                About this place
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {place.editorialSummary.text}
              </p>
            </section>
          )}

          {place.reviews && place.reviews.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Popular reviews
                </h2>
                <p className="text-muted-foreground">
                  Recent and helpful reviews from Google at{" "}
                  {place.displayName.text}
                </p>
              </div>
              <div className="divide-y divide-border">
                {place.reviews.map((review) => (
                  <div
                    key={review.name}
                    className="space-y-4 py-6 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      {review.authorAttribution.photoUri && (
                        <ProxiedImage
                          src={review.authorAttribution.photoUri}
                          alt={review.authorAttribution.displayName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          {review.authorAttribution.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.relativePublishTimeDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-300 text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    {review.text && (
                      <p className="text-muted-foreground">
                        {review.text.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <section className="space-y-6 rounded-xl bg-muted p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Essential Information
            </h2>
            <div className="space-y-4">
              {place.websiteUri && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted-foreground/10">
                    <Globe className="h-4 w-4 text-foreground" />
                  </div>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-base font-medium text-primary decoration-primary/30 underline-offset-4 hover:text-primary hover:underline"
                    asChild
                  >
                    <a
                      href={place.websiteUri}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit website
                    </a>
                  </Button>
                </div>
              )}
              {place.internationalPhoneNumber && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted-foreground/10">
                    <Phone className="h-4 w-4 text-foreground" />
                  </div>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-base font-medium text-primary decoration-primary/30 underline-offset-4 hover:text-primary hover:underline"
                    asChild
                  >
                    <a
                      href={`tel:${place.internationalPhoneNumber.replace(/\s+/g, "")}`}
                    >
                      {place.internationalPhoneNumber}
                    </a>
                  </Button>
                </div>
              )}

              {place.formattedAddress && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted-foreground/10">
                    <Navigation className="h-4 w-4 text-foreground" />
                  </div>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-base font-medium text-primary decoration-primary/30 underline-offset-4 hover:text-primary hover:underline"
                    asChild
                  >
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${place.displayName.text} ${place.formattedAddress}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get directions
                    </a>
                  </Button>
                </div>
              )}

              {place.currentOpeningHours && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted-foreground/10">
                    <Clock className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <div
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-sm font-medium",
                        place.currentOpeningHours.openNow
                          ? "bg-green-500/20 text-green-600"
                          : "bg-red-500/20 text-red-600",
                      )}
                    >
                      {place.currentOpeningHours.openNow
                        ? "Open now"
                        : "Closed"}
                    </div>
                    {place.currentOpeningHours.weekdayDescriptions && (
                      <div className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
                        {place.currentOpeningHours.weekdayDescriptions?.map(
                          (day, index) => <div key={index}>{day}</div>,
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {place.priceRange && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted-foreground/10">
                    <DollarSign className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="text-base font-medium">
                    Average {place.priceRange.startPrice.units} -{" "}
                    {place.priceRange.endPrice.units}{" "}
                    {place.priceRange.startPrice.currencyCode}
                  </span>
                </div>
              )}
            </div>
          </section>

          {availableFeatures.length > 0 && (
            <section className="space-y-6 rounded-xl bg-muted p-6">
              <h2 className="text-xl font-semibold tracking-tight">
                Available Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {availableFeatures.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="rounded-lg bg-muted-foreground/10 px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted-foreground/20"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </div> */}
    </article>
  );
}
