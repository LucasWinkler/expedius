"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface LocationState {
  coords: {
    latitude: number | null;
    longitude: number | null;
  };
  isLoading: boolean;
  error: string | null;
  permissionStatus: PermissionState | null;
}

const LocationContext = createContext<LocationState>({
  coords: {
    latitude: null,
    longitude: null,
  },
  isLoading: true,
  error: null,
  permissionStatus: null,
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<LocationState>({
    coords: {
      latitude: null,
      longitude: null,
    },
    isLoading: true,
    error: null,
    permissionStatus: null,
  });

  useEffect(() => {
    let mounted = true;

    const handleSuccess = (position: GeolocationPosition) => {
      if (!mounted) return;
      setState((prev) => ({
        ...prev,
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        isLoading: false,
      }));
    };

    const handleError = (error: GeolocationPositionError) => {
      if (!mounted) return;
      setState((prev) => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    };

    const checkPermissionAndGetLocation = async () => {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        setState((prev) => ({
          ...prev,
          permissionStatus: permission.state,
        }));

        if (permission.state === "granted") {
          navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error: unknown) {
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Location permission check failed",
          isLoading: false,
        }));
      }
    };

    void checkPermissionAndGetLocation();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <LocationContext.Provider value={state}>
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
