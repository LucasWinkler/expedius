"use client";

import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";

interface PlaceDetailsMapProps {
  lat: number;
  lng: number;
}

export default function PlaceDetailsMap({ lat, lng }: PlaceDetailsMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiConfig, setApiConfig] = useState<{
    apiKey: string;
    libraries?: string[];
    version?: string;
  } | null>(null);
  const [isError, setIsError] = useState(false);
  const position = { lat, lng };

  useEffect(() => {
    async function fetchMapsConfig() {
      try {
        const response = await fetch("/api/maps");
        if (!response.ok) {
          throw new Error("Failed to load Maps API configuration");
        }
        const config = await response.json();
        setApiConfig(config);
      } catch (error) {
        console.error("Error loading Maps:", error);
        setIsError(true);
      }
    }

    fetchMapsConfig();
  }, []);

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
        Failed to load Google Maps
      </div>
    );
  }

  if (!apiConfig) {
    return (
      <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
        Loading Maps...
      </div>
    );
  }

  return (
    <div className="relative size-full">
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted text-muted-foreground">
          Loading Maps...
        </div>
      )}

      <APIProvider
        apiKey={apiConfig.apiKey}
        version={apiConfig.version}
        libraries={apiConfig.libraries}
        onLoad={() => setIsLoaded(true)}
      >
        <Map
          fullscreenControl
          defaultCenter={position}
          defaultZoom={15}
          mapId="poi-details-map"
          gestureHandling="greedy"
          className="size-full rounded-md"
        >
          <AdvancedMarker position={position}>
            <Pin />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
