"use client";

import { MapPin, Phone, Globe } from "lucide-react";
import { Separator } from "../ui/separator";
import type { PlaceDetails } from "@/types";
import Link from "next/link";
import { PlaceDetailsInfoItem } from "./PlaceDetailsInfoItem";
import { PlaceDetailsOpeningHours } from "./PlaceDetailsOpeningHours";

interface PlaceDetailsInformationProps {
  formattedAddress: PlaceDetails["formattedAddress"];
  internationalPhoneNumber: PlaceDetails["internationalPhoneNumber"];
  websiteUri: PlaceDetails["websiteUri"];
  currentOpeningHours: PlaceDetails["currentOpeningHours"];
  googleMapsLinks: PlaceDetails["googleMapsLinks"];
  utcOffsetMinutes?: PlaceDetails["utcOffsetMinutes"];
  nextCloseTime?: PlaceDetails["nextCloseTime"];
}

export const PlaceDetailsInformation = ({
  formattedAddress,
  internationalPhoneNumber,
  websiteUri,
  currentOpeningHours,
  googleMapsLinks,
  utcOffsetMinutes,
}: PlaceDetailsInformationProps) => {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">Information</h2>
      <div className="space-y-4">
        <PlaceDetailsInfoItem icon={MapPin} title="Address">
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
            />
          </>
        )}
      </div>
    </section>
  );
};
