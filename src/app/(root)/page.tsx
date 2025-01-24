import { Suspense } from "react";
import FeaturedSectionSkeleton from "@/components/discover/FeaturedSectionSkeleton";
import type { Metadata } from "next";
import DiscoverHero from "@/components/discover/DiscoverHero";
import FeaturedSections from "@/components/discover/FeaturedSections";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find Your Next Adventure | PoiToGo",
};

const Home = () => {
  return (
    <>
      <DiscoverHero />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<FeaturedSectionSkeleton />}>
          <FeaturedSections />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
