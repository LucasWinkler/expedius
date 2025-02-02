import { LocationProvider } from "@/contexts/LocationContext";
import { createMetadata } from "@/lib/metadata";
import { DiscoverContent } from "@/components/discover/DiscoverContent";

export const metadata = createMetadata({
  title: "Start discovering",
  description:
    "Search near you or anywhere in the world. Find the perfect spots for your next adventure.",
});

const DiscoverPage = () => {
  return (
    <LocationProvider>
      <DiscoverContent />
    </LocationProvider>
  );
};

export default DiscoverPage;
