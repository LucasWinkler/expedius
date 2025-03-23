interface PlaceMapProps {
  lat: number;
  lng: number;
}

export default function PlaceMap({ lat, lng }: PlaceMapProps) {
  return (
    <div className="relative size-full">
      <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
        Google Maps Placeholder
      </div>
      <div className="absolute bottom-2 left-2 rounded bg-neutral-700/15 px-2 py-1 text-xs">
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>
    </div>
  );
}
