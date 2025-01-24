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
      <Card className="flex h-48 flex-col items-center justify-center gap-4 p-6 text-muted-foreground">
        <MapPinOff className="h-8 w-8" />
        <p className="max-w-[250px] text-center">{emptyMessage}</p>
        <p className="max-w-[250px] text-center text-sm">
          Try granting location permissions then refreshing the page.
        </p>
      </Card>
    </section>
  );
};

export default FeaturedSectionError;
