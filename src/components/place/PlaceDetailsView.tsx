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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import fallbackImage from "@/../public/place-image-fallback.webp";
import { ProxiedImage } from "../ui/ProxiedImage";
import { LikeButton } from "../places/LikeButton";

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
  image?: {
    url: string;
    base64: string;
    width: number;
    height: number;
  };
}

export function PlaceDetailsView({ place, image }: PlaceDetailsViewProps) {
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
    <div className="relative space-y-8">
      <div className="sticky top-16 z-20 -mx-4 flex items-start justify-between gap-4 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{place.displayName.text}</h1>
          <p className="text-muted-foreground">{place.formattedAddress}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <SaveToListButton placeId={place.id} />
          <LikeButton placeId={place.id} />
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <ProxiedImage
          src={image?.url ?? fallbackImage}
          alt={place.displayName.text}
          className="object-cover transition-opacity duration-300"
          priority
          placeholder="blur"
          blurDataURL={image?.base64}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          width={image?.width}
          height={image?.height}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr] [&>*:nth-child(2)]:-order-1 md:[&>*:nth-child(2)]:order-none">
        <div className="space-y-6">
          {place.editorialSummary && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{place.editorialSummary.text}</p>
              </CardContent>
            </Card>
          )}

          {place.reviews && place.reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  What people are saying about {place.displayName.text}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {place.reviews.map((review) => (
                  <div key={review.name} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {review.authorAttribution.photoUri && (
                        <ProxiedImage
                          src={review.authorAttribution.photoUri}
                          alt={review.authorAttribution.displayName}
                          width={32}
                          height={32}
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
                    {review.text && <p>{review.text.text}</p>}
                    <Separator />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {place.websiteUri && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Button variant="link" className="h-auto p-0" asChild>
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
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <Button variant="link" className="h-auto p-0" asChild>
                    <a
                      href={`tel:${place.internationalPhoneNumber.replace(/\s+/g, "")}`}
                    >
                      {place.internationalPhoneNumber}
                    </a>
                  </Button>
                </div>
              )}

              {place.formattedAddress && (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  <Button variant="link" className="h-auto p-0" asChild>
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
                <div className="flex items-start gap-2">
                  <Clock className="mt-1 h-4 w-4" />
                  <div>
                    <div className="font-medium">
                      {place.currentOpeningHours.openNow ? "Open" : "Closed"}
                    </div>
                    <div className="text-sm text-muted-foreground">
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
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {place.priceRange.startPrice.units} -{" "}
                    {place.priceRange.endPrice.units}{" "}
                    {place.priceRange.startPrice.currencyCode}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {availableFeatures.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableFeatures.map((feature) => (
                    <Badge
                      key={feature.key}
                      className="transition-colors hover:bg-primary"
                    >
                      {feature.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
