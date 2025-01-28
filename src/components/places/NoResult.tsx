import { MapPinOff } from "lucide-react";

import { Card } from "../ui/card";

interface NoResultProps {
  isError?: boolean;
}

export const NoResult = ({ isError }: NoResultProps) => {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center border-none text-muted-foreground shadow-none">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <MapPinOff className="size-8" />
        <p className="text-center">
          {isError ? "Failed to load results" : "No places found"}
        </p>
        <p className="max-w-[350px] text-center text-sm">
          Try granting location permissions then refreshing the page or you can
          enter a better search term.
        </p>
      </div>
    </Card>
  );
};
