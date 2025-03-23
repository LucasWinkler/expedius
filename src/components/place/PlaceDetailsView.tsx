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
    <article className="container relative mx-auto px-4 py-8 sm:space-y-8 md:py-12 xl:max-w-7xl xl:space-y-12 xl:py-16">
      <PlaceDetailsHeader
        displayName={place.displayName}
        rating={place.rating}
        userRatingCount={place.userRatingCount}
        priceLevel={place.priceLevel}
        types={place.types}
        googleMapsLinks={place.googleMapsLinks}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-6 lg:w-2/3">
          {place.photos?.length ? (
            <PlaceImageCarousel
              photos={place.photos}
              placeName={place.displayName.text}
            />
          ) : null}

          <PlaceDetailsActions
            id={place.id}
            displayName={place.displayName}
            editorialSummary={place.editorialSummary}
            googleMapsLinks={place.googleMapsLinks}
          />

          {place.editorialSummary && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Overview</h2>
              <p className="text-muted-foreground">
                {place.editorialSummary?.text}
              </p>
            </section>
          )}

          <div className="lg:hidden">
            <PlaceDetailsInformation
              formattedAddress={place.formattedAddress}
              internationalPhoneNumber={place.internationalPhoneNumber}
              websiteUri={place.websiteUri}
              currentOpeningHours={place.currentOpeningHours}
              googleMapsLinks={place.googleMapsLinks}
              utcOffsetMinutes={place.utcOffsetMinutes}
              nextCloseTime={place.nextCloseTime}
            />
          </div>

          {availableFeatures.length > 0 && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availableFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="size-2 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {place.location && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Location</h2>
              <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                <PlaceMap
                  lat={place.location.latitude}
                  lng={place.location.longitude}
                />
              </div>
              <a
                href={place.googleMapsLinks.directionsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {place.formattedAddress}
              </a>
            </section>
          )}

          <div className="lg:hidden">
            <PlaceDetailsReviews
              googleMapsLinks={place.googleMapsLinks}
              reviews={place.reviews}
            />
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/3 lg:flex-col lg:gap-6">
          <PlaceDetailsInformation
            formattedAddress={place.formattedAddress}
            internationalPhoneNumber={place.internationalPhoneNumber}
            websiteUri={place.websiteUri}
            currentOpeningHours={place.currentOpeningHours}
            googleMapsLinks={place.googleMapsLinks}
            utcOffsetMinutes={place.utcOffsetMinutes}
            nextCloseTime={place.nextCloseTime}
          />

          <PlaceDetailsReviews
            googleMapsLinks={place.googleMapsLinks}
            reviews={place.reviews}
          />
        </div>
      </div>
    </article>
  );
}
