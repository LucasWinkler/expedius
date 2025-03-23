"use client";

import type { PlaceDetails } from "@/types";
import { PlaceImageCarousel } from "./PlaceImageCarousel";
import { PLACE_FEATURES } from "@/constants/places";
import { formatBooleanFeatures } from "@/utils/places";
import { PlaceDetailsHeader } from "./PlaceDetailsHeader";
import { Card } from "../ui/card";
import { PlaceDetailsInformation } from "./PlaceDetailsInformation";
import { PlaceDetailsReviews } from "./PlaceDetailsReviews";
import PlaceMap from "./PlaceMap";
import { PlaceDetailsActions } from "./PlaceDetailsActions";

interface PlaceDetailsViewProps {
  place: PlaceDetails;
}

export function PlaceDetailsView({ place }: PlaceDetailsViewProps) {
  const availableFeatures = formatBooleanFeatures(place, PLACE_FEATURES);

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
        <div className="space-y-6 lg:col-span-2">
          {place.photos?.length && (
            <PlaceImageCarousel
              photos={place.photos}
              placeName={place.displayName.text}
            />
          )}
          <div className="space-y-6">
            <PlaceDetailsActions
              id={place.id}
              displayName={place.displayName}
              editorialSummary={place.editorialSummary}
              googleMapsLinks={place.googleMapsLinks}
            />
            {place.editorialSummary && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Overview</h2>
                <p className="text-muted-foreground">
                  {place.editorialSummary?.text}
                </p>
              </Card>
            )}
            {availableFeatures.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            {place.location && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Location</h2>
                <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                  <PlaceMap
                    lat={place.location.latitude}
                    lng={place.location.longitude}
                  />
                </div>
                <p className="text-muted-foreground">
                  {place.formattedAddress}
                </p>
              </Card>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <PlaceDetailsInformation
            formattedAddress={place.formattedAddress}
            internationalPhoneNumber={place.internationalPhoneNumber}
            websiteUri={place.websiteUri}
            currentOpeningHours={place.currentOpeningHours}
            googleMapsLinks={place.googleMapsLinks}
          />
          <PlaceDetailsReviews
            googleMapsLinks={place.googleMapsLinks}
            reviews={place.reviews}
          />
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
