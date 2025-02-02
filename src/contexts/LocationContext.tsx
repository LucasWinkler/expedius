"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface LocationContextType {
  coords: LocationCoords;
  isLoading: boolean;
  error: string | null;
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

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIsLoading(false);
    };

    const handleError = () => {
      setCoords({ latitude: null, longitude: null });
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
          requestLocation();
        } else {
          requestLocation();
        }

        permission.addEventListener("change", () => {
          if (permission.state === "granted") {
            requestLocation();
          } else {
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
    error: null,
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
