import dynamicImport from "next/dynamic";
import { createMetadata } from "@/lib/metadata";
import { HomeHero, HomeFeatures, HomeCta } from "@/components/home";
import { CategoryCarouselsSkeleton } from "@/components/home/CategoryCarousel/CategoryCarouselsSkeleton";
import { HomeFaq } from "@/components/home/HomeFaq";

export const dynamic = "force-static";

const CategoryCarousels = dynamicImport(
  () =>
    import("@/components/home/CategoryCarousel/HomeCarousels").then((mod) => ({
      default: mod.HomeCarousels,
    })),
  {
    loading: CategoryCarouselsSkeleton,
  },
);

export const metadata = createMetadata({
  title: "Discover your next adventure",
});

const Home = () => {
  return (
    <>
      <HomeHero />
      <HomeFeatures />
      <CategoryCarousels />
      <HomeCta />
      <HomeFaq />
    </>
  );
};

export default Home;
