import dynamicImport from "next/dynamic";
import { createMetadata } from "@/lib/metadata";
import { HomeHero, HomeFeatures, HomeCta } from "@/components/home";
import { CategoryCarouselsSkeleton } from "@/components/home/CategoryCarousel/CategoryCarouselsSkeleton";

export const dynamic = "force-static";

const CategoryCarousels = dynamicImport(
  () =>
    import("@/components/home/CategoryCarousel/CategoryCarousels").then(
      (mod) => ({
        default: mod.CategoryCarousels,
      }),
    ),
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
    </>
  );
};

export default Home;
