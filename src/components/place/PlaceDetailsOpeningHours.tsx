"use client";

import { Clock, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import type { PlaceDetails } from "@/types";
import { useState } from "react";
import {
  getCurrentDayAtLocation,
  getCurrentDayHours,
  getNextDayAtLocation,
  getNextDayHours,
  getDayName,
} from "@/utils/places";

interface PlaceDetailsOpeningHoursProps {
  currentOpeningHours: PlaceDetails["currentOpeningHours"];
  utcOffsetMinutes?: PlaceDetails["utcOffsetMinutes"];
  displayName: PlaceDetails["displayName"];
}

export const PlaceDetailsOpeningHours = ({
  currentOpeningHours,
  utcOffsetMinutes,
  displayName,
}: PlaceDetailsOpeningHoursProps) => {
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);

  const currentDayAtLocation = getCurrentDayAtLocation(utcOffsetMinutes);
  const currentDayName = getDayName(currentDayAtLocation);
  const currentDayHours = getCurrentDayHours(
    currentDayAtLocation,
    currentOpeningHours,
  );

  const nextDayAtLocation = getNextDayAtLocation(utcOffsetMinutes);
  const nextDayName = getDayName(nextDayAtLocation);
  const nextDayHours = getNextDayHours(nextDayAtLocation, currentOpeningHours);

  const extractHours = (dayString: string | null) => {
    if (!dayString) return "";
    return dayString.includes(": ") ? dayString.split(": ")[1] : dayString;
  };

  if (!currentOpeningHours) return null;

  return (
    <>
      <div className="flex items-start gap-3">
        <Clock className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="w-full">
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
          {currentDayHours && (
            <div className="mt-2 flex flex-col items-start gap-1 text-sm">
              <p className="flex flex-wrap items-baseline text-foreground">
                <span className="mr-1 font-medium">
                  Today ({currentDayName}):
                </span>
                <span className="inline-block">
                  {extractHours(currentDayHours)}
                </span>
              </p>
            </div>
          )}
          {nextDayHours &&
            currentDayHours &&
            nextDayHours !== currentDayHours && (
              <p className="mt-1 flex flex-wrap items-baseline text-sm text-muted-foreground">
                <span className="mr-1 font-medium">
                  Tomorrow ({nextDayName}):
                </span>
                <span className="inline-block">
                  {extractHours(nextDayHours)}
                </span>
              </p>
            )}
          {currentOpeningHours.weekdayDescriptions &&
            currentOpeningHours.weekdayDescriptions.length > 2 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full hover:bg-transparent hover:text-primary sm:w-auto"
                onClick={() => setHoursDialogOpen(true)}
              >
                View all hours
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            )}
        </div>
      </div>

      <Dialog open={hoursDialogOpen} onOpenChange={setHoursDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Opening Hours</DialogTitle>
            <DialogDescription>
              View the complete weekly schedule for {displayName.text}
            </DialogDescription>
          </DialogHeader>
          {currentOpeningHours?.weekdayDescriptions && (
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {currentOpeningHours.weekdayDescriptions.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between rounded-md px-3 py-2",
                    index === currentDayAtLocation && "bg-primary/10",
                  )}
                >
                  <span
                    className={
                      index === currentDayAtLocation ? "font-medium" : ""
                    }
                  >
                    {day}
                  </span>
                  {index === currentDayAtLocation && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 text-xs font-medium",
                        currentOpeningHours.openNow
                          ? "bg-green-500/20 text-green-600"
                          : "bg-red-500/20 text-red-600",
                      )}
                    >
                      {currentOpeningHours.openNow ? "Open" : "Closed"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
