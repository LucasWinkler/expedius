import { MapPin } from "lucide-react";

interface ListMetadataProps {
  placesCount: number;
  isPublic?: boolean;
  showPrivacyBadge?: boolean;
}

export const ListMetadata = ({
  placesCount,
  isPublic,
  showPrivacyBadge,
}: ListMetadataProps) => (
  <div className="flex items-end justify-between pt-3 sm:pt-0">
    <div className="inline-flex items-center rounded-md text-sm text-muted-foreground">
      <MapPin className="mr-1.5 size-3.5" />
      <span>
        {placesCount} place{placesCount !== 1 ? "s" : ""}
      </span>
    </div>

    {showPrivacyBadge && (
      <span className="text-xs text-muted-foreground">
        {isPublic ? "Public" : "Private"}
      </span>
    )}
  </div>
);
