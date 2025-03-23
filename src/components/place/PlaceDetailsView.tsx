"use client";

import type { PlaceDetails } from "@/types";
import { PlaceImageCarousel } from "./PlaceImageCarousel";
import { PLACE_FEATURES } from "@/constants/places";
import { formatBooleanFeatures } from "@/utils/places";
import { PlaceDetailsHeader } from "./PlaceDetailsHeader";
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col space-y-6 lg:col-span-8 lg:col-start-1">
          {place.photos?.length ? (
            <PlaceImageCarousel
              photos={place.photos}
              placeName={place.displayName.text}
            />
          ) : null}

          <div className="order-1 lg:order-none">
            <PlaceDetailsActions
              id={place.id}
              displayName={place.displayName}
              editorialSummary={place.editorialSummary}
              googleMapsLinks={place.googleMapsLinks}
            />
          </div>

          {place.editorialSummary && (
            <div className="order-2 lg:order-none">
              <section className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Overview</h2>
                <p className="text-muted-foreground">
                  {place.editorialSummary?.text}
                </p>
              </section>
            </div>
          )}

          {availableFeatures.length > 0 && (
            <div className="order-4 lg:order-none">
              <section className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="size-2 shrink-0 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {place.location && (
            <div className="order-5 lg:order-none">
              <section className="rounded-lg border border-border bg-card p-6">
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
              </section>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:col-span-4 lg:col-start-9">
          <div className="order-3 lg:order-none">
            <PlaceDetailsInformation
              formattedAddress={place.formattedAddress}
              internationalPhoneNumber={place.internationalPhoneNumber}
              websiteUri={place.websiteUri}
              currentOpeningHours={place.currentOpeningHours}
              googleMapsLinks={place.googleMapsLinks}
            />
          </div>

          <div className="order-6 lg:order-none">
            <PlaceDetailsReviews
              googleMapsLinks={place.googleMapsLinks}
              reviews={place.reviews}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
