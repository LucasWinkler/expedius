import { Card } from "@/components/ui/card";

type FeaturedSectionErrorProps = {
  title: string;
};

export const FeaturedSectionError = ({ title }: FeaturedSectionErrorProps) => {
  return (
    <section className="py-4">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <Card className="flex h-48 items-center justify-center text-muted-foreground">
        Failed to load {title.toLowerCase()}. Please try again later.
      </Card>
    </section>
  );
};

export default FeaturedSectionError;
