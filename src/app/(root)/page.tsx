import { Suspense } from "react";
import FeaturedSectionSkeleton from "@/components/home/FeaturedSectionSkeleton";
import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
// import FeaturedSections from "@/components/home/FeaturedSections";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Discover your next adventure",
};

const Home = () => {
  return (
    <>
      <HomeHero />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<FeaturedSectionSkeleton />}>
          {/* <FeaturedSections /> */}
        </Suspense>
      </div>
    </>
  );
};

export default Home;
