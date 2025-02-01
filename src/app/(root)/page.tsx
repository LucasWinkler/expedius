import HomeHero from "@/components/home/HomeHero";
import { CategoryCarousels } from "@/components/home/CategoryCarousel";
import { createMetadata } from "@/lib/metadata";

export const revalidate = 3600;

export const metadata = createMetadata({
  title: "Discover your next adventure",
});

const Home = () => {
  return (
    <>
      <HomeHero />
      <CategoryCarousels />
    </>
  );
};

export default Home;
