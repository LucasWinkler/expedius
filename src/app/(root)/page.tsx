import dynamic from "next/dynamic";
import { createMetadata } from "@/lib/metadata";
import { HomeHero, HomeFeatures } from "@/components/home";
import { HomeCtaSkeleton } from "@/components/home/HomeCtaSkeleton";
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

const HomeCta = dynamic(
  () =>
    import("@/components/home/HomeCta").then((mod) => ({
      default: mod.HomeCta,
    })),
  {
    loading: HomeCtaSkeleton,
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
