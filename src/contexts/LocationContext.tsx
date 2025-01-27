"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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
      // Just mark as not loading, we'll use IP-based location
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

        // Request location if already granted
        if (permission.state === "granted") {
          requestLocation();
        } else {
          // For denied or prompt, we'll still request to handle the prompt case
          // and to ensure consistent behavior
          requestLocation();
        }

        // Listen for permission changes
        permission.addEventListener("change", () => {
          if (permission.state === "granted") {
            // Re-request location when permission is granted
            requestLocation();
          } else {
            // Reset coords if permission is removed
            setCoords({ latitude: null, longitude: null });
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
        // Fallback to requesting location directly
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
