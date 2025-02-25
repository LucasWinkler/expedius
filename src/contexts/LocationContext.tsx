"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define possible location permission states
export type LocationPermissionState =
  | "prompt" // Initial state, permission not yet requested
  | "granted" // User granted permission
  | "denied" // User denied permission
  | "unavailable" // Geolocation API not available
  | "timeout"; // Geolocation request timed out

interface LocationContextType {
  coords: LocationCoords;
  isLoading: boolean;
  error: string | null;
  permissionState: LocationPermissionState;
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
  isLoading: true,
  error: null,
  permissionState: "prompt",
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [coords, setCoords] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] =
    useState<LocationPermissionState>("prompt");

  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionState("unavailable");
      setIsLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setPermissionState("granted");
      setIsLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
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
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        options,
      );
    };

    const checkPermission = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "granted") {
          setPermissionState("granted");
          requestLocation();
        } else if (permission.state === "denied") {
          setPermissionState("denied");
          setIsLoading(false);
        } else {
          requestLocation();
        }

        permission.addEventListener("change", () => {
          if (permission.state === "granted") {
            setPermissionState("granted");
            requestLocation();
          } else if (permission.state === "denied") {
            setPermissionState("denied");
            setCoords({ latitude: null, longitude: null });
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
        requestLocation();
      }
    };

    void checkPermission();
  }, []);

  const value = {
    coords,
    isLoading,
    error,
    permissionState,
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
