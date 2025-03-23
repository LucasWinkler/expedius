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

      <div className="place-details-grid">
        {place.photos?.length ? (
          <div className="grid-area-carousel">
            <PlaceImageCarousel
              photos={place.photos}
              placeName={place.displayName.text}
            />
          </div>
        ) : null}

        <div className="grid-area-actions">
          <PlaceDetailsActions
            id={place.id}
            displayName={place.displayName}
            editorialSummary={place.editorialSummary}
            googleMapsLinks={place.googleMapsLinks}
          />
        </div>

        {place.editorialSummary && (
          <div className="grid-area-overview">
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Overview</h2>
              <p className="text-muted-foreground">
                {place.editorialSummary?.text}
              </p>
            </section>
          </div>
        )}

        <div className="grid-area-information">
          <PlaceDetailsInformation
            formattedAddress={place.formattedAddress}
            internationalPhoneNumber={place.internationalPhoneNumber}
            websiteUri={place.websiteUri}
            currentOpeningHours={place.currentOpeningHours}
            googleMapsLinks={place.googleMapsLinks}
            utcOffsetMinutes={place.utcOffsetMinutes}
          />
        </div>

        {availableFeatures.length > 0 && (
          <div className="grid-area-amenities">
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
          </div>
        )}

        {place.location && (
          <div className="grid-area-location">
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
          </div>
        )}

        <div className="grid-area-reviews">
          <PlaceDetailsReviews
            googleMapsLinks={place.googleMapsLinks}
            reviews={place.reviews}
          />
        </div>
      </div>
    </article>
  );
}
