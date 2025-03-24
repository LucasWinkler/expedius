import { createMetadata } from "@/lib/metadata";
import { DiscoverContent } from "@/components/discover/DiscoverContent";

export const metadata = createMetadata({
  title: "Start discovering",
  description:
    "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
  canonicalUrlRelative: "/discover",
});

const DiscoverPage = () => {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Discover
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Search near you or anywhere in the world.
        </p>
      </div>

      <DiscoverContent />
    </div>
  );
};

export default DiscoverPage;
