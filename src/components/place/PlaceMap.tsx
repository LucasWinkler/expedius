"use client";

import { useEffect, useRef } from "react";

interface PlaceMapProps {
  lat: number;
  lng: number;
}
// This is a placeholder for a real map implementation
export default function PlaceMap({ lat, lng }: PlaceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current) {
      const mapElement = mapRef.current;

      mapElement.style.backgroundColor = "#e5e7eb";
      mapElement.style.position = "relative";

      // Add a marker
      const marker = document.createElement("div");
      marker.style.position = "absolute";
      marker.style.top = "50%";
      marker.style.left = "50%";
      marker.style.transform = "translate(-50%, -50%)";
      marker.style.width = "20px";
      marker.style.height = "20px";
      marker.style.backgroundColor = "red";
      marker.style.borderRadius = "50%";
      marker.style.border = "2px solid white";

      // Add coordinates text
      const coords = document.createElement("div");
      coords.style.position = "absolute";
      coords.style.bottom = "10px";
      coords.style.left = "10px";
      coords.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      coords.style.padding = "4px 8px";
      coords.style.borderRadius = "4px";
      coords.style.fontSize = "12px";
      coords.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      mapElement.appendChild(marker);
      mapElement.appendChild(coords);
    }
  }, [lat, lng]);

  return (
    <div ref={mapRef} className="h-full w-full">
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Map placeholder - integrate with your preferred mapping library
      </div>
    </div>
  );
}
