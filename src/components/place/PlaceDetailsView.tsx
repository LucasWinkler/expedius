"use client";

import type { PlaceDetails } from "@/types";
import { PlaceDetailsCarousel } from "./PlaceDetailsCarousel";
import { PLACE_FEATURES } from "@/constants/places";
import { formatBooleanFeatures } from "@/utils/places";
import { PlaceDetailsHeader } from "./PlaceDetailsHeader";
import { PlaceDetailsInformation } from "./PlaceDetailsInformation";
import { PlaceDetailsReviews } from "./PlaceDetailsReviews";
import PlaceDetailsMap from "./PlaceDetailsMap";
import { PlaceDetailsActions } from "./PlaceDetailsActions";
import { PlaceDetailsAmenities } from "./PlaceDetailsAmenities";

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
            <PlaceDetailsCarousel
              photos={place.photos}
              placeName={place.displayName.text}
              showThumbnails={false}
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
              displayName={place.displayName}
              formattedAddress={place.formattedAddress}
              internationalPhoneNumber={place.internationalPhoneNumber}
              websiteUri={place.websiteUri}
              currentOpeningHours={place.currentOpeningHours}
              googleMapsLinks={place.googleMapsLinks}
              utcOffsetMinutes={place.utcOffsetMinutes}
              location={place.location}
            />
          </div>

          {availableFeatures.length > 0 && (
            <PlaceDetailsAmenities features={availableFeatures} />
          )}

          {place.location && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Location</h2>
              <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                <PlaceDetailsMap
                  lat={place.location.latitude}
                  lng={place.location.longitude}
                />
              </div>
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
            displayName={place.displayName}
            formattedAddress={place.formattedAddress}
            internationalPhoneNumber={place.internationalPhoneNumber}
            websiteUri={place.websiteUri}
            currentOpeningHours={place.currentOpeningHours}
            googleMapsLinks={place.googleMapsLinks}
            utcOffsetMinutes={place.utcOffsetMinutes}
            location={place.location}
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
