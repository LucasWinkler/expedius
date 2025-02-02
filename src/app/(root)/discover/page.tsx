import { LocationProvider } from "@/contexts/LocationContext";
import { createMetadata } from "@/lib/metadata";
import { DiscoverContent } from "@/components/discover/DiscoverContent";

type DiscoverPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const generateMetadata = async ({ searchParams }: DiscoverPageProps) => {
  const query = (await searchParams).q;

  return createMetadata({
    title: query ? `Discover ${query}` : "Start discovering",
    description:
      "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
  });
};

const DiscoverPage = () => {
  return (
    <LocationProvider>
      <DiscoverContent />
    </LocationProvider>
  );
};

export default DiscoverPage;
