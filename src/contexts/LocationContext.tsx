"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type LocationPermissionState =
  | "prompt"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout";

interface LocationContextType {
  coords: LocationCoords;
  isLoading: boolean;
  error: string | null;
  permissionState: LocationPermissionState;
  isPermissionPending: boolean;
  requestLocation: () => Promise<void>;
  hasRequestedLocation: boolean;
}

export type LocationCoords = {
  latitude: number | null;
  longitude: number | null;
};

const LocationContext = createContext<LocationContextType>({
  coords: {
    latitude: null,
    longitude: null,
  },
  isLoading: false,
  error: null,
  permissionState: "prompt",
  isPermissionPending: false,
  requestLocation: async () => {},
  hasRequestedLocation: false,
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] =
    useState<LocationPermissionState>("prompt");
  const [isPermissionPending, setIsPermissionPending] = useState(false);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const newCoords = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setCoords(newCoords);
    setPermissionState("granted");
    setIsLoading(false);
    setIsPermissionPending(false);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setCoords({ latitude: null, longitude: null });

    if (err.code === 1) {
      setPermissionState("denied");
    } else if (err.code === 3) {
      setPermissionState("timeout");
      setError("Location request timed out");
    } else {
      setError(err.message || "Failed to get location");
    }

    setIsLoading(false);
    setIsPermissionPending(false);
  }, []);

  const requestLocation = useCallback(async () => {
    // If we've already requested location or are currently loading, don't request again
    if (hasRequestedLocation || isLoading) return;

    setHasRequestedLocation(true);

    if (!navigator.geolocation) {
      setPermissionState("unavailable");
      setIsLoading(false);
      setIsPermissionPending(false);
      return;
    }

    setIsLoading(true);
    setIsPermissionPending(true);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "granted") {
        setPermissionState("granted");
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          options,
        );
      } else if (permission.state === "denied") {
        setPermissionState("denied");
        setIsLoading(false);
        setIsPermissionPending(false);
      } else {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          options,
        );
      }

      permission.addEventListener("change", () => {
        if (permission.state === "granted") {
          setPermissionState("granted");
          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            options,
          );
        } else if (permission.state === "denied") {
          setPermissionState("denied");
          setCoords({ latitude: null, longitude: null });
          setIsLoading(false);
          setIsPermissionPending(false);
        }
      });
    } catch (error) {
      console.error("Error checking geolocation permission:", error);
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options,
      );
    }
  }, [handleSuccess, handleError, hasRequestedLocation, isLoading]);

  const value = {
    coords,
    isLoading,
    error,
    permissionState,
    isPermissionPending,
    requestLocation,
    hasRequestedLocation,
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
