import { Card } from "@/components/ui/card";
import { MapPinOff } from "lucide-react";

type FeaturedSectionErrorProps = {
  title: string;
  emptyMessage?: string;
};

export const FeaturedSectionError = ({
  title,
  emptyMessage = "No places found",
}: FeaturedSectionErrorProps) => {
  return (
    <section className="py-4">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <Card className="flex h-48 flex-col items-center justify-center gap-4 text-muted-foreground">
        <MapPinOff className="size-8" />
        <p>{emptyMessage}</p>
        <p className="text-sm">
          Try adjusting your location settings then refreshing the page
        </p>
      </Card>
    </section>
  );
};

export default FeaturedSectionError;
