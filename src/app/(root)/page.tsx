import HomeHero from "@/components/home/HomeHero";
import { CategoryCarousels } from "@/components/home/CategoryCarousel";
import { createMetadata } from "@/lib/metadata";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeFeatures } from "@/components/home/HomeFeatures";

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
