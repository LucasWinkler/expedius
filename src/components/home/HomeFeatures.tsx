import { ListPlus, Bookmark, Share2, MapPin, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HomeFeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const HomeFeatures = () => {
  const features: HomeFeatureProps[] = [
    {
      title: "Create Lists",
      description: "Organize places into custom collections for easy access",
      icon: ListPlus,
    },
    {
      title: "Save Favourites",
      description: "Keep track of places you love and want to visit",
      icon: Bookmark,
    },
    {
      title: "Share Places",
      description: "Share your discoveries with friends and family",
      icon: Share2,
    },
    {
      title: "Discover Local",
      description: "Find hidden gems and popular spots nearby",
      icon: MapPin,
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-8 text-center md:mb-16">
        <Badge variant="eyebrow" className="mb-3">
          Features
        </Badge>
        <h2 className="text-balance text-3xl font-semibold lg:text-4xl">
          Simplify your exploration
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything you need to discover and organize your favourite spots
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="group flex flex-col items-center rounded-lg border border-border/20 p-6 text-center shadow-md transition-colors hover:bg-muted/50 sm:items-start sm:text-left"
          >
            <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3.5 text-primary">
              <Icon className="size-7" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
