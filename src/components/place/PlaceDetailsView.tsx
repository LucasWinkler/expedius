"use client";

import {
  Globe,
  Phone,
  Clock,
  DollarSign,
  Star,
  Share2,
  Navigation,
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

const SaveToListButton = dynamic(
  () =>
    import("../places/SaveToListButton").then((mod) => mod.SaveToListButton),
  { ssr: false },
);

const FEATURES = [
  { key: "dineIn", label: "Dine-in" },
  { key: "takeout", label: "Takeout" },
  { key: "delivery", label: "Delivery" },
  { key: "curbsidePickup", label: "Curbside pickup" },
  { key: "reservable", label: "Reservations" },
  { key: "outdoorSeating", label: "Outdoor seating" },
  { key: "servesBreakfast", label: "Breakfast" },
  { key: "servesLunch", label: "Lunch" },
  { key: "servesDinner", label: "Dinner" },
  { key: "servesBrunch", label: "Brunch" },
  { key: "servesCoffee", label: "Coffee" },
] as const;

interface PlaceDetailsViewProps {
  place: PlaceDetails;
}

export function PlaceDetailsView({ place }: PlaceDetailsViewProps) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(Boolean(navigator?.share));
  }, []);

  const availableFeatures = FEATURES.filter(
    (feature) => place[feature.key as keyof typeof place],
  );

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: place.displayName.text,
      text:
        place.editorialSummary?.text ??
        `Check out ${place.displayName.text} on Poitogo`,
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
    <div className="relative space-y-8 sm:space-y-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-start sm:justify-between sm:py-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {place.displayName.text}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            {place.formattedAddress}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button
            variant="secondary"
            size="icon"
            className={
              "size-9 shrink-0 bg-background/80 backdrop-blur hover:bg-background/90"
            }
            onClick={handleShare}
            title="Share"
          >
            <Share2 aria-hidden="true" />
          </Button>
          <SaveToListButton className="size-9 shrink-0" placeId={place.id} />
          <LikeButton className="size-9 shrink-0" placeId={place.id} />
        </div>
      </div>

      {place.photos?.length && (
        <div className="mx-auto max-w-6xl">
          <PlaceImageCarousel
            photos={place.photos}
            placeName={place.displayName.text}
          />
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[2fr_1fr] [&>*:nth-child(2)]:-order-1 lg:[&>*:nth-child(2)]:order-none">
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
                              : "fill-muted text-muted",
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
              Essential information
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
                    <div className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
                      {place.currentOpeningHours.weekdayDescriptions.map(
                        (day, index) => (
                          <div key={index}>{day}</div>
                        ),
                      )}
                    </div>
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
                Available amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {availableFeatures.map((feature) => (
                  <Badge
                    key={feature.key}
                    variant="secondary"
                    className="rounded-lg bg-muted-foreground/10 px-3.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted-foreground/20"
                  >
                    {feature.label}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
