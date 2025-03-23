"use client";

import { MapPin, Phone, Globe } from "lucide-react";
import { Separator } from "../ui/separator";
import type { PlaceDetails } from "@/types";
import Link from "next/link";
import { PlaceDetailsInfoItem } from "./PlaceDetailsInfoItem";
import { PlaceDetailsOpeningHours } from "./PlaceDetailsOpeningHours";
import { useLocation } from "@/contexts/LocationContext";
import { useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import { calculateDistance } from "@/utils/places";

interface PlaceDetailsInformationProps {
  formattedAddress: PlaceDetails["formattedAddress"];
  internationalPhoneNumber: PlaceDetails["internationalPhoneNumber"];
  websiteUri: PlaceDetails["websiteUri"];
  currentOpeningHours: PlaceDetails["currentOpeningHours"];
  googleMapsLinks: PlaceDetails["googleMapsLinks"];
  utcOffsetMinutes?: PlaceDetails["utcOffsetMinutes"];
  displayName: PlaceDetails["displayName"];
  location?: { latitude: number; longitude: number } | null;
}

export const PlaceDetailsInformation = ({
  formattedAddress,
  internationalPhoneNumber,
  websiteUri,
  currentOpeningHours,
  googleMapsLinks,
  utcOffsetMinutes,
  displayName,
  location,
}: PlaceDetailsInformationProps) => {
  const {
    coords,
    isLoading: isLoadingLocation,
    permissionState,
    requestLocation,
    hasRequestedLocation,
    error,
  } = useLocation();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !hasRequestedLocation &&
      permissionState === "prompt"
    ) {
      requestLocation();
    }
  }, [requestLocation, hasRequestedLocation, permissionState]);

  const distance = useMemo(() => {
    if (
      !location ||
      permissionState !== "granted" ||
      isLoadingLocation ||
      coords.latitude === null ||
      coords.longitude === null
    ) {
      return null;
    }

    const kmDistance = calculateDistance(
      coords.latitude,
      coords.longitude,
      location.latitude,
      location.longitude,
      "km",
    );

    const miDistance = calculateDistance(
      coords.latitude,
      coords.longitude,
      location.latitude,
      location.longitude,
      "mi",
    );

    return { km: kmDistance, mi: miDistance };
  }, [coords, location, permissionState, isLoadingLocation]);

  const handleLocationRequest = () => {
    requestLocation();
  };

  const DistanceDisplay = () => {
    if (!location) return null;

    if (distance && distance.km !== null && distance.mi !== null) {
      return (
        <span className="ml-2 text-sm text-muted-foreground">
          ({distance.km} km / {distance.mi} mi)
        </span>
      );
    }

    if (isLoadingLocation) {
      return (
        <span className="ml-2 animate-pulse text-sm text-muted-foreground">
          Getting distance...
        </span>
      );
    }

    if (permissionState === "denied") {
      return (
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            window.alert(
              "Please enable location access in your browser settings to see distance information.",
            );
          }}
          className="ml-2 h-auto p-0 text-xs font-normal text-muted-foreground hover:text-primary"
        >
          Enable location
        </Button>
      );
    }

    if (
      permissionState !== "granted" ||
      coords.latitude === null ||
      coords.longitude === null
    ) {
      return (
        <Button
          variant="link"
          size="sm"
          onClick={handleLocationRequest}
          className="ml-2 h-auto p-0 text-xs font-normal text-muted-foreground hover:text-primary"
        >
          Show distance
        </Button>
      );
    }

    if (error) {
      return (
        <span className="ml-2 text-sm text-muted-foreground">
          Could not get distance
        </span>
      );
    }

    return null;
  };

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">Information</h2>
      <div className="space-y-4">
        <PlaceDetailsInfoItem
          icon={MapPin}
          title="Address"
          titleSuffix={<DistanceDisplay />}
        >
          <a
            href={googleMapsLinks.directionsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {formattedAddress}
          </a>
        </PlaceDetailsInfoItem>

        {internationalPhoneNumber && (
          <>
            <Separator />
            <PlaceDetailsInfoItem icon={Phone} title="Phone">
              <a
                href={`tel:${internationalPhoneNumber}`}
                className="text-primary hover:underline"
              >
                {internationalPhoneNumber}
              </a>
            </PlaceDetailsInfoItem>
          </>
        )}

        {websiteUri && (
          <>
            <Separator />
            <PlaceDetailsInfoItem icon={Globe} title="Website">
              <Link
                href={websiteUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {new URL(websiteUri).hostname}
              </Link>
            </PlaceDetailsInfoItem>
          </>
        )}

        {currentOpeningHours && (
          <>
            <Separator />
            <PlaceDetailsOpeningHours
              currentOpeningHours={currentOpeningHours}
              utcOffsetMinutes={utcOffsetMinutes}
              displayName={displayName}
            />
          </>
        )}
      </div>
    </section>
  );
};
