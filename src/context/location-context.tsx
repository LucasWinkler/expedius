"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useGeolocated } from "react-geolocated";

interface LocationContextType {
  coords: {
    latitude: number | null;
    longitude: number | null;
  };
  isLoading: boolean;
  error: string | null;
}

const LocationContext = createContext<LocationContextType>({
  coords: {
    latitude: null,
    longitude: null,
  },
  isLoading: true,
  error: null,
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      watchPosition: false,
      suppressLocationOnMount: false, // This will trigger the location prompt on mount
    });

  const value = {
    coords: {
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    },
    isLoading: !isGeolocationAvailable || !isGeolocationEnabled,
    error: !isGeolocationAvailable
      ? "Your browser does not support geolocation"
      : !isGeolocationEnabled
        ? "Location services are disabled"
        : null,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
