import { createMetadata } from "@/lib/metadata";
import {
  HomeHero,
  HomeCta,
  HomeFeatures,
  CategoryCarousels,
} from "@/components/home";

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
