"use client";

import { MapPin, Phone, Globe, Clock } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaceDetails } from "@/types";
import Link from "next/link";
import { useState } from "react";

interface PlaceDetailsInformationProps {
  formattedAddress: PlaceDetails["formattedAddress"];
  internationalPhoneNumber: PlaceDetails["internationalPhoneNumber"];
  websiteUri: PlaceDetails["websiteUri"];
  currentOpeningHours: PlaceDetails["currentOpeningHours"];
  googleMapsLinks: PlaceDetails["googleMapsLinks"];
}

export const PlaceDetailsInformation = ({
  formattedAddress,
  internationalPhoneNumber,
  websiteUri,
  currentOpeningHours,
  googleMapsLinks,
}: PlaceDetailsInformationProps) => {
  const [showAllHours, setShowAllHours] = useState(false);

  return (
    <section className="mb-6 rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">Information</h2>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Address</h3>
            <a
              href={googleMapsLinks.directionsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {formattedAddress}
            </a>
          </div>
        </div>
        {internationalPhoneNumber && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <a
                  href={`tel:${internationalPhoneNumber}`}
                  className="text-primary hover:underline"
                >
                  {internationalPhoneNumber}
                </a>
              </div>
            </div>
          </>
        )}
        {websiteUri && (
          <>
            <Separator />
            <div className="flex items-start gap-3">
              <Globe className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Website</h3>
                <Link
                  href={websiteUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {new URL(websiteUri).hostname}
                </Link>
              </div>
            </div>
          </>
        )}
        {currentOpeningHours && (
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
                      currentOpeningHours.openNow
                        ? "bg-green-500/20 text-green-600"
                        : "bg-red-500/20 text-red-600",
                    )}
                  >
                    {currentOpeningHours.openNow ? "Open" : "Closed"}
                  </p>
                </div>
                <div className="mt-2 flex flex-col items-start gap-1 text-sm">
                  {currentOpeningHours.weekdayDescriptions
                    ?.slice(0, showAllHours ? undefined : 3)
                    .map((day, index) => (
                      <p key={index} className="text-muted-foreground">
                        {day}
                      </p>
                    ))}
                  {currentOpeningHours.weekdayDescriptions &&
                    currentOpeningHours.weekdayDescriptions.length > 3 && (
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
                            Show all hours <ChevronDown className="h-3 w-3" />
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
    </section>
  );
};
