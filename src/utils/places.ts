import { PlaceDetails } from "@/types";

export const formatPlaceType = ({
  type,
  capitalize = false,
}: {
  type: string;
  capitalize?: boolean;
}) => {
  return capitalize
    ? type
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : type.replace(/_/g, " ");
};

export const formatBooleanFeatures = (
  data: Record<string, unknown>,
  features: ReadonlyArray<{ key: string; label: string }>,
) => {
  return features
    .filter(({ key }) => {
      const value = key
        .split(".")
        .reduce<unknown>(
          (acc, k) =>
            acc && typeof acc === "object"
              ? (acc as Record<string, unknown>)[k]
              : undefined,
          data,
        );

      return typeof value === "boolean" && value === true;
    })
    .map(({ label }) => label);
};

export const getCurrentDayAtLocation = (utcOffsetMinutes?: number) => {
  if (!utcOffsetMinutes) return new Date().getDay();

  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const locationTime = new Date(utcTime + utcOffsetMinutes * 60000);

  // Convert from JavaScript day (0 = Sunday) to Google Places API day (0 = Monday)
  // This transforms: Sun(0), Mon(1), Tue(2)... to Mon(0), Tue(1), Wed(2)...
  const jsDay = locationTime.getDay();

  // Sunday (0) becomes 6, others shift by -1
  return jsDay === 0 ? 6 : jsDay - 1;
};

export const getCurrentDayHours = (
  currentDayAtLocation: number,
  currentOpeningHours: PlaceDetails["currentOpeningHours"],
) => {
  if (
    !currentOpeningHours?.weekdayDescriptions?.length ||
    currentDayAtLocation < 0
  )
    return null;
  return currentOpeningHours.weekdayDescriptions[currentDayAtLocation];
};

export const getNextDayAtLocation = (utcOffsetMinutes?: number) => {
  const currentDay = getCurrentDayAtLocation(utcOffsetMinutes);

  // Handle wrap around from 6 (Sunday in API) back to 0 (Monday in API)
  return currentDay === 6 ? 0 : currentDay + 1;
};

export const getNextDayHours = (
  nextDayAtLocation: number,
  currentOpeningHours: PlaceDetails["currentOpeningHours"],
) => {
  if (
    !currentOpeningHours?.weekdayDescriptions?.length ||
    nextDayAtLocation < 0
  )
    return null;
  return currentOpeningHours.weekdayDescriptions[nextDayAtLocation];
};

export const getDayName = (dayIndex: number) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[dayIndex];
};
