import dynamic from "next/dynamic";
import { createMetadata } from "@/lib/metadata";
import { HomeHero, HomeFeatures, HomeCta } from "@/components/home";
import { CategoryCarouselsSkeleton } from "@/components/home/CategoryCarousel/CategoryCarouselsSkeleton";

const CategoryCarousels = dynamic(
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
