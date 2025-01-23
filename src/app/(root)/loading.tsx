import DiscoverHero from "@/components/discover/DiscoverHero";
import FeaturedSectionSkeleton from "@/components/discover/FeaturedSectionSkeleton";

const Loading = () => {
  return (
    <>
      <DiscoverHero />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <FeaturedSectionSkeleton />
      </div>
    </>
  );
};

export default Loading;
