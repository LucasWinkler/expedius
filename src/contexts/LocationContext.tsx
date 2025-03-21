"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  isPermissionPending: true,
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
  const [isPermissionPending, setIsPermissionPending] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionState("unavailable");
      setIsLoading(false);
      setIsPermissionPending(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const newCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setCoords(newCoords);
      setPermissionState("granted");
      setIsLoading(false);
      setIsPermissionPending(false);
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
      setIsPermissionPending(false);
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // Increased timeout to avoid premature timeouts
      maximumAge: 0,
    };

    const requestLocation = () => {
      setIsLoading(true);
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
          setIsPermissionPending(false);
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
            setIsPermissionPending(false);
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
    isPermissionPending,
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
